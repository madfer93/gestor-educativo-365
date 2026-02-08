"use client";
import React, { useState } from "react";
import { mockData } from "@/data/mockData";
import {
    Users, UserPlus, FileText, DollarSign, LayoutDashboard,
    Settings, LogOut, Bell, PlusCircle, Save, X, Clock, Book, GraduationCap,
    Link, Image, Key, FileCode
} from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { admin, colegio } = mockData;

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "leads", label: "Prospectos", icon: UserPlus },
        { id: "students", label: "Estudiantes", icon: Users },
        { id: "docs", label: "Documentos", icon: FileText },
        { id: "finances", label: "Finanzas", icon: DollarSign },
        { id: "settings", label: "Configuración", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Header */}
            <header className="bg-institutional-blue text-white sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto px-6 flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <img src={colegio.logoSolo} alt="Logo" className="w-10 h-10 brightness-0 invert" />
                        <div>
                            <h1 className="text-lg font-black leading-none tracking-tighter">
                                LATINOAMERICANO
                            </h1>
                            <p className="text-[10px] text-institutional-magenta font-bold tracking-widest uppercase mt-1">
                                Panel Administrativo
                            </p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                    ? "bg-white text-institutional-blue shadow-lg"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-white/10 rounded-full relative hover:bg-white/20 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-3 h-3 bg-institutional-magenta border-2 border-institutional-blue rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-institutional-magenta rounded-full border-2 border-white/20 flex items-center justify-center font-bold">
                            R
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
                            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Consola de Rectoría</h2>
                            <button className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <PlusCircle size={20} /> Nueva Matrícula
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Prospectos Hoy</p>
                                <p className="text-4xl font-black text-institutional-magenta">+{admin.leads.length}</p>
                                <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-institutional-magenta"></div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Total Matrículas</p>
                                <p className="text-4xl font-black text-institutional-blue">158</p>
                                <p className="text-xs text-green-500 font-bold mt-2">↑ 12% vs ayer</p>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Docs Pendientes</p>
                                <p className="text-4xl font-black text-amber-500">23</p>
                                <p className="text-xs text-gray-400 font-bold mt-2">Acción requerida</p>
                            </div>
                            <div className="bg-institutional-blue p-8 rounded-[40px] shadow-xl text-white">
                                <p className="text-xs opacity-60 font-bold uppercase tracking-widest mb-2">Recaudo Estimado</p>
                                <p className="text-3xl font-black font-mono">$48.2M</p>
                                <p className="text-xs opacity-60 font-bold mt-2 tracking-tighter">Meta: $60.0M</p>
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
                                    {admin.leads.map(lead => (
                                        <div key={lead.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100/50">
                                            <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-institutional-blue font-black text-xl">
                                                    {lead.nombre[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-lg">{lead.nombre}</p>
                                                    <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        <span>{lead.telefono}</span>
                                                        <span>•</span>
                                                        <span>{lead.interes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-institutional-magenta text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-magenta-500/20">Llamar</button>
                                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black">Historial</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions / Tips */}
                            <div className="space-y-8">
                                <div className="bg-institutional-magenta text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                                    <PlusCircle className="absolute -top-10 -right-10 opacity-10" size={200} />
                                    <h3 className="text-2xl font-black mb-6 relative z-10">Acciones Directas</h3>
                                    <div className="space-y-4 relative z-10">
                                        <button className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                            <p className="font-black text-sm mb-1 uppercase tracking-tighter">📥 Subir Certificado</p>
                                            <p className="text-[10px] opacity-70">Carga masiva de notas SIMAT</p>
                                        </button>
                                        <button className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                            <p className="font-black text-sm mb-1 uppercase tracking-tighter">📋 Reporte Diario</p>
                                            <p className="text-[10px] opacity-70">Resumen de admisiones y pagos</p>
                                        </button>
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
                                        <button className="w-full bg-institutional-magenta text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-magenta-500/20">
                                            Emitir Reporte PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="max-w-5xl mx-auto py-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión Institucional</h2>
                                <p className="text-gray-500 font-medium">Control total sobre la información pública de tu colegio.</p>
                            </div>
                            <button className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Save size={20} /> Guardar Todo
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
                                            <input type="text" defaultValue={colegio.eslogan} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono de Contacto</label>
                                            <input type="text" defaultValue={colegio.telefono} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Misión</label>
                                        <textarea rows="3" defaultValue={colegio.mision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700 leading-relaxed"></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visión</label>
                                        <textarea rows="3" defaultValue={colegio.vision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700 leading-relaxed"></textarea>
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
                                                <button className="text-institutional-magenta text-[10px] font-black uppercase tracking-tighter hover:underline">Cambiar Imagen</button>
                                            </div>
                                            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group">
                                                <img src={colegio.banners?.galeria?.imagen} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Galería Preview" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Link className="text-white drop-shadow-md" size={32} />
                                                </div>
                                            </div>
                                            <input type="text" defaultValue={colegio.banners?.galeria?.titulo} className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold text-gray-700 shadow-sm" placeholder="Título del banner..." />
                                        </div>

                                        {/* Banner Oferta */}
                                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Banner Oferta Académica</span>
                                                <button className="text-institutional-magenta text-[10px] font-black uppercase tracking-tighter hover:underline">Cambiar Imagen</button>
                                            </div>
                                            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group">
                                                <img src={colegio.banners?.oferta?.imagen} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Oferta Preview" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Link className="text-white drop-shadow-md" size={32} />
                                                </div>
                                            </div>
                                            <input type="text" defaultValue={colegio.banners?.oferta?.titulo} className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold text-gray-700 shadow-sm" placeholder="Título del banner..." />
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
                                            <input type="password" placeholder="gsk_..." className="w-full bg-white border-gray-100 rounded-2xl p-4 font-mono text-xs focus:ring-2 ring-institutional-magenta outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Image size={14} className="text-institutional-blue" /> ImgBB API Key (Imágenes)
                                            </label>
                                            <input type="password" placeholder="Tu API Key de ImgBB" className="w-full bg-white border-gray-100 rounded-2xl p-4 font-mono text-xs focus:ring-2 ring-institutional-magenta outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} className="text-institutional-blue" /> iLovePDF Project Key (Documentos)
                                            </label>
                                            <input type="password" placeholder="Tu Key de iLovePDF" className="w-full bg-white border-gray-100 rounded-2xl p-4 font-mono text-xs focus:ring-2 ring-institutional-magenta outline-none transition-all shadow-sm" />
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
                                            <input type="text" defaultValue="6:30 AM — 12:30 PM" className="w-full bg-white/10 border-none rounded-2xl p-4 font-bold text-white placeholder:text-white/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Tarde</label>
                                            <input type="text" defaultValue="1:00 PM — 6:00 PM" className="w-full bg-white/10 border-none rounded-2xl p-4 font-bold text-white placeholder:text-white/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Sabatina</label>
                                            <input type="text" defaultValue="7:00 AM — 4:00 PM" className="w-full bg-white/10 border-none rounded-2xl p-4 font-bold text-white placeholder:text-white/20" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                        <GraduationCap className="text-institutional-blue" size={20} /> Grados Ofrecidos
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Párvulos", "Pre-jardín", "Jardín", "Transición", "1° a 5°", "6° a 11°", "Ciclos Adultos"].map((grado, i) => (
                                            <span key={i} className="bg-blue-50 text-institutional-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter border border-blue-100 flex items-center gap-2">
                                                {grado} <X size={12} className="cursor-pointer hover:text-red-500" />
                                            </span>
                                        ))}
                                        <button className="bg-gray-100 text-gray-400 p-2 rounded-xl border border-gray-200 border-dashed">
                                            <PlusCircle size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Internal Footer for Admin */}
            <footer className="bg-gray-100 py-6 border-t border-gray-200">
                <div className="container mx-auto px-6 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>© 2026 {colegio.nombre}</span>
                    <div className="flex items-center gap-2">
                        <span>Powered by</span>
                        <span className="text-gray-600 font-black tracking-tighter text-xs">Gestor Educativo 365</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
