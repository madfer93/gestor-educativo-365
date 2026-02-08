"use client";
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, ArrowRight, CheckCircle, Loader2, Lock, KeyRound } from 'lucide-react';
import { mockData } from "@/data/mockData";

export default function LoginPage() {
    const { colegio } = mockData;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usePassword, setUsePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    // Cliente de Supabase para el navegador
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (usePassword) {
                // --- LOGIN CON CONTRASEÑA ---
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                // Si llegamos aquí, la contraseña es CORRECTA.
                // Ahora buscamos el rol manualmente para redirigir.
                if (data.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('rol')
                        .eq('id', data.user.id)
                        .single();

                    if (profile) {
                        // Redirección directa según rol
                        switch (profile.rol) {
                            case "superadmin": window.location.href = '/superadmin'; break;
                            case "admin": window.location.href = '/admin'; break;
                            case "secretary": window.location.href = '/secretaria'; break;
                            case "bursar": window.location.href = '/tesoreria'; break;
                            case "teacher": window.location.href = '/profesores'; break;
                            case "student": window.location.href = '/estudiante'; break;
                            default: window.location.href = '/';
                        }
                    } else {
                        // Si no tiene perfil, lo mandamos al home por seguridad
                        window.location.href = '/';
                    }
                }

            } else {
                // --- MAGIC LINK ---
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;
                setSent(true);
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message === "Invalid login credentials"
                ? "Credenciales incorrectas. Verifica tu correo y contraseña."
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
            {/* Columna Izquierda: Visual */}
            <div className="relative hidden md:flex flex-col justify-end p-12 bg-institutional-blue overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 text-white">
                    <h2 className="text-5xl font-black mb-6 tracking-tighter">Bienvenido al Portal</h2>
                    <p className="text-lg opacity-80 font-medium max-w-md">Gestiona tus actividades académicas, financieras y administrativas en un solo lugar.</p>
                </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="flex flex-col justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <img src={colegio.logoSolo} alt="Logo" className="w-20 mx-auto mb-6" />
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Iniciar Sesión</h1>
                        <p className="text-gray-500 mt-2">Ingresa tu correo institucional o personal registrado.</p>
                    </div>

                    {sent ? (
                        <div className="bg-green-50 p-8 rounded-3xl text-center border border-green-100 animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Enlace Enviado!</h3>
                            <p className="text-gray-600 mb-6">Hemos enviado un enlace mágico a <strong>{email}</strong>. Revisa tu bandeja de entrada (y spam) para ingresar.</p>
                            <button onClick={() => setSent(false)} className="text-sm font-bold text-institutional-blue hover:underline">
                                Intentar con otro correo
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="tu@correo.com"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-institutional-blue transition-all"
                                    />
                                </div>
                            </div>

                            {usePassword && (
                                <div className="space-y-2 animate-in slide-in-from-top-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-institutional-blue transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 text-red-500 text-sm font-bold rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-institutional-blue text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-900/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>{usePassword ? 'Entrar con Clave' : 'Enviar Enlace'} <ArrowRight size={20} /></>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setUsePassword(!usePassword)}
                                className="w-full text-sm text-gray-400 font-bold hover:text-institutional-blue flex items-center justify-center gap-2"
                            >
                                {usePassword ? <><Mail size={16} /> Usar Magic Link</> : <><KeyRound size={16} /> Tengo una contraseña</>}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-xs text-gray-400 font-medium pt-8 border-t border-gray-50">
                        ¿No tienes cuenta? <a href="/admisiones" className="text-institutional-magenta font-bold hover:underline">Solicitar Admisión</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
