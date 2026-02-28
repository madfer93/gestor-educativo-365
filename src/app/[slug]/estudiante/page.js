"use client";

import React, { useState, useEffect } from 'react';
import {
    Home, ClipboardList, CreditCard, FolderCheck, User, LogOut,
    CheckCircle, Clock, AlertCircle, Newspaper, GraduationCap,
    Heart, Phone, Mail, MapPin, Calendar, FileText, Shield,
    ChevronRight, BookOpen, Bell, Loader2, DollarSign, Upload, Info,
    LayoutGrid, Star, FileCheck, Building2, Landmark
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import WompiWidget from '@/components/WompiWidget';
import WellbeingModule from '@/components/WellbeingModule';

export default function StudentDashboard({ params }) {
    const [activeTab, setActiveTab] = useState('inicio');
    const [profile, setProfile] = useState(null);
    const [schoolConfig, setSchoolConfig] = useState(null);
    const [news, setNews] = useState([]);
    const [costs, setCosts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [unreadAlerts, setUnreadAlerts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ attendance: 95, tasks: 0, average: 0 });
    const [wellbeing, setWellbeing] = useState([]);
    const [realGrades, setRealGrades] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(true);
    const [uploadingDoc, setUploadingDoc] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [reportingPayment, setReportingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("online"); // online, manual
    const [selectedMonto, setSelectedMonto] = useState("");
    const [selectedConcepto, setSelectedConcepto] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("idle");

    const documentosRequeridos = [
        'Carpeta amarilla colgante oficio', 'Certificados años anteriores', 'Tres fotos 3×4 fondo azul',
        'Fotocopia documento identidad', 'Fotocopia C.C. acudientes', 'Registro civil',
        'Retiro del SIMAT', 'Copia recibo servicio público', 'Copia seguro de salud',
        'Diagnóstico médico', 'Carné de vacunas'
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Get the current user session
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.href = `/${params.slug}/login`;
                    return;
                }

                // Get the school
                const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
                if (school) {
                    setSchoolConfig(school);

                    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    setProfile(prof);

                    // Fetch grades
                    const { data: gradesData } = await supabase
                        .from('calificaciones')
                        .select('*')
                        .eq('student_id', user.id)
                        .order('fecha', { ascending: false });
                    setRealGrades(gradesData || []);

                    if (gradesData?.length) {
                        const avg = gradesData.reduce((sum, g) => sum + Number(g.nota), 0) / gradesData.length;
                        setStats(prev => ({ ...prev, average: avg.toFixed(1) }));
                    }
                    setLoadingGrades(false);

                    if (prof) {
                        // Activities for student's grade
                        const { data: acts } = await supabase.from('school_activities')
                            .select('*')
                            .eq('school_id', school.id)
                            .or(`grado.eq.${prof.grado},grado.eq.General`)
                            .order('created_at', { ascending: false });
                        setActivities(acts || []);
                        setStats(prev => ({ ...prev, tasks: acts?.length || 0 }));

                        // Alerts
                        const { data: alertData } = await supabase.from('wellbeing_alerts')
                            .select('*')
                            .eq('student_id', prof.id)
                            .order('created_at', { ascending: false });
                        setAlerts(alertData || []);
                        setUnreadAlerts(alertData?.filter(a => !a.read).length || 0);
                    }

                    const { data: newsData } = await supabase.from('school_news').select('*').eq('school_id', school.id).order('published_at', { ascending: false }).limit(10);
                    setNews(newsData || []);

                    // Costs
                    const { data: costsData } = await supabase.from('school_costs').select('*').eq('school_id', school.id).order('display_order', { ascending: true });
                    setCosts(costsData || []);

                    // Payment History
                    const { data: payHistory } = await supabase.from('pagos_estudiantes')
                        .select('*')
                        .eq('student_id', user.id)
                        .order('created_at', { ascending: false });
                    setPaymentHistory(payHistory || []);

                    // Set default payment values
                    if (costsData?.length > 0) {
                        setSelectedConcepto(costsData[0].concept);
                        setSelectedMonto(costsData[0].value?.replace(/[^0-9]/g, '') || "");
                    }
                }
            } catch (err) {
                console.error('Error loading student data:', err);
            }
            setLoading(false);
        };
        loadData();
    }, [params.slug]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = `/${params.slug}/login`;
    };

    const handleMarkAlertsRead = async () => {
        if (unreadAlerts > 0 && profile) {
            await supabase.from('wellbeing_alerts').update({ read: true }).eq('student_id', profile.id);
            setUnreadAlerts(0);
        }
    };

    const handleReportManualPayment = async (method, file) => {
        if (!file || !profile) return;
        setReportingPayment(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}/PAGO_${method}_${Date.now()}.${fileExt}`;

            // 1. Subir comprobante
            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Registrar pago como "Pendiente"
            const { error: dbError } = await supabase.from('pagos_estudiantes').insert([{
                student_id: profile.id,
                school_id: schoolConfig.id,
                amount: totalCost,
                concept: `Reporte de Pago (${method})`,
                method: method,
                status: 'Pendiente',
                receipt_url: fileName
            }]);

            if (dbError) throw dbError;

            alert('Comprobante reportado. Tesorería validará tu pago pronto.');

            // 3. Refresh history
            const { data: newHistory } = await supabase.from('pagos_estudiantes')
                .select('*')
                .eq('student_id', profile.id)
                .order('created_at', { ascending: false });
            setPaymentHistory(newHistory || []);

        } catch (err) {
            console.error('Error reporting payment:', err);
            alert('Error al reportar: ' + err.message);
        } finally {
            setReportingPayment(false);
        }
    };

    // Calculate document completion
    const docsEntregados = profile?.documentos_entregados || {};
    const docsCompleted = documentosRequeridos.filter(d => docsEntregados[d]).length;
    const docsTotal = documentosRequeridos.length;
    const docsPercent = Math.round((docsCompleted / docsTotal) * 100);

    const getGradeCosts = () => {
        if (!costs.length || !profile?.grado) return [];
        return costs;
    };
    const totalCost = getGradeCosts().reduce((sum, c) => {
        const val = parseInt(String(c.value).replace(/[^0-9]/g, ''), 10) || 0;
        return sum + val;
    }, 0);

    const tabs = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'tareas', label: 'Actividades', icon: ClipboardList },
        { id: 'calificaciones', label: 'Calificaciones', icon: Star },
        { id: 'pagos', label: 'Pagos', icon: CreditCard },
        { id: 'documentos', label: 'Documentos', icon: FolderCheck },
        { id: 'bienestar', label: 'Bienestar', icon: Heart },
        { id: 'perfil', label: 'Mi Perfil', icon: User },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-institutional-blue mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Cargando tu portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-sans">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {schoolConfig?.logo_url && (
                            <img src={schoolConfig.logo_url} alt="Logo" className="w-9 h-9 rounded-xl object-contain" />
                        )}
                        <div>
                            <h1 className="text-sm font-black text-institutional-blue tracking-tight leading-none">
                                {schoolConfig?.nombre || 'Mi Colegio'}
                            </h1>
                            <p className="text-[9px] text-institutional-magenta font-black uppercase tracking-[0.2em]">
                                Portal Estudiante
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative mr-2">
                            <button onClick={handleMarkAlertsRead} className="p-2 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all relative group">
                                <Bell size={20} className="text-gray-400 group-hover:text-institutional-blue transition-colors" />
                                {unreadAlerts > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                        {unreadAlerts}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-gray-800">{profile?.nombre}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{profile?.grado}</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-br from-institutional-blue to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-200">
                            {profile?.nombre?.charAt(0) || '?'}
                        </div>
                        <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500" title="Cerrar sesión">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <aside className="lg:w-56 flex-shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 lg:sticky lg:top-20">
                        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-institutional-blue text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    <span className="hidden lg:inline">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">

                    {/* ===================== TAB: BIENESTAR ===================== */}
                    {activeTab === 'bienestar' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-[32px] p-8 text-white relative overflow-hidden mb-6">
                                <div className="relative z-10">
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Centro de Bienestar</h2>
                                    <p className="text-rose-100 font-medium mt-1">Estamos aquí para apoyarte en cualquier situación.</p>
                                </div>
                            </div>
                            <WellbeingModule studentId={profile?.id} schoolId={schoolConfig?.id} />
                        </div>
                    )}
                    {/* ===================== TAB: INICIO ===================== */}
                    {activeTab === 'inicio' && (
                        <div className="space-y-6">
                            {/* Alert Shortcut at the Top */}
                            <div className="bg-white rounded-3xl border-2 border-red-50 p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center animate-pulse">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-800">¿Necesitas reportar algo?</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Informa una ausencia o urgencia de inmediato</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('bienestar')}
                                    className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-200 hover:scale-105 transition-transform"
                                >
                                    Reportar Ahora
                                </button>
                            </div>

                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-institutional-blue to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
                                <div className="relative z-10">
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Bienvenido(a)</p>
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{profile?.nombre || 'Estudiante'}</h2>
                                    <p className="text-blue-200 font-medium mt-1">
                                        {profile?.grado && `${profile.grado} • `}{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <FolderCheck size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documentos</span>
                                    </div>
                                    <p className="text-3xl font-black text-gray-800">{docsCompleted}<span className="text-lg text-gray-400">/{docsTotal}</span></p>
                                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${docsPercent}%` }} />
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-50 text-institutional-blue rounded-2xl flex items-center justify-center">
                                            <GraduationCap size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado</span>
                                    </div>
                                    <p className="text-2xl font-black text-gray-800">{profile?.grado || '—'}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-1">Año lectivo 2026</p>
                                </div>
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-rose-50 text-institutional-magenta rounded-2xl flex items-center justify-center">
                                            <DollarSign size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Costos</span>
                                    </div>
                                    <p className="text-2xl font-black text-gray-800">${totalCost.toLocaleString('es-CO')}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-1">Total a pagar</p>
                                </div>
                            </div>

                            {/* Horarios de Clases Section */}
                            {/* Horarios o Accesos Rápidos según Modalidad */}
                            {profile?.modalidad === 'Presencial' ? (
                                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-50 text-institutional-blue rounded-2xl flex items-center justify-center">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800">Horario de Clases</h3>
                                            <p className="text-xs text-gray-400 font-medium">Ciclo escolar 2026 • Jornada Mañana</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-tl-2xl">Hora</th>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">Lunes</th>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">Martes</th>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">Miércoles</th>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">Jueves</th>
                                                    <th className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-tr-2xl">Viernes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                <tr className="border-b border-gray-50">
                                                    <td className="p-4 font-black text-gray-900 border-r border-gray-50">07:00 — 08:30</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Matemáticas</td>
                                                    <td className="p-4 text-gray-600 font-medium">Lenguaje</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Ciencias</td>
                                                    <td className="p-4 text-gray-600 font-medium">Inglés</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Matemáticas</td>
                                                </tr>
                                                <tr className="border-b border-gray-50">
                                                    <td className="p-4 font-black text-gray-900 border-r border-gray-50">08:30 — 10:00</td>
                                                    <td className="p-4 text-gray-600 font-medium">Sociales</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Inglés</td>
                                                    <td className="p-4 text-gray-600 font-medium">Matemáticas</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Tecnología</td>
                                                    <td className="p-4 text-gray-600 font-medium">Religión</td>
                                                </tr>
                                                <tr className="border-b border-gray-50">
                                                    <td colSpan="6" className="p-2 bg-gray-50 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Receso Académico</td>
                                                </tr>
                                                <tr className="border-b border-gray-50">
                                                    <td className="p-4 font-black text-gray-900 border-r border-gray-50">10:30 — 12:00</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Arte</td>
                                                    <td className="p-4 text-gray-600 font-medium">Biología</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Física</td>
                                                    <td className="p-4 text-gray-600 font-medium">Ética</td>
                                                    <td className="p-4 text-gray-600 font-medium bg-blue-50/30">Educ. Física</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <Info size={18} className="text-amber-500 mt-1 flex-shrink-0" />
                                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                            Este es un horario preliminar. Los ajustes oficiales se comunicarán a través de la sección de noticias o directamente con tu director de grupo.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <LayoutGrid size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800">Accesos Rápidos</h3>
                                            <p className="text-xs text-gray-400 font-medium">Gestiona tu aprendizaje a distancia</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Mis Actividades', icon: ClipboardList, color: 'blue', tab: 'tareas', count: activities.length },
                                            { label: 'Calificaciones', icon: Star, color: 'amber', tab: 'calificaciones' },
                                            { label: 'Certificados', icon: FileCheck, color: 'emerald', tab: 'documentos' },
                                            { label: 'Cerrar Ciclo', icon: LogOut, color: 'rose', action: handleLogout },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => item.tab ? setActiveTab(item.tab) : item.action?.()}
                                                className="p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border border-transparent hover:border-gray-100 group text-center"
                                            >
                                                <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                                    <item.icon size={24} />
                                                </div>
                                                <p className="text-xs font-black text-gray-700">{item.label}</p>
                                                {item.count > 0 && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full">
                                                        {item.count} NUEVAS
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* News Section */}
                            {news.length > 0 && (
                                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                            <Newspaper size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-800">Noticias del Colegio</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {news.slice(0, 3).map(item => (
                                            <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors group">
                                                {item.image_url && (
                                                    <img src={item.image_url} alt="" className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-gray-800 group-hover:text-institutional-blue transition-colors truncate">{item.title}</h4>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.content}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                                        {item.published_at && new Date(item.published_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===================== TAB: ACTIVIDADES ===================== */}
                    {activeTab === 'tareas' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800">Control de Actividades</h3>
                                            <p className="text-xs text-gray-400 font-medium">Actividades asignadas según tu nivel académico</p>
                                        </div>
                                    </div>
                                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black">
                                        {activities.length} Pendientes
                                    </span>
                                </div>

                                {activities.length > 0 ? (
                                    <div className="space-y-4">
                                        {activities.map((act, i) => (
                                            <div key={act.id} className="p-6 rounded-[32px] bg-gray-50 border border-gray-100 hover:border-purple-200 hover:bg-white hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${act.type === 'Examen' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                                                }`}>
                                                                {act.type || 'Actividad'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                <Clock size={10} /> Entrega: {new Date(act.due_date || act.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-institutional-blue transition-colors">
                                                            {act.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                                                            {act.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2 justify-center">
                                                        <button className="flex items-center justify-center gap-2 bg-institutional-blue text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                                                            <Upload size={16} /> Subir Evidencia
                                                        </button>
                                                        <button className="text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest text-center">
                                                            Ver Detalles
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                            <ClipboardList size={32} className="text-gray-200" />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-700 mb-2">¡Todo al día!</h4>
                                        <p className="text-sm text-gray-400 max-w-sm mx-auto font-medium lead-relaxed">
                                            No tienes actividades pendientes para tu grado en este ciclo. Consulta periódicamente con tus profesores.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB: CALIFICACIONES ===================== */}
                    {activeTab === 'calificaciones' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                        <Star size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-800">Rendimiento Académico</h3>
                                        <p className="text-xs text-gray-400 font-medium">Consulta tus notas del periodo actual</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {loadingGrades ? (
                                        <div className="col-span-full flex justify-center py-12">
                                            <Loader2 className="animate-spin text-institutional-blue" size={32} />
                                        </div>
                                    ) : realGrades.length > 0 ? (
                                        realGrades.map((item, i) => (
                                            <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                                                <div>
                                                    <h4 className="font-black text-gray-800 group-hover:text-institutional-blue transition-colors">{item.materia}</h4>
                                                    <div className="flex gap-2 mt-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.periodo}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">• {new Date(item.fecha).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-3xl font-black ${Number(item.nota) >= 3.0 ? 'text-institutional-blue' : 'text-rose-500'}`}>{Number(item.nota).toFixed(1)}</p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${Number(item.nota) >= 3.0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                        {Number(item.nota) >= 3.0 ? 'Aprobado' : 'Reprobado'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                            <Star size={32} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-sm text-gray-400 font-medium">Aún no tienes calificaciones registradas este periodo.</p>
                                        </div>
                                    )}
                                </div>

                                {realGrades.length > 0 && (
                                    <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                            <Star size={24} className="text-institutional-blue" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-800">Promedio General: {stats.average}</h4>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {stats.average >= 4.0 ? 'Excelente desempeño académico. ¡Sigue así!' :
                                                    stats.average >= 3.0 ? 'Buen desempeño. Sigue esforzándote para mejorar.' :
                                                        'Es necesario reforzar tus estudios para mejorar tu promedio.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB: PAGOS ===================== */}
                    {activeTab === 'pagos' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header / Banner Estilo Pagos/Page.js */}
                            <div className="bg-institutional-blue rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                    <div className="bg-white w-24 h-24 rounded-[32px] p-4 flex items-center justify-center shadow-2xl shrink-0 rotate-3">
                                        <img src={schoolConfig?.logo_url} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Pagos Institucionales</h2>
                                        <p className="text-blue-100/70 font-medium max-w-lg italic text-lg">
                                            Selecciona tu método preferido y realiza tus pagos de forma segura desde tu portal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="flex p-2 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
                                <button
                                    onClick={() => setPaymentMethod("online")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'online' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <CreditCard size={18} /> Pago en Línea
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("manual")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'manual' ? 'bg-institutional-magenta text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Building2 size={18} /> Transferencia / Efecty
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                {/* Main Payment Area */}
                                <div className="lg:col-span-3">
                                    {paymentMethod === 'online' ? (
                                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 h-full">
                                            <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                                                <div className="bg-slate-100 p-3 rounded-2xl text-slate-400">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800">Pasarela Electrónica</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Powered by Wompi Colombia</p>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Concepto de Pago</label>
                                                        <select
                                                            value={selectedConcepto}
                                                            onChange={(e) => {
                                                                const concept = e.target.value;
                                                                setSelectedConcepto(concept);
                                                                const cost = costs.find(c => c.concept === concept);
                                                                if (cost) setSelectedMonto(cost.value?.replace(/[^0-9]/g, '') || "");
                                                            }}
                                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 text-slate-800 font-bold focus:outline-none focus:border-institutional-blue transition-all"
                                                        >
                                                            {costs.map((c, i) => (
                                                                <option key={i} value={c.concept}>{c.concept}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Valor a Pagar (COP)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">$</span>
                                                            <input
                                                                type="text"
                                                                value={selectedMonto}
                                                                onChange={(e) => setSelectedMonto(e.target.value.replace(/[^0-9]/g, ''))}
                                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-10 pr-6 text-slate-800 font-bold focus:outline-none focus:border-institutional-blue transition-all font-mono text-xl"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex gap-4">
                                                    <Info className="text-blue-500 shrink-0" size={20} />
                                                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                                        Los pagos por PSE y Tarjeta de Crédito se reflejan de inmediato en nuestro sistema de Tesorería.
                                                    </p>
                                                </div>

                                                {selectedMonto > 0 && (
                                                    <div className="pt-4">
                                                        <WompiWidget
                                                            monto={selectedMonto}
                                                            onSuccess={() => {
                                                                alert('¡Pago verificado exitosamente!');
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 h-full space-y-10">
                                            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                                <div className="bg-magenta-50 p-3 rounded-2xl text-institutional-magenta">
                                                    <Landmark size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800">Reportar Pago Manual</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Transferencia, Efecty o Efectivo</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {['Transferencia', 'Efecty', 'Efectivo'].map((method) => (
                                                    <div key={method} className="relative h-full">
                                                        <input
                                                            type="file"
                                                            id={`manual-${method}`}
                                                            className="hidden"
                                                            onChange={(e) => handleReportManualPayment(method, e.target.files[0])}
                                                            disabled={reportingPayment}
                                                        />
                                                        <button
                                                            onClick={() => document.getElementById(`manual-${method}`).click()}
                                                            className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-blue-100 group"
                                                        >
                                                            <div className="w-14 h-14 bg-white text-blue-500 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-blue-50">
                                                                <Upload size={24} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Subir Foto</p>
                                                                <p className="text-sm font-black text-slate-700 uppercase">{method}</p>
                                                            </div>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-amber-50 p-8 rounded-[32px] border border-amber-100 flex gap-5">
                                                <Info className="text-amber-600 shrink-0" size={24} />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Información Importante</p>
                                                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                                                        Al subir tu comprobante, Tesorería validará la transacción en un plazo de 24-48 horas hábiles. Recibirás una notificación cuando sea aprobada.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar / Resumen */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-slate-100 space-y-8">
                                        <h4 className="font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 flex justify-between items-center text-sm">
                                            Resumen Académico
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-400 tracking-tighter">ESTUDIANTE</span>
                                        </h4>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Estudiante</span>
                                                <span className="text-slate-800 font-black">{profile?.nombre}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Grado</span>
                                                <span className="text-slate-800 font-black">{profile?.grado}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Concepto Actual</span>
                                                <span className="text-slate-800 font-black">{selectedConcepto}</span>
                                            </div>
                                            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                                <span className="text-slate-800 font-black text-xl uppercase tracking-tighter">Total</span>
                                                <span className="text-3xl font-black text-institutional-magenta">${(Number(selectedMonto) || 0).toLocaleString('es-CO')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cuentas Bancarias */}
                                    {schoolConfig?.bank_info?.bank1?.numero && (
                                        <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform"></div>
                                            <Landmark className="text-blue-400 mb-8" size={32} />
                                            <h4 className="font-black uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-4">Transferencia Directa</h4>

                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{schoolConfig.bank_info.bank1.nombre} ({schoolConfig.bank_info.bank1.tipo})</p>
                                                    <p className="text-2xl font-black font-mono tracking-tighter">{schoolConfig.bank_info.bank1.numero}</p>
                                                </div>
                                                {schoolConfig.bank_info?.bank2?.numero && (
                                                    <div className="space-y-1 pt-4 border-t border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{schoolConfig.bank_info.bank2.nombre}</p>
                                                        <p className="text-2xl font-black font-mono tracking-tighter">{schoolConfig.bank_info.bank2.numero}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Historial de Transacciones */}
                            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12">
                                <h3 className="text-2xl font-black text-gray-800 mb-10 flex items-center gap-4">
                                    <Clock size={28} className="text-slate-300" /> Historial de Transacciones
                                </h3>

                                <div className="space-y-6">
                                    {paymentHistory.length > 0 ? (
                                        paymentHistory.map((pay) => (
                                            <div key={pay.id} className="p-8 rounded-[32px] bg-slate-50 border border-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white hover:shadow-2xl transition-all hover:border-slate-100">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${pay.status === 'Completado' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                                                        }`}>
                                                        {pay.status === 'Completado' ? <CheckCircle size={24} /> : <Clock size={24} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-lg uppercase tracking-tight">{pay.concept}</p>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                            {new Date(pay.created_at).toLocaleDateString()} • {pay.method}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right w-full sm:w-auto flex justify-between sm:flex-col items-center sm:items-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                                                    <p className="text-3xl font-black text-gray-800 tracking-tighter">${Number(pay.amount).toLocaleString('es-CO')}</p>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${pay.status === 'Completado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {pay.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                                            <CreditCard size={56} className="mx-auto text-slate-200 mb-6" />
                                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No hay registros aún</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB: DOCUMENTOS ===================== */}
                    {activeTab === 'documentos' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <FolderCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800">Documentos de Matrícula</h3>
                                            <p className="text-xs text-gray-400 font-medium">Checklist de documentos requeridos</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${docsPercent === 100
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : docsPercent >= 50
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {docsPercent}% Completado
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${docsPercent === 100 ? 'bg-emerald-500' : docsPercent >= 50 ? 'bg-amber-500' : 'bg-red-400'
                                            }`}
                                        style={{ width: `${docsPercent}%` }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    {documentosRequeridos.map((doc, i) => {
                                        const isCompleted = docsEntregados[doc];
                                        return (
                                            <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${isCompleted ? 'bg-emerald-50/50' : 'bg-gray-50'
                                                }`}>
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
                                                </div>
                                                <span className={`font-medium text-sm ${isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                                                    {doc}
                                                </span>
                                                <div className="ml-auto flex items-center gap-2">
                                                    {!isCompleted && (
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`file-${i}`}
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(doc, e.target.files[0])}
                                                                disabled={uploadingDoc === doc}
                                                            />
                                                            <button
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadingDoc === doc
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-institutional-blue/10 text-institutional-blue hover:bg-institutional-blue hover:text-white'
                                                                    }`}
                                                                onClick={() => document.getElementById(`file-${i}`).click()}
                                                            >
                                                                {uploadingDoc === doc ? (
                                                                    <Loader2 size={12} className="animate-spin" />
                                                                ) : (
                                                                    <Upload size={12} />
                                                                )}
                                                                {uploadingDoc === doc ? 'Subiendo...' : 'Subir'}
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isCompleted && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                                            <CheckCircle size={10} /> Entregado
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB: MI PERFIL ===================== */}
                    {activeTab === 'perfil' && (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-institutional-blue to-blue-700 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">
                                        {profile?.nombre?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800">{profile?.nombre}</h3>
                                        <p className="text-sm text-gray-400 font-medium">{profile?.email}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-institutional-blue/10 text-institutional-blue px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {profile?.grado || 'Sin Grado'}
                                            </span>
                                            <span className="bg-institutional-magenta/10 text-institutional-magenta px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {profile?.modalidad || 'Sin Modalidad'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Data */}
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <User size={16} className="text-institutional-blue" /> Datos Personales
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: FileText, label: 'Tipo Documento', value: profile?.tipo_documento },
                                        { icon: FileText, label: 'N° Documento', value: profile?.numero_documento },
                                        { icon: Calendar, label: 'Fecha Nacimiento', value: profile?.fecha_nacimiento ? new Date(profile.fecha_nacimiento).toLocaleDateString('es-CO') : null },
                                        { icon: MapPin, label: 'Dirección', value: profile?.direccion },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                                            <item.icon size={16} className="text-gray-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                                <p className="font-bold text-gray-700 text-sm">{item.value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Medical Data */}
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Heart size={16} className="text-red-500" /> Datos Médicos
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Grupo Sanguíneo', value: profile?.grupo_sanguineo },
                                        { label: 'EPS / Salud', value: profile?.eps_salud },
                                        { label: 'Alergias', value: profile?.alergias },
                                        { label: 'Condiciones Médicas', value: profile?.condiciones_medicas },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-gray-50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                                            <p className="font-bold text-gray-700 text-sm">{item.value || '—'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Guardian Data */}
                            {profile?.es_menor_edad && (
                                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Shield size={16} className="text-amber-500" /> Acudiente / Padre
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: User, label: 'Nombre', value: profile?.acudiente_nombre },
                                            { icon: Phone, label: 'Teléfono', value: profile?.acudiente_telefono },
                                            { icon: Mail, label: 'Email', value: profile?.acudiente_email },
                                            { icon: User, label: 'Parentesco', value: profile?.acudiente_parentesco },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                                                <item.icon size={16} className="text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                                    <p className="font-bold text-gray-700 text-sm">{item.value || '—'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
