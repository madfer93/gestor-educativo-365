"use client";

import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, FileText, DollarSign, LayoutDashboard,
    PlusCircle, Save, X, Search, Filter, RefreshCw, CheckCircle2,
    Image, Edit, Trash2, Camera, Loader2, Megaphone, Bell, GraduationCap,
    LogOut
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { uploadImage } from '@/lib/imgbb';
import { generatePDFReport } from '@/lib/ilovepdf';

export default function SecretariaDashboard({ params }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [schoolId, setSchoolId] = useState(null);
    const [schoolConfig, setSchoolConfig] = useState(null);

    // Data states
    const [leads, setLeads] = useState([]);
    const [students, setStudents] = useState([]);
    const [news, setNews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [costs, setCosts] = useState([]);
    const [stats, setStats] = useState({ leads: 0, students: 0, teachers: 0 });

    // Modal states
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [esMenor, setEsMenor] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGrado, setFilterGrado] = useState('');

    const documentosRequeridos = [
        'Carpeta amarilla colgante oficio', 'Certificados años anteriores', 'Tres fotos 3x4 fondo azul',
        'Fotocopia documento identidad', 'Fotocopia C.C. acudientes', 'Registro civil',
        'Retiro del SIMAT', 'Copia recibo servicio público', 'Copia seguro de salud',
        'Diagnóstico médico', 'Carné de vacunas'
    ];

    // ==================== FETCH FUNCTIONS ====================

    const fetchSchoolConfig = async () => {
        const { data } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
        if (data) {
            setSchoolConfig(data);
            setSchoolId(data.id);
        }
    };

    const fetchStats = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('school_id', school.id);
            const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).eq('rol', 'student');
            const { count: teachersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).neq('rol', 'student');
            const { data: latestLeads } = await supabase.from('leads').select('*').eq('school_id', school.id).order('created_at', { ascending: false }).limit(5);

            setStats({ leads: leadsCount || 0, students: studentsCount || 0, teachers: teachersCount || 0 });
            setLeads(latestLeads || []);
        }
    };

    const fetchLeads = async () => {
        setLoading(true);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            setSchoolId(school.id);
            const { data } = await supabase.from('leads').select('*').eq('school_id', school.id).order('created_at', { ascending: false });
            setLeads(data || []);
        }
        setLoading(false);
    };

    const fetchStudents = async () => {
        setLoading(true);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('profiles').select('*').eq('school_id', school.id).eq('rol', 'student').order('nombre', { ascending: true });
            setStudents(data || []);
        }
        setLoading(false);
    };

    const fetchNews = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_news').select('*').eq('school_id', school.id).order('published_at', { ascending: false });
            setNews(data || []);
        }
    };

    const fetchGallery = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_gallery').select('*').eq('school_id', school.id).order('created_at', { ascending: false });
            setGallery(data || []);
        }
    };

    const fetchCosts = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_costs').select('*').eq('school_id', school.id).order('display_order', { ascending: true });
            setCosts(data || []);
        }
    };

    useEffect(() => {
        fetchSchoolConfig();
        fetchStats();
        if (activeTab === 'matriculas') fetchLeads();
        if (activeTab === 'estudiantes') fetchStudents();
        if (activeTab === 'noticias') fetchNews();
        if (activeTab === 'galeria') fetchGallery();
        if (activeTab === 'costos') fetchCosts();
    }, [params.slug, activeTab]);

    // ==================== HANDLERS ====================

    const handleFormalizeStudent = async (lead) => {
        if (!confirm(`¿Deseas formalizar la matrícula de ${lead.nombre}? Se creará un acceso oficial.`)) return;
        if (!schoolId) return alert("Error: ID de colegio no encontrado.");

        setLoading(true);
        try {
            const tempPassword = lead.telefono || "Estudiante2026*";
            const studentEmail = lead.email || `${lead.nombre.toLowerCase().replace(/\s/g, '.')}@colegio.com`;

            const response = await fetch('/api/auth/manage-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: studentEmail, password: tempPassword, name: lead.nombre,
                    school_id: schoolId, rol: 'student',
                    metadata: { grado: lead.grado }
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear estudiante');

            await supabase.from('leads').update({ estado: 'Matriculado' }).eq('id', lead.id);
            alert(`¡Matrícula exitosa!\nEmail: ${studentEmail}\nClave: ${tempPassword}`);
            fetchLeads();
            fetchStats();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const collectStudentFormData = (form) => {
        const fd = new FormData(form);
        const docs = {};
        documentosRequeridos.forEach(d => { docs[d] = form.querySelector(`[data-doc="${d}"]`)?.checked || false; });
        // Helper: convert empty strings to null so Supabase doesn't reject "" for date/numeric cols
        const v = (key) => { const val = fd.get(key); return val === '' || val === null ? null : val; };
        return {
            nombre: fd.get('nombre'), email: fd.get('email'), grado: v('grado'), modalidad: v('modalidad'),
            fecha_nacimiento: v('fecha_nacimiento'), tipo_documento: v('tipo_documento'),
            numero_documento: v('numero_documento'), direccion: v('direccion'),
            grupo_sanguineo: v('grupo_sanguineo'), alergias: v('alergias'),
            condiciones_medicas: v('condiciones_medicas'), eps_salud: v('eps_salud'),
            es_menor_edad: esMenor, acudiente_nombre: v('acudiente_nombre'),
            acudiente_telefono: v('acudiente_telefono'), acudiente_email: v('acudiente_email'),
            acudiente_parentesco: v('acudiente_parentesco'), documentos_entregados: docs
        };
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        if (!schoolId) return alert('Error: ID de colegio no encontrado.');
        setLoading(true);
        const data = collectStudentFormData(e.target);
        const password = new FormData(e.target).get('password') || 'Estudiante2026*';
        try {
            const response = await fetch('/api/auth/manage-user', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password, name: data.nombre, school_id: schoolId, rol: 'student', metadata: data })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear estudiante');
            alert(`¡Estudiante creado!\nEmail: ${data.email}\nClave: ${password}`);
            setIsStudentModalOpen(false); setEditingStudent(null); fetchStudents(); fetchStats();
        } catch (err) { alert('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleEditStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = collectStudentFormData(e.target);
        const password = new FormData(e.target).get('password') || '';
        try {
            const response = await fetch('/api/auth/manage-user', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingStudent.id, ...(password ? { password } : {}), ...data })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al actualizar');
            alert('Estudiante actualizado correctamente.');
            setIsStudentModalOpen(false); setEditingStudent(null); fetchStudents();
        } catch (err) { alert('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleDownloadPDF = (student) => {
        const w = window.open('', '_blank');
        w.document.write(`<html><head><title>Ficha ${student.nombre}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333}h1{color:#1a365d;border-bottom:3px solid #1a365d;padding-bottom:10px}h2{color:#2d3748;margin-top:24px;border-bottom:1px solid #e2e8f0;padding-bottom:6px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.field{margin:8px 0}.label{font-size:11px;text-transform:uppercase;color:#718096;font-weight:bold;letter-spacing:1px}.value{font-size:14px;font-weight:600;padding:4px 0}@media print{body{padding:20px}}</style></head><body>`);
        w.document.write(`<h1>📄 Ficha Estudiantil</h1>`);
        w.document.write(`<h2>Datos Personales</h2><div class="grid">`);
        const f = (l, v) => `<div class="field"><div class="label">${l}</div><div class="value">${v || '—'}</div></div>`;
        w.document.write(f('Nombre', student.nombre) + f('Email', student.email) + f('Grado', student.grado) + f('Fecha Nacimiento', student.fecha_nacimiento) + f('Tipo Documento', student.tipo_documento) + f('N° Documento', student.numero_documento) + f('Dirección', student.direccion));
        w.document.write(`</div><h2>Datos Médicos</h2><div class="grid">`);
        w.document.write(f('Grupo Sanguíneo', student.grupo_sanguineo) + f('EPS / Salud', student.eps_salud) + f('Alergias', student.alergias) + f('Condiciones Médicas', student.condiciones_medicas));
        w.document.write(`</div><h2>Acudiente</h2><div class="grid">`);
        w.document.write(f('Nombre', student.acudiente_nombre) + f('Teléfono', student.acudiente_telefono) + f('Email', student.acudiente_email) + f('Parentesco', student.acudiente_parentesco));
        w.document.write(`</div><h2>Documentos</h2><ul>`);
        const docs = student.documentos_entregados || {};
        Object.keys(docs).forEach(d => { w.document.write(`<li>${docs[d] ? '✅' : '❌'} ${d}</li>`); });
        w.document.write(`</ul></body></html>`);
        w.document.close();
        setTimeout(() => w.print(), 300);
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = editingNews?.image_url || '';
        if (photoFile) {
            try { imageUrl = await uploadImage(photoFile); }
            catch (error) { alert("Error al subir imagen: " + error.message); setUploading(false); return; }
        }

        const newsData = {
            school_id: schoolId,
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
        else { setIsNewsModalOpen(false); setEditingNews(null); fetchNews(); }
        setUploading(false);
    };

    const handleDeleteNews = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta noticia?")) {
            await supabase.from('school_news').delete().eq('id', id);
            fetchNews();
        }
    };

    const handleSaveGallery = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = '';
        if (photoFile) {
            try { imageUrl = await uploadImage(photoFile); }
            catch (error) { alert("Error al subir imagen: " + error.message); setUploading(false); return; }
        }

        const { error } = await supabase.from('school_gallery').insert([{
            school_id: schoolId,
            image_url: imageUrl,
            title: formData.get('title') || 'Foto de Galería'
        }]);

        if (error) alert("Error: " + error.message);
        else { setIsGalleryModalOpen(false); fetchGallery(); }
        setUploading(false);
    };

    const handleDeleteGallery = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta foto?")) {
            await supabase.from('school_gallery').delete().eq('id', id);
            fetchGallery();
        }
    };

    // Filtered students
    const filteredStudents = students.filter(s => {
        const matchesSearch = !searchQuery || s.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || s.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrado = !filterGrado || s.grado === filterGrado;
        return matchesSearch && matchesGrado;
    });

    const uniqueGrados = [...new Set(students.map(s => s.grado).filter(Boolean))].sort();

    // ==================== MENU ====================

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "matriculas", label: "Matrículas", icon: UserPlus },
        { id: "estudiantes", label: "Estudiantes", icon: Users },
        { id: "noticias", label: "Noticias", icon: FileText },
        { id: "galeria", label: "Galería", icon: Image },
        { id: "costos", label: "Costos", icon: DollarSign },
    ];

    // ==================== RENDER ====================

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Header */}
            <header className="bg-institutional-blue text-white sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto px-6 flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-black/10 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12">
                                {schoolConfig?.logo_url ? (
                                    <img src={schoolConfig.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <div className="text-institutional-blue font-black text-xl">
                                        {params.slug.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase">{schoolConfig?.nombre || params.slug}</h1>
                            <p className="text-[10px] font-black text-blue-200 tracking-widest uppercase">Panel de Secretaría</p>
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
                        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                            <div className="hidden xl:block text-right">
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Secretaría</p>
                                <p className="text-xs font-bold text-white leading-none">Gestión Académica</p>
                            </div>
                            <div className="w-10 h-10 bg-teal-500 rounded-xl border-2 border-white/20 flex items-center justify-center font-black shadow-lg shadow-black/20">
                                S
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
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

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-6 md:p-10">

                {/* ==================== DASHBOARD ==================== */}
                {activeTab === "dashboard" && (
                    <>
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-6">
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Consola de Secretaría</h2>
                            </div>
                            <button onClick={() => setActiveTab("matriculas")} className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <PlusCircle size={20} /> Nueva Matrícula
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Estudiantes Interesados</p>
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
                        </div>

                        {/* Recent Leads */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-gray-800">Últimos Interesados</h3>
                                <button onClick={() => setActiveTab('matriculas')} className="text-institutional-blue font-bold text-sm hover:underline">Ver todos</button>
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
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${lead.estado === 'Matriculado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {lead.estado || 'Nuevo'}
                                        </span>
                                    </div>
                                ))}
                                {leads.length === 0 && <div className="text-center py-10 text-gray-400 font-medium">No hay estudiantes interesados recientes.</div>}
                            </div>
                        </div>
                    </>
                )}

                {/* ==================== MATRÍCULAS ==================== */}
                {activeTab === "matriculas" && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión de Matrículas</h2>
                                <p className="text-gray-500 font-medium">Aspirantes y Proceso de Matrícula · Ciclo Escolar 2026</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={fetchLeads} className="bg-white text-institutional-blue border border-blue-100 px-4 py-3 rounded-xl font-bold hover:bg-blue-50 flex items-center gap-2">
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
                                </button>
                                <button onClick={() => setIsStudentModalOpen(true)} className="bg-institutional-blue text-white px-6 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusCircle size={20} /> Crear Estudiante
                                </button>
                            </div>
                        </div>

                        {/* Leads Table */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {loading ? (
                                <div className="p-10 text-center text-gray-400 font-medium flex items-center justify-center gap-2">
                                    <Loader2 size={20} className="animate-spin" /> Cargando aspirantes...
                                </div>
                            ) : leads.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 font-medium">No hay solicitudes pendientes.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Estudiante</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Grado</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Acudiente / Tel</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Estado</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-gray-800">{lead.nombre}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{new Date(lead.created_at).toLocaleDateString()}</p>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-gray-600">{lead.grado}</td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-gray-800 font-bold">{lead.acudiente}</p>
                                                    <p className="text-xs text-gray-500">{lead.telefono}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${lead.estado === 'Matriculado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {lead.estado || 'Nuevo'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 flex gap-2">
                                                    {lead.estado !== 'Matriculado' ? (
                                                        <button
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 group"
                                                            onClick={() => handleFormalizeStudent(lead)}
                                                        >
                                                            <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                            <span className="text-[10px] font-black uppercase">Matricular</span>
                                                        </button>
                                                    ) : (
                                                        <div className="p-2 text-gray-300 flex items-center gap-1">
                                                            <CheckCircle2 size={18} />
                                                            <span className="text-[10px] font-black uppercase">Finalizado</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== ESTUDIANTES ==================== */}
                {activeTab === "estudiantes" && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión Estudiantil</h2>
                                <p className="text-gray-500 font-medium">{filteredStudents.length} estudiantes registrados</p>
                            </div>
                            <button onClick={() => setIsStudentModalOpen(true)} className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <PlusCircle size={20} /> Nuevo Estudiante
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                            <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 rounded-xl">
                                <Search className="text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar estudiante por nombre o email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent w-full py-3 font-medium outline-none text-gray-700"
                                />
                            </div>
                            <select
                                value={filterGrado}
                                onChange={(e) => setFilterGrado(e.target.value)}
                                className="bg-gray-50 px-4 py-3 rounded-xl font-bold text-gray-600 outline-none border-none"
                            >
                                <option value="">Todos los grados</option>
                                {uniqueGrados.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        {/* Students Table */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="pb-6 px-4">Estudiante</th>
                                            <th className="pb-6 px-4">Email</th>
                                            <th className="pb-6 px-4">Grado</th>
                                            <th className="pb-6 px-4">Registrado</th>
                                            <th className="pb-6 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map(student => (
                                            <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-50 text-institutional-blue rounded-xl flex items-center justify-center font-black text-sm">
                                                            {student.nombre?.[0] || '?'}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{student.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 font-medium text-gray-500 text-sm">{student.email}</td>
                                                <td className="py-6 px-4">
                                                    <span className="bg-blue-50 text-institutional-blue px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                        {student.grado || 'Sin asignar'}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-4 text-sm text-gray-400 font-medium">
                                                    {new Date(student.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => { setEditingStudent(student); setEsMenor(student.es_menor_edad !== false); setIsStudentModalOpen(true); }}
                                                            className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-yellow-500 hover:text-white transition-all"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadPDF(student)}
                                                            className="px-4 py-2 bg-institutional-blue/10 text-institutional-blue rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-institutional-blue hover:text-white transition-all"
                                                        >
                                                            📄 Ficha PDF
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredStudents.length === 0 && (
                                    <div className="p-20 text-center text-gray-400 font-medium">
                                        {searchQuery || filterGrado ? 'No se encontraron estudiantes con esos filtros.' : 'No hay estudiantes registrados.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== NOTICIAS ==================== */}
                {activeTab === "noticias" && (
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
                                        <button onClick={() => { setEditingNews(item); setIsNewsModalOpen(true); }} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                                            <Edit size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteNews(item.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {news.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay noticias publicadas.</div>}
                    </div>
                )}

                {/* ==================== GALERÍA ==================== */}
                {activeTab === "galeria" && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Galería Institucional</h2>
                                <p className="text-gray-500 font-medium">Fotos y momentos del colegio.</p>
                            </div>
                            <button
                                onClick={() => setIsGalleryModalOpen(true)}
                                className="bg-institutional-magenta text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Camera size={20} /> Subir Foto
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {gallery.map((item) => (
                                <div key={item.id} className="relative group rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                                        <div className="flex-1">
                                            <p className="text-white font-bold text-sm truncate">{item.title}</p>
                                        </div>
                                        <button onClick={() => handleDeleteGallery(item.id)} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {gallery.length === 0 && <div className="p-20 text-center text-gray-400 font-medium bg-white rounded-[40px] border border-gray-100">No hay fotos en la galería.</div>}
                    </div>
                )}

                {/* ==================== COSTOS ==================== */}
                {activeTab === "costos" && (
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Tarifas y Costos</h2>
                            <p className="text-gray-500 font-medium">Consulta de costos institucionales (solo lectura).</p>
                        </div>

                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="pb-6 px-4">Categoría</th>
                                            <th className="pb-6 px-4">Concepto</th>
                                            <th className="pb-6 px-4">Valor</th>
                                            <th className="pb-6 px-4">Descripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {costs.map(cost => (
                                            <tr key={cost.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-6 px-4">
                                                    <span className="bg-blue-50 text-institutional-blue px-3 py-1 rounded-full text-[10px] font-black uppercase">{cost.category}</span>
                                                </td>
                                                <td className="py-6 px-4 font-bold text-gray-800">{cost.concept}</td>
                                                <td className="py-6 px-4 font-black text-institutional-magenta text-lg">{cost.value}</td>
                                                <td className="py-6 px-4 text-sm text-gray-500">{cost.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {costs.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay tarifas configuradas.</div>}
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ==================== MODALS ==================== */}

            {/* Modal: Crear/Editar Estudiante - Captura Completa */}
            {isStudentModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                    <form onSubmit={editingStudent ? handleEditStudent : handleCreateStudent} className="bg-white w-full max-w-7xl max-h-[95vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                        <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10">
                            <X size={24} className="text-gray-400" />
                        </button>
                        <h3 className="text-2xl font-black text-gray-800 mb-1">{editingStudent ? '✏️ Editar Estudiante' : '👤 Nuevo Estudiante'}</h3>
                        <p className="text-sm text-gray-400 mb-6">Captura completa de datos estudiantiles</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* ======= COLUMNA IZQUIERDA ======= */}
                            <div className="space-y-5">
                                {/* Datos Personales */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-institutional-blue mb-3 flex items-center gap-2"><Users size={14} /> Datos Personales</h4>
                                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo *</label>
                                            <input name="nombre" required defaultValue={editingStudent?.nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Nombres y Apellidos" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo Doc.</label>
                                                <select name="tipo_documento" defaultValue={editingStudent?.tipo_documento || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                    <option value="">—</option>
                                                    <option value="TI">T.I.</option>
                                                    <option value="CC">C.C.</option>
                                                    <option value="CE">C.E.</option>
                                                    <option value="RC">R.C.</option>
                                                    <option value="PA">Pasaporte</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">N° Documento</label>
                                                <input name="numero_documento" defaultValue={editingStudent?.numero_documento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="1234567890" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha Nac.</label>
                                                <input name="fecha_nacimiento" type="date" defaultValue={editingStudent?.fecha_nacimiento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                                            <input name="direccion" defaultValue={editingStudent?.direccion} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Calle / Carrera / Barrio" />
                                        </div>
                                    </div>
                                </div>

                                {/* Datos Académicos */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-institutional-blue mb-3 flex items-center gap-2"><GraduationCap size={14} /> Datos Académicos</h4>
                                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email *</label>
                                                <input name="email" type="email" required defaultValue={editingStudent?.email} readOnly={!!editingStudent} className={`w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm ${editingStudent ? 'opacity-50' : ''}`} placeholder="estudiante@email.com" />
                                            </div>
                                            {!editingStudent ? (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña *</label>
                                                    <input name="password" type="text" defaultValue="Estudiante2026*" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" />
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nueva Contraseña</label>
                                                    <input name="password" type="text" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Dejar vacío para no cambiar" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modalidad *</label>
                                                <select name="modalidad" required defaultValue={editingStudent?.modalidad || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                    <option value="">Seleccionar modalidad</option>
                                                    <option value="Presencial">Presencial</option>
                                                    <option value="Sabatina">Sabatina</option>
                                                    <option value="A Distancia">A Distancia</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado *</label>
                                                <select name="grado" required defaultValue={editingStudent?.grado || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                    <option value="">Seleccionar grado</option>
                                                    {(schoolConfig?.grados || ['Pre-jardín', 'Jardín', 'Transición', '1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°']).map(g => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos Médicos */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-institutional-magenta mb-3 flex items-center gap-2">🏥 Datos Médicos</h4>
                                    <div className="bg-pink-50/50 rounded-2xl p-5 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grupo Sanguíneo</label>
                                                <select name="grupo_sanguineo" defaultValue={editingStudent?.grupo_sanguineo || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                    <option value="">—</option>
                                                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                                                    <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">EPS / Salud</label>
                                                <input name="eps_salud" defaultValue={editingStudent?.eps_salud} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Sanitas, Nueva EPS..." />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alergias</label>
                                            <textarea name="alergias" defaultValue={editingStudent?.alergias} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Ninguna conocida / Detallar..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Condiciones Médicas</label>
                                            <textarea name="condiciones_medicas" defaultValue={editingStudent?.condiciones_medicas} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Asma, diabetes, epilepsia..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ======= COLUMNA DERECHA ======= */}
                            <div className="space-y-5">
                                {/* Acudiente */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-3 flex items-center gap-2">👨‍👩‍👧 Acudiente / Padre</h4>
                                    <div className="bg-green-50/50 rounded-2xl p-5 space-y-3">
                                        <div className="flex items-center gap-3 mb-1">
                                            <label className="text-sm font-bold text-gray-600">¿Menor de edad?</label>
                                            <button type="button" onClick={() => setEsMenor(!esMenor)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${esMenor ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {esMenor ? 'Sí — Obligatorio' : 'No — Opcional'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Acudiente {esMenor && '*'}</label>
                                                <input name="acudiente_nombre" required={esMenor} defaultValue={editingStudent?.acudiente_nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Nombre completo" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parentesco</label>
                                                <select name="acudiente_parentesco" defaultValue={editingStudent?.acudiente_parentesco || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                    <option value="">—</option>
                                                    <option>Madre</option><option>Padre</option><option>Abuelo/a</option>
                                                    <option>Tío/a</option><option>Hermano/a</option><option>Otro</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono {esMenor && '*'}</label>
                                                <input name="acudiente_telefono" required={esMenor} defaultValue={editingStudent?.acudiente_telefono} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="300 123 4567" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Acudiente</label>
                                                <input name="acudiente_email" type="email" defaultValue={editingStudent?.acudiente_email} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="acudiente@email.com" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documentos Entregados */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">📋 Documentos Entregados</h4>
                                    <div className="bg-amber-50/50 rounded-2xl p-5">
                                        <div className="grid grid-cols-1 gap-2">
                                            {documentosRequeridos.map(doc => (
                                                <label key={doc} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" data-doc={doc} defaultChecked={editingStudent?.documentos_entregados?.[doc]} className="w-5 h-5 rounded-lg accent-green-500" />
                                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{doc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 mt-6 sticky bottom-0 bg-white pt-4">
                            <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                            <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                {loading ? 'Guardando...' : editingStudent ? 'Actualizar Estudiante' : 'Crear Estudiante'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal: Noticias */}
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
                                        <input type="file" name="photo_file" id="sec_news_photo" className="hidden" accept="image/*" />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('sec_news_photo').click()}
                                            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-institutional-blue/20 transition-all group"
                                        >
                                            <Image size={32} className="text-gray-300 group-hover:text-institutional-blue transition-colors" />
                                            <p className="text-xs font-bold text-gray-400 group-hover:text-institutional-blue uppercase tracking-widest">Subir Imagen</p>
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

            {/* Modal: Galería */}
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
                                    <input name="title" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Día del Idioma 2026" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagen</label>
                                    <input type="file" name="photo_file" id="sec_gallery_photo" className="hidden" accept="image/*" />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('sec_gallery_photo').click()}
                                        className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-institutional-blue/20 transition-all group"
                                    >
                                        <Camera size={40} className="text-gray-300 group-hover:text-institutional-blue transition-colors" />
                                        <p className="text-xs font-bold text-gray-400 group-hover:text-institutional-blue uppercase tracking-widest">Seleccionar Imagen</p>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-10 flex gap-4">
                                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-magenta shadow-magenta-500/20'}`}>
                                    {uploading ? 'Subiendo...' : 'Subir Foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

        </div >
    );
}
