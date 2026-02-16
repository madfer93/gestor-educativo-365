"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('¡Enlace enviado! Revisa tu correo para ingresar.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950">

            <Link href="/" className="mb-12 flex items-center gap-3 hover:scale-105 transition-transform">
                <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-xl shadow-xl shadow-purple-900/20">
                    <ShieldCheck size={32} className="text-white" />
                </div>
                <span className="font-black text-2xl tracking-tight">Gestor365</span>
            </Link>

            <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black mb-3">Bienvenido</h1>
                    <p className="text-slate-400 font-medium">Ingresa tu correo para iniciar sesión de forma segura.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={20} className="text-slate-500" />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-purple-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-white/5"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                Enviar Enlace Mágico <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`mt-8 p-4 rounded-2xl text-sm font-bold text-center ${message.startsWith('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {message}
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">
                        ¿No tienes una cuenta? <br />
                        <a href="https://wa.me/573045788873" target="_blank" className="text-purple-400 font-bold hover:underline">Contactar a Ventas</a>
                    </p>
                </div>
            </div>

            <p className="mt-12 text-slate-600 text-xs font-bold uppercase tracking-widest">
                Software Seguro • Encriptación de Punta a Punta
            </p>
        </div>
    );
}
