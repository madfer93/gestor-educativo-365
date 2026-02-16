"use client";

import React, { useState, useEffect } from "react";
import { mockData } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import {
    Users, UserPlus, FileText, DollarSign, LayoutDashboard,
    Settings, LogOut, Bell, PlusCircle, Save, X, Clock, Book, GraduationCap,
    Link, Image, Key, FileCode, Edit, Trash2, Camera, Loader2, Heart, Megaphone
} from "lucide-react";
import { uploadImage } from "@/lib/imgbb";

export default function AdminDashboard({ params }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isCostModalOpen, setIsCostModalOpen] = useState(false);
    const [editingCost, setEditingCost] = useState(null);
    const [grados, setGrados] = useState([]);
    const [newGrado, setNewGrado] = useState("");

    // Estados para Galería, Noticias y Costos
    const [gallery, setGallery] = useState([]);
    const [news, setNews] = useState([]);
    const [costs, setCosts] = useState([]);
    const [schoolConfig, setSchoolConfig] = useState(null);
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        leads: 0,
        students: 0,
        teachers: 0,
        pendingDocs: 23, // Placeholder por ahora
        revenue: "48.2M" // Placeholder por ahora
    });

    const { admin, colegio } = mockData;

    const fetchTeachers = async () => {
        setLoading(true);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('school_id', school.id)
                .neq('rol', 'student');
            setTeachers(data || []);
        }
        setLoading(false);
    };

    const fetchGallery = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_gallery').select('*').eq('school_id', school.id).order('created_at', { ascending: false });
            setGallery(data || []);
        }
    };

    const fetchNews = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_news').select('*').eq('school_id', school.id).order('published_at', { ascending: false });
            setNews(data || []);
        }
    };

    const fetchCosts = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_costs').select('*').eq('school_id', school.id).order('display_order', { ascending: true });
            setCosts(data || []);
        }
    };

    const fetchSchoolConfig = async () => {
        const { data } = await supabase
            .from('schools')
            .select('*')
            .eq('slug', params.slug)
            .single();
        if (data) {
            setSchoolConfig(data);
            setGrados(data.grados || []);
        }
    };

    const fetchStats = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            // Contar Leads
            const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('school_id', school.id);
            // Contar Estudiantes (profiles con rol 'student')
            const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).eq('rol', 'student');
            // Contar Staff Completo
            const { count: teachersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).neq('rol', 'student');

            // Obtener últimos leads para la tabla
            const { data: latestLeads } = await supabase.from('leads').select('*').eq('school_id', school.id).order('created_at', { ascending: false }).limit(5);

            setStats(prev => ({
                ...prev,
                leads: leadsCount || 0,
                students: studentsCount || 0,
                teachers: teachersCount || 0
            }));
            setLeads(latestLeads || []);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchSchoolConfig();
        fetchStats();
        if (activeTab === "gallery") fetchGallery();
        if (activeTab === "news") fetchNews();
        if (activeTab === "costs") fetchCosts();
    }, [params.slug, activeTab]);

    const handleSaveTeacher = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);

        let photoUrl = formData.get('public_photo_url');
        const photoFile = e.target.photo_file?.files[0];

        if (photoFile) {
            try {
                photoUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const teacherData = {
            nombre: formData.get('nombre'),
            specialty: formData.get('specialty'),
            public_bio: formData.get('public_bio'),
            public_photo_url: photoUrl,
            email: formData.get('email'),
            password: formData.get('password'),
            rol: formData.get('rol') || 'teacher'
        };

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        let error;
        if (editingTeacher) {
            const { error: resError } = await supabase.from('profiles').update(teacherData).eq('id', editingTeacher.id);
            error = resError;
        } else {
            const { error: resError } = await supabase.from('profiles').insert([{ ...teacherData, school_id: school.id }]);
            error = resError;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsTeacherModalOpen(false);
            setEditingTeacher(null);
            fetchTeachers();
        }
        setUploading(false);
    };

    const handleDeleteTeacher = async (id) => {
        if (confirm('¿Estás seguro de eliminar a este docente?')) {
            await supabase.from('profiles').delete().eq('id', id);
            fetchTeachers();
        }
    };

    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);

    const handleSaveGallery = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = '';
        if (photoFile) {
            try {
                imageUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        const { error } = await supabase.from('school_gallery').insert([{
            school_id: school.id,
            image_url: imageUrl,
            title: formData.get('title') || 'Foto de Galería'
        }]);

        if (error) alert("Error: " + error.message);
        else {
            setIsGalleryModalOpen(false);
            fetchGallery();
        }
        setUploading(false);
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = editingNews?.image_url || '';
        if (photoFile) {
            try {
                imageUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        const newsData = {
            school_id: school.id,
            title: formData.get('title'),
            content: formData.get('content'),
            image_url: imageUrl,
            published_at: new Date().toISOString()
        };

        let error;
        if (editingNews) {
            const { error: resError } = await supabase.from('school_news').update(newsData).eq('id', editingNews.id);
            error = resError;
        } else {
            const { error: resError } = await supabase.from('school_news').insert([newsData]);
            error = resError;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsNewsModalOpen(false);
            setEditingNews(null);
            fetchNews();
        }
        setUploading(false);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const updatedConfig = {
            grados: grados,
            eslogan: formData.get('eslogan'),
            telefono: formData.get('telefono'),
            mision: formData.get('mision'),
            vision: formData.get('vision'),
            facebook_url: formData.get('facebook_url'),
            youtube_url: formData.get('youtube_url'),
            wompi_url: formData.get('wompi_url'),
            bank_info: {
                bank1: {
                    nombre: formData.get('bank1_name'),
                    numero: formData.get('bank1_number'),
                    tipo: formData.get('bank1_type')
                },
                bank2: {
                    nombre: formData.get('bank2_name'),
                    numero: formData.get('bank2_number'),
                    tipo: formData.get('bank2_type')
                }
            }
        };

        const { error } = await supabase
            .from('schools')
            .update(updatedConfig)
            .eq('slug', params.slug);

        if (error) alert('Error al guardar: ' + error.message);
        else alert('Configuración guardada correctamente');

        setLoading(false);
        fetchSchoolConfig();
    };

    const handleDeleteGallery = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta foto?")) {
            const { error } = await supabase.from('school_gallery').delete().eq('id', id);
            if (error) alert("Error: " + error.message);
            else fetchGallery();
        }
    };

    const handleDeleteNews = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta noticia?")) {
            const { error } = await supabase.from('school_news').delete().eq('id', id);
            if (error) alert("Error: " + error.message);
            else fetchNews();
        }
    };

    const handleDownloadReport = () => {
        alert("Generando reporte PDF consolidado... El archivo se descargará en unos segundos.");
        // Simulación de descarga
        setTimeout(() => {
            alert("Reporte generado con éxito.");
        }, 2000);
    };

    const handleSaveCost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const costData = {
            category: formData.get('category'),
            concept: formData.get('concept'),
            value: formData.get('value'),
            description: formData.get('description'),
            display_order: parseInt(formData.get('display_order')) || 0
        };

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        let error;
        if (editingCost) {
            const { error: resError } = await supabase.from('school_costs').update(costData).eq('id', editingCost.id);
            error = resError;
        } else {
            const { error: resError } = await supabase.from('school_costs').insert([{ ...costData, school_id: school.id }]);
            error = resError;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsCostModalOpen(false);
            setEditingCost(null);
            fetchCosts();
        }
        setLoading(false);
    };

    const handleDeleteCost = async (id) => {
        if (confirm('¿Estás seguro de eliminar este concepto de costo?')) {
            await supabase.from('school_costs').delete().eq('id', id);
            fetchCosts();
        }
    };

    const handleUploadCertificate = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv, .xlsx, .pdf';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`Subiendo archivo: ${file.name}... Procesando carga masiva SIMAT.`);
            }
        };
        input.click();
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "leads", label: "Prospectos", icon: UserPlus },
        { id: "students", label: "Estudiantes", icon: Users },
        { id: "staff", label: "Personal", icon: GraduationCap },
        { id: "academic", label: "Académico", icon: Book },
        { id: "wellbeing", label: "Bienestar", icon: Heart },
        { id: "circulares", label: "Circulares", icon: Megaphone },
        { id: "gallery", label: "Galería", icon: Image },
        { id: "news", label: "Noticias", icon: FileText },
        { id: "costs", label: "Costos", icon: DollarSign },
        { id: "settings", label: "Identidad", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Header */}
            <header className="bg-institutional-blue text-white sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto px-6 flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-black/10 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12">
                                {schoolConfig?.logo_url ? (
                                    <img
                                        src={schoolConfig.logo_url}
                                        alt="Logo"
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.classList.add('bg-institutional-blue');
                                        }}
                                    />
                                ) : null}
                                {(!schoolConfig?.logo_url) && (
                                    <div className="text-institutional-blue font-black text-xl">
                                        {params.slug.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase">{schoolConfig?.nombre || params.slug}</h1>
                            <p className="text-[10px] font-black text-blue-200 tracking-widest uppercase">Panel Administrativo</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[60%] xl:max-w-none">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] xl:text-sm font-bold transition-all whitespace-nowrap ${activeTab === item.id
                                    ? "bg-white text-institutional-blue shadow-lg"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <button className="p-2 bg-white/10 rounded-full relative hover:bg-white/20 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-3 h-3 bg-institutional-magenta border-2 border-institutional-blue rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                            <div className="hidden xl:block text-right">
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Rector</p>
                                <p className="text-xs font-bold text-white leading-none">Administrador</p>
                            </div>
                            <div className="w-10 h-10 bg-institutional-magenta rounded-xl border-2 border-white/20 flex items-center justify-center font-black shadow-lg shadow-black/20">
                                R
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Internal Navigation for Mobile */}
            <nav className="lg:hidden bg-white border-b border-gray-100 flex overflow-x-auto px-4 py-2 gap-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${activeTab === item.id
                            ? "bg-institutional-blue text-white"
                            : "bg-gray-50 text-gray-400"
                            }`}
                    >
                        <item.icon size={14} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-6 md:p-10">
                {activeTab === "dashboard" && (
                    <>
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-6">
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Consola de Rectoría</h2>
                                <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                    1 Nueva Urgencia
                                </span>
                            </div>
                            <button onClick={() => setActiveTab("leads")} className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <PlusCircle size={20} /> Nueva Matrícula
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Prospectos Capturados</p>
                                <p className="text-4xl font-black text-institutional-magenta">+{stats.leads}</p>
                                <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-institutional-magenta"></div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Total Estudiantes</p>
                                <p className="text-4xl font-black text-institutional-blue">{stats.students}</p>
                                <p className="text-xs text-green-500 font-bold mt-2">Población Activa</p>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Planta Docente</p>
                                <p className="text-4xl font-black text-amber-500">{stats.teachers}</p>
                                <p className="text-xs text-gray-400 font-bold mt-2">Profesionales</p>
                            </div>
                            <div className="bg-institutional-blue p-8 rounded-[40px] shadow-xl text-white">
                                <p className="text-xs opacity-60 font-bold uppercase tracking-widest mb-2">Recaudo Estimado</p>
                                <p className="text-3xl font-black font-mono">${stats.revenue}</p>
                                <p className="text-xs opacity-60 font-bold mt-2 tracking-tighter">Ciclo Escolar 2026</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Leads Table */}
                            <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-black text-gray-800">Prospectos capturados por IA</h3>
                                    <button className="text-institutional-blue font-bold text-sm hover:underline">Ver reporte completo</button>
                                </div>
                                <div className="space-y-4">
                                    {leads.map(lead => (
                                        <div key={lead.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100/50">
                                            <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-institutional-blue font-black text-xl">
                                                    {lead.nombre ? lead.nombre[0] : 'L'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-lg">{lead.nombre || lead.telefono}</p>
                                                    <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        <span>{lead.telefono}</span>
                                                        <span>•</span>
                                                        <span>{lead.interes || 'Información General'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-institutional-magenta text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-magenta-500/20">Llamar</button>
                                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black">Historial</button>
                                            </div>
                                        </div>
                                    ))}
                                    {leads.length === 0 && (
                                        <div className="text-center py-10 text-gray-400 font-medium">No hay prospectos recientes.</div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions and Wellbeing Alerts */}
                            <div className="space-y-8">
                                <div className="bg-institutional-magenta text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                                    <PlusCircle className="absolute -top-10 -right-10 opacity-10" size={200} />
                                    <h3 className="text-2xl font-black mb-6 relative z-10">Acciones Directas</h3>
                                    <div className="space-y-4 relative z-10">
                                        <button onClick={handleUploadCertificate} className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                            <p className="font-black text-sm mb-1 uppercase tracking-tighter">📥 Subir Certificado</p>
                                            <p className="text-[10px] opacity-70">Carga masiva de notas SIMAT</p>
                                        </button>
                                        <button onClick={handleDownloadReport} className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                            <p className="font-black text-sm mb-1 uppercase tracking-tighter">📋 Reporte Diario</p>
                                            <p className="text-[10px] opacity-70">Resumen de admisiones y pagos</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Canal de Urgencias Replicado en Dashboard */}
                                <div className="bg-white rounded-[40px] shadow-sm border border-red-100 p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Canal de Urgencias</h3>
                                        <button onClick={() => setActiveTab('wellbeing')} className="text-institutional-blue text-[10px] font-black uppercase hover:underline">Gestionar</button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 border-l-8 border-l-red-500">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">ALERTA MÉDICA</span>
                                                <span className="text-[10px] text-red-400 font-bold">10:45 AM</span>
                                            </div>
                                            <p className="font-black text-red-900 leading-tight text-sm">Estudiante María Solano presenta desmayo en pasillo.</p>
                                            <p className="text-[10px] text-red-600 font-bold mt-2 uppercase tracking-widest">Coordinador en camino</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "students" && (
                    <div className="space-y-10">
                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión Estudiantil</h2>

                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="pb-6 px-4">Estudiante</th>
                                            <th className="pb-6 px-4">Grado</th>
                                            <th className="pb-6 px-4">Estado</th>
                                            <th className="pb-6 px-4">Pago</th>
                                            <th className="pb-6 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admin.estudiantes.map(student => (
                                            <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-50 text-institutional-blue rounded-xl flex items-center justify-center font-black text-sm">
                                                            {student.nombre[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{student.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 font-medium text-gray-600">{student.grado}</td>
                                                <td className="py-6 px-4">
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${student.estado === 'Matriculado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {student.estado}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${student.pago === 'Al día' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {student.pago}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="text-institutional-blue text-xs font-black hover:underline"
                                                    >
                                                        Ver Trazabilidad
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Traceability Modal */}
                        {selectedStudent && (
                            <div className="fixed inset-0 z-[110] flex items-center justify-end p-4 bg-institutional-blue/20 backdrop-blur-sm animate-in fade-in duration-200">
                                <div className="bg-white h-full w-full max-w-2xl rounded-[40px] shadow-2xl p-10 relative overflow-y-auto animate-in slide-in-from-right-40 duration-300">
                                    <button onClick={() => setSelectedStudent(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>

                                    <div className="mb-12">
                                        <h3 className="text-3xl font-black text-institutional-blue mb-2">Expediente Escolar</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs px-1">{selectedStudent.nombre} • Grado {selectedStudent.grado}</p>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Bitácora de Actividad */}
                                        <section>
                                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Clock size={16} /> Bitácora de Actividad
                                            </h4>
                                            <div className="space-y-6 border-l-2 border-gray-100 ml-2 pl-8">
                                                {selectedStudent.trazabilidad.map((item, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-institutional-blue"></div>
                                                        <p className="text-xs text-gray-400 font-black mb-1">{item.fecha}</p>
                                                        <p className="font-bold text-gray-800">{item.accion}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Tareas Entregadas */}
                                        <section>
                                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Book size={16} /> Actividades y Tareas
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {selectedStudent.tareas.map((tarea, i) => (
                                                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                        <div>
                                                            <p className="font-bold text-gray-900">{tarea.titulo}</p>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${tarea.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                                {tarea.estado}
                                                            </span>
                                                        </div>
                                                        {tarea.estado === 'Entregado' && (
                                                            <button className="bg-institutional-blue text-white p-2 rounded-xl">
                                                                <FileText size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <button onClick={handleDownloadReport} className="w-full bg-institutional-magenta text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-magenta-500/20">
                                            Emitir Reporte PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }

                {
                    activeTab === "staff" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Personal Institucional</h2>
                                    <p className="text-gray-500 font-medium">Administra la planta de docentes, administrativos y directivos.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingTeacher(null); setIsTeacherModalOpen(true); }}
                                    className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <PlusCircle size={20} /> Agregar Integrante
                                </button>
                            </div>

                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                            <th className="py-6 px-8">Nombre / Cargo</th>
                                            <th className="py-6 px-8">Área / Especialidad</th>
                                            <th className="py-6 px-8">Rol de Acceso</th>
                                            <th className="py-6 px-8 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {teachers.map(teacher => (
                                            <tr key={teacher.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                                            {teacher.public_photo_url ? (
                                                                <img src={teacher.public_photo_url} alt={teacher.nombre} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <GraduationCap size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-800">{teacher.nombre}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{teacher.specialty || 'Administrativo'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 font-bold text-gray-500">{teacher.specialty || 'General'}</td>
                                                <td className="py-6 px-8">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${teacher.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        teacher.rol === 'coordinator' ? 'bg-blue-100 text-blue-700' :
                                                            teacher.rol === 'secretary' ? 'bg-green-100 text-green-700' :
                                                                teacher.rol === 'treasury' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {teacher.rol === 'admin' ? 'Rectoría' :
                                                            teacher.rol === 'coordinator' ? 'Coordinación' :
                                                                teacher.rol === 'secretary' ? 'Secretaría' :
                                                                    teacher.rol === 'treasury' ? 'Tesorería' :
                                                                        'Docente'}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingTeacher(teacher); setIsTeacherModalOpen(true); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {teachers.length === 0 && !loading && (
                                    <div className="p-20 text-center text-gray-400 font-medium">
                                        No hay docentes registrados aún.
                                    </div>
                                )}
                            </div>

                            {/* Modal Docente */}
                            {isTeacherModalOpen && (
                                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                    <form onSubmit={handleSaveTeacher} className="bg-white w-full max-w-4xl h-[90vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsTeacherModalOpen(false)}
                                            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <X size={24} className="text-gray-400" />
                                        </button>

                                        <h3 className="text-2xl font-black text-gray-800 mb-8">
                                            {editingTeacher ? 'Editar Integrante' : 'Nuevo Integrante del Staff'}
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo</label>
                                                    <input name="nombre" defaultValue={editingTeacher?.nombre} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Carlos Mario Rodríguez" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rol de Acceso / Cargo</label>
                                                    <select name="rol" defaultValue={editingTeacher?.rol || 'teacher'} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 appearance-none">
                                                        <option value="teacher">Docente</option>
                                                        <option value="coordinator">Coordinación</option>
                                                        <option value="secretary">Secretaría</option>
                                                        <option value="treasury">Tesorería</option>
                                                        <option value="admin">Administrador / Rectoría</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Especialidad / Área de Trabajo</label>
                                                <input name="specialty" defaultValue={editingTeacher?.specialty} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Matemáticas y Física" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Biografía Pública</label>
                                                <textarea name="public_bio" defaultValue={editingTeacher?.public_bio} rows="3" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700" placeholder="Breve descripción para el sitio web..."></textarea>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL Foto de Perfil o Cargar Archivo</label>
                                                <div className="flex gap-4">
                                                    <input name="public_photo_url" defaultValue={editingTeacher?.public_photo_url} className="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="https://..." />
                                                    <input type="file" name="photo_file" id="photo_file" className="hidden" accept="image/*" />
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById('photo_file').click()}
                                                        className={`p-4 rounded-2xl transition-colors ${uploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                        disabled={uploading}
                                                    >
                                                        {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-institutional-blue">Email de Acceso</label>
                                                    <input name="email" type="email" defaultValue={editingTeacher?.email} required className="w-full bg-blue-50/50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="usuario@colegio.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-institutional-blue">Contraseña Temporal</label>
                                                    <input name="password" type="text" className="w-full bg-blue-50/50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="••••••••" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsTeacherModalOpen(false)}
                                                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-institutional-magenta shadow-magenta-500/20 hover:scale-105'
                                                    }`}
                                            >
                                                {uploading ? 'Procesando...' : (editingTeacher ? 'Guardar Cambios' : 'Registrar Staff')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    activeTab === "gallery" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Galería Institucional</h2>
                                    <p className="text-gray-500 font-medium">Fotos y momentos destacados del colegio.</p>
                                </div>
                                <button
                                    onClick={() => setIsGalleryModalOpen(true)}
                                    className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <PlusCircle size={20} /> Subir Foto
                                </button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {gallery.map((item) => (
                                    <div key={item.id} className="group relative bg-white p-4 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                                        <div className="aspect-square bg-gray-50 rounded-[30px] overflow-hidden mb-4 border border-gray-100">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm truncate px-2">{item.title}</p>
                                        <button
                                            onClick={() => handleDeleteGallery(item.id)}
                                            className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {gallery.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay fotos en la galería.</div>}
                        </div>
                    )
                }



                {
                    activeTab === "news" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Noticias y Eventos</h2>
                                    <p className="text-gray-500 font-medium">Publica novedades para la comunidad educativa.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingNews(null); setIsNewsModalOpen(true); }}
                                    className="bg-institutional-magenta text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <PlusCircle size={20} /> Crear Noticia
                                </button>
                            </div>
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Image size={24} /></div>}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-800 line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-gray-400 font-bold uppercase">{new Date(item.published_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingNews(item); setIsNewsModalOpen(true); }}
                                                className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNews(item.id)}
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {news.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay noticias publicadas.</div>}
                        </div>
                    )
                } {
                    activeTab === "circulares" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Circulares Oficiales</h2>
                                    <p className="text-gray-500 font-medium">Publica comunicados para toda la comunidad educativa.</p>
                                </div>
                                <button className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusCircle size={20} /> Nueva Circular
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-institutional-blue transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-blue-50 text-institutional-blue p-4 rounded-2xl">
                                            <Megaphone size={32} />
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-gray-800">Circular 001: Inicio de Clases</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Publicado hace 2 días</p>
                                        </div>
                                    </div>
                                    <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "wellbeing" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Bienestar e Incidentes</h2>
                                    <p className="text-gray-500 font-medium">Monitorea reportes de ausencia y situaciones institucionales.</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                        1 Nueva Urgencia
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
                                        <Clock size={20} className="text-gray-400" /> Reportes de Ausencia Recientes
                                    </h3>
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                        <table className="w-full text-left font-sans">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                                    <th className="py-6 px-8">Estudiante</th>
                                                    <th className="py-6 px-8">Motivo</th>
                                                    <th className="py-6 px-8">Estado</th>
                                                    <th className="py-6 px-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                <tr className="hover:bg-blue-50/20 transition-colors">
                                                    <td className="py-6 px-8">
                                                        <p className="font-black text-gray-800 text-sm">Nicolás García</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Grado 5°</p>
                                                    </td>
                                                    <td className="py-6 px-8 font-medium text-gray-600 text-sm">Cita Médica programada</td>
                                                    <td className="py-6 px-8">
                                                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pendiente</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-right">
                                                        <button className="text-institutional-blue font-black text-xs hover:underline">Ver Excusa</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[40px] shadow-sm border border-red-100 p-8">
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">Canal de Urgencias</h3>
                                    <div className="space-y-4">
                                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 border-l-8 border-l-red-500">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">ALERTA MÉDICA</span>
                                                <span className="text-[10px] text-red-400 font-bold">10:45 AM</span>
                                            </div>
                                            <p className="font-black text-red-900 leading-tight">Estudiante María Solano presenta desmayo en pasillo.</p>
                                            <p className="text-xs text-red-600 font-bold mt-2 uppercase tracking-widest">Coordinador en camino</p>
                                        </div>
                                        <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest transition-all">Histórico de Incidentes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "academic" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Supervisión Académica</h2>
                                    <p className="text-gray-500 font-medium">Monitorea el material subido por docentes y publica documentos oficiales.</p>
                                </div>
                                <button className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusCircle size={20} /> Publicar Circular / Documento
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="font-black text-gray-800 uppercase tracking-tighter">Material Reciente de Docentes</h3>
                                        <span className="text-[10px] font-black bg-blue-50 text-institutional-blue px-3 py-1 rounded-full">VISTA DE RECTORÍA</span>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                <th className="py-6 px-8">Material / Tema</th>
                                                <th className="py-6 px-8">Grado</th>
                                                <th className="py-6 px-8">Docente</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm">
                                            <tr className="hover:bg-blue-50/20 transition-colors">
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <FileCode className="text-institutional-blue" size={20} />
                                                        <div>
                                                            <p className="font-black text-gray-800">Guía de Álgebra: Ecuaciones</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">PDF • 2.4 MB</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 font-bold text-gray-500 text-xs">Noveno (9°)</td>
                                                <td className="py-6 px-8 font-bold text-gray-800 text-xs">Lic. Carlos R.</td>
                                            </tr>
                                            <tr className="hover:bg-blue-50/20 transition-colors">
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <FileCode className="text-institutional-blue" size={20} />
                                                        <div>
                                                            <p className="font-black text-gray-800">Taller de Lectura Crítica</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">DOCX • 1.1 MB</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 font-bold text-gray-500 text-xs">Once (11°)</td>
                                                <td className="py-6 px-8 font-bold text-gray-800 text-xs">Lic. Martha S.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-gradient-to-br from-institutional-blue to-blue-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">Estado Pedagógico</h4>
                                        <p className="text-sm opacity-80 mb-6 font-medium">Control visual de la actividad académica de tu institución.</p>
                                        <div className="space-y-4">
                                            <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                                                <span className="text-xs font-bold uppercase tracking-widest">Guías en Sistema</span>
                                                <span className="text-xl font-black">128</span>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                                                <span className="text-xs font-bold uppercase tracking-widest">Pendientes Revisión</span>
                                                <span className="text-xl font-black">12</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                                            Ver Programación Completa
                                        </button>
                                    </div>
                                    <Book size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "leads" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Prospectos Capturados</h2>
                                    <p className="text-gray-500 font-medium">Gestiona los interesados que la IA ha capturado en el sitio web.</p>
                                </div>
                                <button className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusCircle size={20} /> Registrar Prospecto Manual
                                </button>
                            </div>

                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                            <th className="py-6 px-8">Interesado</th>
                                            <th className="py-6 px-8">Contacto</th>
                                            <th className="py-6 px-8">Interés Detallado</th>
                                            <th className="py-6 px-8">Fecha</th>
                                            <th className="py-6 px-8 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="py-6 px-8 font-black text-gray-800">{lead.nombre || 'Interesado Anónimo'}</td>
                                                <td className="py-6 px-8 font-bold text-gray-500">{lead.telefono}</td>
                                                <td className="py-6 px-8 font-medium text-gray-600 italic">"{lead.interes}"</td>
                                                <td className="py-6 px-8 text-xs font-bold text-gray-400 uppercase">{new Date(lead.created_at).toLocaleDateString()}</td>
                                                <td className="py-6 px-8 text-right">
                                                    <a
                                                        href={`https://wa.me/57${lead.telefono?.replace(/\s/g, "")}`}
                                                        target="_blank"
                                                        className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-500/20 hover:scale-105 transition-all inline-block"
                                                    >
                                                        WhatsApp
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {leads.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay prospectos registrados aún.</div>}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "costs" && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Tarifas y Costos</h2>
                                    <p className="text-gray-500 font-medium">Gestiona los valores oficiales que se muestran en el sitio público.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingCost(null); setIsCostModalOpen(true); }}
                                    className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <PlusCircle size={20} /> Agregar Tarifa
                                </button>
                            </div>

                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                            <th className="py-6 px-8">Categoría</th>
                                            <th className="py-6 px-8">Concepto</th>
                                            <th className="py-6 px-8">Valor</th>
                                            <th className="py-6 px-8 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {costs.map(cost => (
                                            <tr key={cost.id} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="py-6 px-8">
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        {cost.category}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <p className="font-black text-gray-800">{cost.concept}</p>
                                                    {cost.description && <p className="text-[10px] text-gray-400 font-bold uppercase">{cost.description}</p>}
                                                </td>
                                                <td className="py-6 px-8 font-black text-institutional-magenta text-lg">{cost.value}</td>
                                                <td className="py-6 px-8 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingCost(cost); setIsCostModalOpen(true); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCost(cost.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {costs.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay tarifas registradas.</div>}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "settings" && schoolConfig && (
                        <div className="max-w-5xl mx-auto py-10">
                            <form onSubmit={handleSaveSettings}>
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión Institucional</h2>
                                        <p className="text-gray-500 font-medium">Control total sobre la información pública de tu colegio.</p>
                                    </div>
                                    <button type="submit" disabled={loading} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
                                        <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Todo'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Columna Izquierda: Identidad */}
                                    <div className="md:col-span-2 space-y-8">
                                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                                <LayoutDashboard className="text-institutional-magenta" size={20} /> Identidad y Filosofía
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Eslogan Principal</label>
                                                    <input name="eslogan" type="text" defaultValue={schoolConfig.eslogan} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono de Contacto</label>
                                                    <input name="telefono" type="text" defaultValue={schoolConfig.telefono} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Misión</label>
                                                <textarea name="mision" rows="3" defaultValue={schoolConfig.mision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700 leading-relaxed"></textarea>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visión</label>
                                                <textarea name="vision" rows="3" defaultValue={schoolConfig.vision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700 leading-relaxed"></textarea>
                                            </div>
                                        </div>

                                        {/* Redes Sociales y Pagos */}
                                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                                <Link className="text-institutional-blue" size={20} /> Enlaces Externos y Redes
                                            </h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-blue-600">URL Facebook</label>
                                                    <input name="facebook_url" type="url" defaultValue={schoolConfig.facebook_url} placeholder="https://facebook.com/..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-red-600">URL YouTube</label>
                                                    <input name="youtube_url" type="url" defaultValue={schoolConfig.youtube_url} placeholder="https://youtube.com/..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-green-600">Pasarela de Pagos (Wompi URL)</label>
                                                    <input name="wompi_url" type="url" defaultValue={schoolConfig.wompi_url} placeholder="https://checkout.wompi.co/..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cuentas Bancarias */}
                                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                                <DollarSign className="text-institutional-blue" size={20} /> Cuentas para Transferencia
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuenta Principal (Ahorros/Corriente)</p>
                                                    <div className="space-y-3">
                                                        <input name="bank1_name" type="text" defaultValue={schoolConfig.bank_info?.bank1?.nombre} placeholder="Banco (Ej: Bancolombia)" className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <input name="bank1_number" type="text" defaultValue={schoolConfig.bank_info?.bank1?.numero} placeholder="Número de Cuenta" className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <select name="bank1_type" defaultValue={schoolConfig.bank_info?.bank1?.tipo || 'Ahorros'} className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm">
                                                            <option>Ahorros</option>
                                                            <option>Corriente</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuenta Secundaria (Nequi/Daviplata)</p>
                                                    <div className="space-y-3">
                                                        <input name="bank2_name" type="text" defaultValue={schoolConfig.bank_info?.bank2?.nombre} placeholder="Entidad (Ej: Nequi)" className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <input name="bank2_number" type="text" defaultValue={schoolConfig.bank_info?.bank2?.numero} placeholder="Número de Celular/Cuenta" className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <input name="bank2_type" type="hidden" value="Digital" />
                                                        <div className="p-3 bg-white rounded-xl text-xs font-bold text-slate-400 shadow-sm">Billetera Digital</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gestión de Banners Visuales */}
                                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                                <Image className="text-institutional-blue" size={20} /> Banners de Landing Page
                                            </h3>
                                            <div className="space-y-6">
                                                {/* Banner Galería */}
                                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Banner Galería Institucional</span>
                                                        <button type="button" className="text-institutional-magenta text-[10px] font-black uppercase tracking-tighter hover:underline">Cambiar Imagen</button>
                                                    </div>
                                                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group">
                                                        <img src={schoolConfig.banner_gallery_url || "https://images.unsplash.com/photo-1523050335392-938511794244?q=80&w=2070"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Galería Preview" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Link className="text-white drop-shadow-md" size={32} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Banner Oferta */}
                                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Banner Oferta Académica</span>
                                                        <button type="button" className="text-institutional-magenta text-[10px] font-black uppercase tracking-tighter hover:underline">Cambiar Imagen</button>
                                                    </div>
                                                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group">
                                                        <img src={schoolConfig.banner_offer_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Oferta Preview" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Link className="text-white drop-shadow-md" size={32} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Configuración Técnica (APIs) */}
                                        <div className="bg-institutional-magenta/5 border-2 border-institutional-magenta/10 rounded-[40px] p-10 space-y-8">
                                            <h3 className="text-xl font-black text-institutional-magenta flex items-center gap-2">
                                                <Key size={20} /> Integraciones Técnicas (APIs)
                                            </h3>
                                            <p className="text-xs font-medium text-gray-500 italic">Configure las llaves de acceso para los servicios de IA, Imágenes y PDF.</p>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <FileCode size={14} className="text-institutional-blue" /> Groq API Key (IA)
                                                    </label>
                                                    <input name="groq_key" type="password" placeholder="gsk_..." className="w-full bg-white border-gray-100 rounded-2xl p-4 font-mono text-xs focus:ring-2 ring-institutional-magenta outline-none transition-all shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna Derecha: Operación */}
                                    <div className="space-y-8">
                                        <div className="bg-institutional-blue rounded-[40px] shadow-xl p-10 text-white space-y-8">
                                            <h3 className="text-xl font-black flex items-center gap-2">
                                                <Clock className="text-institutional-magenta" size={20} /> Horarios de Jornada
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Mañana</label>
                                                    <input name="schedule_morning" type="text" defaultValue="6:30 AM — 12:30 PM" className="w-full bg-white/10 border-none rounded-2xl p-4 font-bold text-white placeholder:text-white/20" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Tarde</label>
                                                    <input name="schedule_afternoon" type="text" defaultValue="1:00 PM — 6:00 PM" className="w-full bg-white/10 border-none rounded-2xl p-4 font-bold text-white placeholder:text-white/20" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                                    <GraduationCap className="text-institutional-blue" size={20} /> Grados Ofrecidos
                                                </h3>
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newGrado}
                                                    onChange={(e) => setNewGrado(e.target.value)}
                                                    placeholder="Ej: Caminadores"
                                                    className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm font-bold"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (newGrado.trim()) {
                                                            setGrados([...grados, newGrado.trim()]);
                                                            setNewGrado("");
                                                        }
                                                    }}
                                                    className="bg-institutional-blue text-white px-4 rounded-xl font-black shadow-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {grados.map((grado, i) => (
                                                    <span key={i} className="bg-blue-50 text-institutional-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter border border-blue-100 flex items-center gap-2">
                                                        {grado}
                                                        <X
                                                            size={12}
                                                            className="cursor-pointer hover:text-red-500"
                                                            onClick={() => setGrados(grados.filter((_, index) => index !== i))}
                                                        />
                                                    </span>
                                                ))}
                                                {grados.length === 0 && <p className="text-xs text-gray-400 font-bold italic">No hay grados agregados.</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* Modal Galería */}
                {
                    isGalleryModalOpen && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                            <form onSubmit={handleSaveGallery} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                                <h3 className="text-2xl font-black text-gray-800 mb-8">Subir Foto a Galería</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de la Foto</label>
                                        <input name="title" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Bazar de Verano 2025" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archivo de Imagen</label>
                                        <div className="flex gap-4">
                                            <input type="file" name="photo_file" id="gallery_photo" className="hidden" accept="image/*" required />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('gallery_photo').click()}
                                                className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                            >
                                                <Camera size={32} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                                                <p className="text-xs font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-widest">Seleccionar Imagen</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                    <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                        {uploading ? 'Subiendo...' : 'Publicar en Galería'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* Modal Noticias */}
                {
                    isNewsModalOpen && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                            <form onSubmit={handleSaveNews} className="bg-white w-full max-w-2xl h-[90vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                                <button type="button" onClick={() => setIsNewsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                                <h3 className="text-2xl font-black text-gray-800 mb-8">{editingNews ? 'Editar Noticia' : 'Nueva Noticia Institucional'}</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de la Noticia</label>
                                        <input name="title" defaultValue={editingNews?.title} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Gran Feria de las Ciencias" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contenido</label>
                                        <textarea name="content" defaultValue={editingNews?.content} rows="6" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700" placeholder="Escribe aquí el detalle de la noticia..."></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagen Destacada</label>
                                        <div className="flex gap-4">
                                            <input type="file" name="photo_file" id="news_photo" className="hidden" accept="image/*" />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('news_photo').click()}
                                                className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-magenta-50 hover:border-institutional-magenta/20 transition-all group"
                                            >
                                                <Image size={32} className="text-gray-300 group-hover:text-institutional-magenta transition-colors" />
                                                <p className="text-xs font-bold text-gray-400 group-hover:text-institutional-magenta uppercase tracking-widest">Cambiar o Subir Imagen</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button type="button" onClick={() => setIsNewsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                    <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-magenta shadow-magenta-500/20'}`}>
                                        {uploading ? 'Publicando...' : (editingNews ? 'Guardar Cambios' : 'Publicar Noticia')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* Modal Costos */}
                {
                    isCostModalOpen && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                            <form onSubmit={handleSaveCost} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                <button type="button" onClick={() => setIsCostModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                                <h3 className="text-2xl font-black text-gray-800 mb-8">{editingCost ? 'Editar Tarifa' : 'Nueva Tarifa Institucional'}</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría (Ej: Tarifas: Jornada Mañana)</label>
                                        <input name="category" defaultValue={editingCost?.category} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Tarifas: Preescolar" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Concepto</label>
                                            <input name="concept" defaultValue={editingCost?.concept} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Pensión" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor (Con símbolo)</label>
                                            <input name="value" defaultValue={editingCost?.value} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="$ 480.000" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción (Opcional)</label>
                                        <input name="description" defaultValue={editingCost?.description} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Pago mensual por 10 meses" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Orden de Visualización</label>
                                        <input name="display_order" type="number" defaultValue={editingCost?.display_order || 0} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button type="button" onClick={() => setIsCostModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                    <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                        {loading ? 'Guardando...' : 'Guardar Tarifa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }
            </main >

            {/* Internal Footer for Admin */}
            < footer className="bg-gray-100 py-6 border-t border-gray-200" >
                <div className="container mx-auto px-6 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>© 2026 {colegio.nombre}</span>
                    <div className="flex items-center gap-2">
                        <span>Powered by</span>
                        <span className="text-gray-600 font-black tracking-tighter text-xs">Gestor Educativo 365</span>
                    </div>
                </div>
            </footer >
        </div >
    );
}
