"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, Mail, ArrowRight, Loader2, Lock, ArrowLeft, KeyRound, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function SchoolLoginPage({ params }) {
    const { slug } = params;
    const [school, setSchool] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('password');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fetchingSchool, setFetchingSchool] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        const fetchSchool = async () => {
            const { data } = await supabase
                .from('schools')
                .select('*')
                .eq('slug', slug)
                .single();
            if (data) setSchool(data);
            setFetchingSchool(false);
        };
        fetchSchool();
    }, [slug]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (loginMethod === 'magic-link') {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('¡Enlace enviado! Revisa tu correo para ingresar a la plataforma.');
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                // Redirigir al callback para procesar el rol y destino
                window.location.href = `/auth/callback?slug=${slug}`;
            }
        }
        setLoading(false);
    };

    if (fetchingSchool) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-institutional-blue" size={48} />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <Lock size={64} className="mb-4 text-slate-300" />
                <h1 className="text-2xl font-black text-slate-800">Institución no encontrada</h1>
                <a href="/" className="mt-8 text-blue-600 hover:underline">Ir al Inicio</a>
            </div>
        );
    }

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Side: Branding & Info (Hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 relative bg-institutional-blue overflow-hidden items-center justify-center text-white p-12" style={{ backgroundColor: branding.primary }}>
                <div className="absolute inset-0 opacity-10">
                    <img src="/latinoamericano/colegio2.jpg" alt="Wallpaper" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 text-center max-w-md">
                    <div className="bg-white p-6 rounded-[32px] inline-block mb-8 shadow-2xl">
                        <img src={school.logo_url} alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">{school.nombre}</h1>
                    <p className="text-white/70 font-medium text-lg italic">"{school.slogan || 'Excelencia Académica y Formación de Valores'}"</p>
                    <div className="mt-12 pt-12 border-t border-white/10 space-y-4">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Plataforma Educativa 2026</p>
                        <div className="flex justify-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-black">Admin</p>
                                <p className="text-[10px] uppercase opacity-50">Control</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">Docentes</p>
                                <p className="text-[10px] uppercase opacity-50">Académico</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">Padres</p>
                                <p className="text-[10px] uppercase opacity-50">Seguimiento</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 md:p-12 relative">
                <Link href={`/${slug}`} className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>

                <div className="w-full max-w-md">
                    {/* Mobile Logo Only */}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <img src={school.logo_url} alt="Logo" className="w-20 h-20 object-contain mb-4" />
                        <h2 className="text-2xl font-black text-slate-800 text-center uppercase tracking-tighter">{school.nombre}</h2>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-4xl font-black text-slate-800 mb-2">Iniciar Sesión</h2>
                        <p className="text-slate-500 font-medium">Ingresa para acceder a tu portal institucional.</p>
                    </div>

                    {/* Switch Method */}
                    <div className="flex bg-slate-50 p-1 rounded-2xl mb-8 border border-slate-100">
                        <button
                            onClick={() => setLoginMethod('magic-link')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'magic-link' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            style={loginMethod === 'magic-link' ? { color: branding.primary } : {}}
                        >
                            <LinkIcon size={14} /> Link Mágico
                        </button>
                        <button
                            onClick={() => setLoginMethod('password')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'password' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            style={loginMethod === 'password' ? { color: branding.primary } : {}}
                        >
                            <KeyRound size={14} /> Contraseña
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-300" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-5 pl-14 pr-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-institutional-blue transition-all font-bold text-lg"
                                    style={{ focusBorderColor: branding.primary }}
                                />
                            </div>
                        </div>

                        {loginMethod === 'password' && (
                            <>
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tu Contraseña</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <KeyRound size={20} className="text-slate-300" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-5 pl-14 pr-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-institutional-blue transition-all font-bold text-lg"
                                            style={{ focusBorderColor: branding.primary }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right px-4">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!email) {
                                                setMessage('Error: Ingresa tu correo electrónico.');
                                                return;
                                            }
                                            setLoading(true);
                                            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                                redirectTo: `${window.location.origin}/auth/update-password`,
                                            });
                                            if (error) setMessage(`Error: ${error.message}`);
                                            else setMessage('¡Enlace de recuperación enviado! Revisa tu bandeja de entrada.');
                                            setLoading(false);
                                        }}
                                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            style={{ backgroundColor: branding.primary, boxShadow: `0 20px 40px -10px ${branding.primary}60` }}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    {loginMethod === 'magic-link' ? 'Enviar Enlace Mágico' : 'Ingresar a la Plataforma'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-8 p-5 rounded-3xl text-sm font-black text-center ${message.startsWith('Error') ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message}
                        </div>
                    )}

                    <div className="mt-12 pt-12 border-t border-slate-100">
                        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-institutional-blue" style={{ color: branding.primary }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Acceso Seguro</p>
                                <p className="text-[10px] text-slate-500 font-medium">Protegemos la información académica de nuestra comunidad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
