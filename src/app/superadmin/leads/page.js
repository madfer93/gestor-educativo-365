"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Phone, MessageSquare, Calendar, Search } from 'lucide-react';

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefono?.includes(searchTerm) ||
        lead.mensaje?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Cargando leads...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <a href="/superadmin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Volver al Dashboard
                </a>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">CRM de Leads</h1>
                        <p className="text-slate-400 font-medium">Gestiona los interesados capturados por el Chatbot y Formularios.</p>
                    </div>
                    <div className="w-full md:w-auto relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-xs border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 font-black uppercase tracking-widest">Fecha</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest">Cliente Potencial</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest">Contacto</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest">Mensaje / Interés</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-800">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                            <span className="text-[10px] opacity-50 ml-6">{new Date(lead.created_at).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                                    <User size={14} />
                                                </div>
                                                {lead.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {lead.telefono && (
                                                    <a href={`https://wa.me/${lead.telefono}`} target="_blank" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium">
                                                        <Phone size={14} /> {lead.telefono}
                                                    </a>
                                                )}
                                                {lead.email && <span className="text-slate-400 text-xs">{lead.email}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={lead.mensaje}>
                                            {lead.mensaje || <span className="text-slate-600 italic">Sin mensaje</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide
                                                ${lead.estado === 'nuevo' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                                                ${lead.estado === 'contactado' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : ''}
                                                ${lead.estado === 'cerrado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                                            `}>
                                                {lead.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No se encontraron leads.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
