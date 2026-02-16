"use client";
import React, { useState, useEffect } from "react";
import {
    LayoutDashboard, Users, BookOpen, ClipboardCheck,
    Bell, MessageSquare, Calendar, ChevronRight,
    Search, Filter, PlusCircle, FileText, CheckCircle, Clock
} from "lucide-react";

export default function CoordinacionDashboard({ params }) {
    const [activeTab, setActiveTab] = useState("academic");

    const stats = [
        { label: "Docentes Activos", value: "24", icon: Users, color: "bg-blue-500" },
        { label: "Guías Publicadas", value: "142", icon: BookOpen, color: "bg-green-500" },
        { label: "Alertas Pendientes", value: "8", icon: Bell, color: "bg-amber-500" },
        { label: "Tareas Revisadas", value: "85%", icon: ClipboardCheck, color: "bg-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar Coordinación */}
            <aside className="bg-white w-full md:w-72 p-8 border-r border-gray-100 flex flex-col shadow-sm z-20">
                <div className="mb-10">
                    <h1 className="text-2xl font-black text-institutional-blue tracking-tighter uppercase">Coordinación</h1>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Gestión Académica</p>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: "academic", label: "Plan Académico", icon: BookOpen },
                        { id: "staff", label: "Gestión Docente", icon: Users },
                        { id: "discipline", label: "Siga / Disciplina", icon: ClipboardCheck },
                        { id: "circulares", label: "Circulares", icon: FileText },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                                    ? "bg-institutional-blue text-white shadow-lg shadow-blue-500/20 translate-x-1"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-gray-100">
                    <div className="bg-blue-50 p-5 rounded-[24px]">
                        <p className="text-xs font-black text-blue-800 mb-1">Ciclo Escolar 2026</p>
                        <p className="text-[10px] text-blue-600 font-bold">Estado: Operativo</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">
                            {activeTab === "academic" ? "Plan Académico" :
                                activeTab === "staff" ? "Gestión de Personal" :
                                    activeTab === "discipline" ? "Control Disciplinario" : "Circulares y Boletines"}
                        </h2>
                        <p className="text-gray-400 font-medium">Panel de supervisión y control institucional.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-institutional-blue transition-colors relative">
                            <Bell size={24} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-institutional-magenta rounded-full"></span>
                        </button>
                        <button className="bg-institutional-blue text-white px-8 py-4 rounded-[20px] font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
                            <PlusCircle size={20} /> Crear Nuevo
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[36px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-5 mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                                    <stat.icon className={`text-${stat.color.split("-")[1]}-500`} size={28} />
                                </div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">{stat.label}</p>
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-4xl font-black text-gray-800 tracking-tighter">{stat.value}</p>
                                <ChevronRight className="text-gray-200" size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section Content */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-gray-800">Actividad Reciente</h3>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" placeholder="Filtrar..." className="pl-12 pr-6 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-institutional-blue/20" />
                                </div>
                                <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-institutional-blue transition-colors"><Filter size={20} /></button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="py-6 flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-institutional-blue group-hover:text-white transition-colors">
                                            {i}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 text-lg">Guía de Matemáticas - Grado 10°</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Hace 2 horas</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Users size={12} /> Lic. Roberto Gómez</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Revisado</span>
                                        <button className="p-2 text-gray-300 hover:text-institutional-blue group-hover:bg-blue-50 rounded-xl transition-all">
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
