"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, Save, ArrowLeft, UserPlus, Check, User } from 'lucide-react';

export default function SchoolManager({ params }) {
    const { id } = params;

    // States
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form States - School
    const [slogan, setSlogan] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [schoolUrl, setSchoolUrl] = useState(''); // Estado para Link del Colegio

    // Form States - Rector
    const [rectorEmail, setRectorEmail] = useState('');
    const [rectorPass, setRectorPass] = useState('123456');
    const [rectorName, setRectorName] = useState('');
    const [creatingRector, setCreatingRector] = useState(false);
    const [rectorMessage, setRectorMessage] = useState(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        if (id) fetchSchool();
    }, [id]);

    const fetchSchool = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('schools')
            .select('*')
            .eq('id', id)
            .single();

        if (data) {
            setSchool(data);
            setSlogan(data.slogan || '');
            setLogoUrl(data.logo_url || '');
            setSchoolUrl(data.school_url || ''); // Cargar URL
        }
        setLoading(false);
    };

    const handleSaveSchool = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('schools')
            .update({
                slogan: slogan,
                logo_url: logoUrl,
                school_url: schoolUrl
            })
            .eq('id', id);

        setSaving(false);
        if (error) {
            alert("Error al guardar: " + error.message);
            console.error(error);
        } else {
            alert("¡Cambios guardados!");
        }
    };

    const handleCreateRector = async (e) => {
        e.preventDefault();
        setCreatingRector(true);
        setRectorMessage(null);

        try {
            const response = await fetch('/api/auth/manage-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: rectorEmail,
                    password: rectorPass,
                    name: rectorName,
                    school_id: id,
                    rol: 'admin'
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Error desconocido');

            setRectorMessage("¡Rector Creado Exitosamente!");
            setRectorEmail('');
            setRectorName('');
        } catch (err) {
            setRectorMessage("Error: " + err.message);
        } finally {
            setCreatingRector(false);
        }
    };

    // ... (rest of the code remains the same until UI)

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <a href="/superadmin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Volver al Dashboard
                </a>

                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-600">
                        {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain rounded-2xl" /> : school.nombre.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">{school.nombre}</h1>
                        <p className="text-slate-400 font-medium">Configuración General</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PANEL DE IDENTIDAD */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-purple-500" /> Identidad Visual
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Eslogan Institucional</label>
                                <input
                                    type="text"
                                    value={slogan}
                                    onChange={(e) => setSlogan(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold focus:border-purple-500 transition-colors outline-none"
                                    placeholder="Ej: Formando líderes para el futuro"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">URL del Escudo/Logo</label>
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-medium focus:border-purple-500 transition-colors outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Link del Colegio (Software)</label>
                                <input
                                    type="text"
                                    value={schoolUrl}
                                    onChange={(e) => setSchoolUrl(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-medium focus:border-purple-500 transition-colors outline-none"
                                    placeholder="https://colegio.gestoreducativo.com"
                                />
                            </div>

                            <button
                                onClick={handleSaveSchool}
                                disabled={saving}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
                            >
                                {saving ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
                            </button>
                        </div>
                    </div>

                    {/* PANEL DE RECTOR */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <User className="text-blue-500" /> Crear Rector
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">Genera un usuario administrador para esta institución.</p>

                        <form onSubmit={handleCreateRector} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={rectorName}
                                    onChange={(e) => setRectorName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={rectorEmail}
                                    onChange={(e) => setRectorEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                    placeholder="rector@colegio.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contraseña Temporal</label>
                                <input
                                    type="text"
                                    required
                                    value={rectorPass}
                                    onChange={(e) => setRectorPass(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:border-blue-500 outline-none"
                                />
                            </div>

                            {rectorMessage && (
                                <div className={`p-4 rounded-xl text-sm font-bold ${rectorMessage.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {rectorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={creatingRector}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {creatingRector ? 'Creando...' : <><UserPlus size={20} /> Crear Usuario Rector</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
