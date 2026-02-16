"use client";
import React, { useEffect, useState } from 'react';
import SaaSNavbar from '@/components/SaaSNavbar';
import { createBrowserClient } from '@supabase/ssr';

export default function PrivacidadPage() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase
                .from('legal_docs')
                .select('content')
                .eq('slug', 'privacy')
                .single();

            if (data) setContent(data.content);
            setLoading(false);
        };
        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <SaaSNavbar />

            <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-black text-white mb-2">Política de Privacidad</h1>
                <p className="text-purple-400 font-bold mb-8">Habeas Data y Protección de Datos Personales</p>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <article
                            className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
