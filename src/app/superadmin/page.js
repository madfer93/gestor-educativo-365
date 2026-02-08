"use client";
import React, { useEffect, useState } from 'react';
import { ShieldCheck, School, Users, Activity, Plus, LogOut } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';

export default function SuperAdminDashboard() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data, error } = await supabase
                .from('schools')
                .select('*');

            if (data) setSchools(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans">
            <nav className="border-b border-slate-800 p-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-lg shadow-lg shadow-purple-900/20">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black tracking-tight leading-none text-lg">Gestor Educativo 365</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">SaaS Master Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-200">Super Admin</p>
                            <p className="text-[10px] text-slate-500">Global Access</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 p-2 rounded-xl transition-all"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto p-6 md:p-10">
                <div className="mb-12">
                    <h2 className="text-4xl font-black mb-2 text-white tracking-tight">Consola Maestra</h2>
                    <p className="text-slate-400 font-medium">Gestión centralizada de instituciones educativas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                                <School size={32} />
                            </div>
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase px-3 py-1 rounded-full">Activo</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Instituciones</h3>
                        <p className="text-5xl font-black text-white">{schools.length}</p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-colors">
                                <Users size={32} />
                            </div>
                        </div>
                        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Usuarios Totales</h3>
                        <p className="text-5xl font-black text-white">6</p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 group-hover:text-pink-300 group-hover:bg-pink-500/20 transition-colors">
                                <Activity size={32} />
                            </div>
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase px-3 py-1 rounded-full">Online</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Estado del Sistema</h3>
                        <p className="text-xl font-black text-white">Operativo</p>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white">Colegios Registrados</h3>
                            <p className="text-slate-500 text-sm font-medium">Listado de clientes activos en la plataforma.</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2 hover:scale-105">
                            <Plus size={18} /> Agregar Colegio
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-slate-500 animate-pulse">Cargando datos...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-500 text-xs border-b border-slate-800">
                                        <th className="pb-4 pl-4 font-black uppercase tracking-widest">Institución</th>
                                        <th className="pb-4 font-black uppercase tracking-widest">Slug (URL)</th>
                                        <th className="pb-4 font-black uppercase tracking-widest">Estado</th>
                                        <th className="pb-4 pr-4 font-black uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {schools.map((school) => (
                                        <tr key={school.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors group">
                                            <td className="py-6 pl-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-black text-slate-400 border border-slate-700">
                                                        {school.nombre.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-white text-lg">{school.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 font-medium text-slate-400">/{school.slug}</td>
                                            <td className="py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${school.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {school.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="py-6 pr-4 text-right">
                                                {/* Enlace dinámico a la página de detalle */}
                                                <a
                                                    href={`/superadmin/instituciones/${school.id}`}
                                                    className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors inline-block"
                                                >
                                                    Administrar
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
