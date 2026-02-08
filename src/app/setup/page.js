"use client";
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldAlert, Check, Trash2, UserPlus, ArrowRight, Mail } from 'lucide-react';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('madfer1993@gmail.com');
    const [password, setPassword] = useState('123456');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const handleCreateAdmin = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // 1. Intentar registrar al usuario
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: 'Super Admin Recovery',
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    // Si ya existe, intentamos login para ver si la contraseña coincide
                    const { error: loginError } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    if (loginError) {
                        throw new Error("El usuario ya existe pero la contraseña no coincide. POR FAVOR: Usa otro correo (ej: madfer1993+admin@gmail.com) o borra el usuario en Supabase.");
                    } else {
                        setMessage("¡El usuario ya existía y la contraseña ES CORRECTA! Redirigiendo...");
                        setTimeout(() => window.location.href = '/login', 2000);
                        return;
                    }
                }
                throw error;
            }

            if (data.user) {
                setMessage("¡Usuario Creado Exitosamente! Redirigiendo al login...");
                setTimeout(() => window.location.href = '/login', 2000);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-black mb-2">Generador de Admin</h1>
                    <p className="text-slate-400 text-sm">Crea un usuario nuevo para evadir problemas de base de datos.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Correo Nuevo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
                        />
                        <p className="text-[10px] text-yellow-500">
                            Tip: Si el principal falla, prueba <b>madfer1993+admin@gmail.com</b>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contraseña</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm text-red-400 font-bold break-words">
                            Error: {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-sm text-green-400 font-bold flex items-center gap-2">
                            <Check size={16} /> {message}
                        </div>
                    )}

                    <button
                        onClick={handleCreateAdmin}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Crear Usuario</>}
                    </button>

                    <a href="/login" className="block text-center text-slate-500 text-sm hover:text-white transition-colors">
                        Volver al Login
                    </a>
                </div>
            </div>
        </div>
    );
}

function Loader2({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    )
}
