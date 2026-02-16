"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, CheckCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function LegalPage() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('terms'); // terms, privacy
    const [saving, setSaving] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        const { data, error } = await supabase
            .from('legal_docs')
            .select('*');
        if (data) setDocs(data);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const currentDoc = docs.find(d => d.slug === activeTab);

        if (!currentDoc) return;

        const { error } = await supabase
            .from('legal_docs')
            .update({ content: currentDoc.content, updated_at: new Date() })
            .eq('id', currentDoc.id);

        setSaving(false);
        if (!error) alert('Documento guardado correctamente');
        else alert('Error al guardar');
    };

    const updateContent = (val) => {
        setDocs(docs.map(d => d.slug === activeTab ? { ...d, content: val } : d));
    };

    const currentContent = docs.find(d => d.slug === activeTab)?.content || '';

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <a href="/superadmin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Volver al Dashboard
                </a>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Textos Legales</h1>
                        <p className="text-slate-400 font-medium">Edita los términos y políticas visibles en el sitio web.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 font-bold transition-all ${activeTab === 'terms' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:bg-slate-900'}`}
                        >
                            <FileText size={18} /> Términos
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 font-bold transition-all ${activeTab === 'privacy' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:bg-slate-900'}`}
                        >
                            <FileText size={18} /> Privacidad
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[500px] flex flex-col">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                {activeTab === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'}
                            </h3>
                            <span className="text-xs text-slate-500">Formato HTML Básico</span>
                        </div>
                        <textarea
                            value={currentContent}
                            onChange={(e) => updateContent(e.target.value)}
                            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-300 font-mono text-sm focus:border-purple-500 outline-none resize-none leading-relaxed"
                            placeholder="Escribe aquí el contenido en HTML..."
                        ></textarea>
                        <div className="mt-4 text-xs text-slate-600 flex gap-4">
                            <span>Sugerencia: Usa etiquetas &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; para dar formato.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
