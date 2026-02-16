"use client";
import React, { useState, useEffect } from 'react';
import { Users, Search, PlusCircle, Filter, FileText, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SecretariaDashboard({ params }) { // Added params prop
    const [activeTab, setActiveTab] = useState('matriculas');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schoolId, setSchoolId] = useState(null); // Added schoolId state

    // Cargar LEADS (Aspirantes)
    const fetchLeads = async () => {
        setLoading(true);

        // 1. Obtener ID del colegio por slug
        const { data: school, error: schoolError } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        if (schoolError) {
            console.error("Error fetching school ID:", schoolError);
            setLoading(false);
            return;
        }

        if (school) {
            setSchoolId(school.id);
            // 2. Filtrar leads por colegio
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('school_id', school.id)
                .order('created_at', { ascending: false });

            if (data) setLeads(data);
            if (error) console.error("Error fetching leads:", error);
        } else {
            console.warn("School not found for slug:", params.slug);
            setLeads([]); // Clear leads if school not found
        }
        setLoading(false);
    };

    const handleFormalizeStudent = async (lead) => {
        if (!confirm(`¿Deseas formalizar la matrícula de ${lead.nombre}? Se creará un acceso oficial para el estudiante.`)) return;

        if (!schoolId) return alert("Error: ID de colegio no encontrado. Por favor, recarga la página.");

        setLoading(true);
        try {
            // Generamos una contraseña temporal basada en el nombre o aleatoria
            const tempPassword = lead.telefono || "Estudiante2026*";
            const studentEmail = lead.email || `${lead.nombre.toLowerCase().replace(/\s/g, '.')}@colegio.com`;

            const response = await fetch('/api/auth/manage-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: studentEmail,
                    password: tempPassword,
                    name: lead.nombre,
                    school_id: schoolId, // Changed to use schoolId state
                    rol: 'student',
                    metadata: {
                        grado: lead.grado,
                        acudiente: lead.acudiente,
                        telefono: lead.telefono
                    }
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear estudiante');

            // Actualizar estado del lead
            await supabase.from('leads').update({ estado: 'Matriculado' }).eq('id', lead.id);

            alert(`¡Matrícula exitosa! Estudiante: ${studentEmail} / Clave: ${tempPassword}`);
            fetchLeads();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar Simple */}
            <aside className="bg-white w-full md:w-64 p-6 border-r border-gray-100 hidden md:block">
                <h1 className="text-xl font-black text-institutional-blue mb-10 tracking-tighter">SECRETARÍA</h1>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('matriculas')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'matriculas' ? 'bg-institutional-blue text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Users size={20} /> Matrículas
                    </button>
                    <button
                        onClick={() => setActiveTab('documentos')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'documentos' ? 'bg-institutional-blue text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <FileText size={20} /> Documentación
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">Gestión de Matrículas</h2>
                        <p className="text-gray-400 font-medium">Ciclo Escolar 2026</p>
                    </div>
                    <button onClick={fetchLeads} className="bg-white text-institutional-blue border border-blue-100 px-4 py-2 rounded-xl font-bold hover:bg-blue-50 flex items-center gap-2">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
                    </button>
                </header>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-8">
                    <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 rounded-xl">
                        <Search className="text-gray-400" size={20} />
                        <input type="text" placeholder="Buscar estudiante por nombre..." className="bg-transparent w-full py-3 font-medium outline-none text-gray-700" />
                    </div>
                    <button className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 font-medium">Cargando aspirantes...</div>
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
                                            <p className="text-xs text-gray-400 font-medium">Solicitud: {new Date(lead.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-600">{lead.grado}</td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-800 font-bold">{lead.acudiente}</p>
                                            <p className="text-xs text-gray-500">{lead.telefono}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${lead.estado === 'Matriculado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {lead.estado}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 flex gap-2">
                                            <button className="p-2 text-institutional-blue hover:bg-blue-50 rounded-lg" title="Ver Detalles">
                                                <FileText size={18} />
                                            </button>
                                            {lead.estado !== 'Matriculado' ? (
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 group"
                                                    title="Matricular Oficialmente"
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
            </main>
        </div>
    );
}
