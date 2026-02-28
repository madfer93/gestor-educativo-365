import { createClient } from '@/utils/supabase/server';
import { ArrowRight, MapPin, Phone, Calendar, Clock, Lock, Menu, UserPlus } from "lucide-react";
import ChatIA from "@/components/ChatIA";
import SchoolNavbar from "@/components/SchoolNavbar";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SchoolLanding({ params, searchParams }) {
    if (searchParams?.code) {
        redirect(`/auth/callback?code=${searchParams.code}`);
    }
    const supabase = createClient();
    const { data: school, error } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!school) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <Lock size={64} className="mb-4 text-slate-300" />
                <h1 className="text-2xl font-black text-slate-800">Institución no encontrada</h1>
                <p>Verifica la URL o contacta al administrador.</p>
                <a href="/" className="mt-8 text-blue-600 hover:underline">Ir al Inicio del Software</a>
            </div>
        )
    }

    // fallback de estilos si no hay custom branding
    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#1e3a8a' };

    return (
        <div className="bg-white font-sans selection:bg-blue-100">
            {/* Hero / Banner Principal */}
            <div className="relative overflow-hidden bg-white">
                {/* Imagen del Colegio como Banner */}
                <div className="w-full">
                    <img
                        src={school.banner_url || "/latinoamericano/colegio2.jpg"}
                        alt="Banner Institucional"
                        className="w-full h-auto object-cover shadow-inner"
                    />
                </div>

                <div className="container mx-auto px-6 py-12 relative z-10 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a href={`/${params.slug}/login`}
                            className="text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95"
                            style={{ backgroundColor: branding.primary, boxShadow: `0 20px 40px -10px ${branding.primary}60` }}
                        >
                            <Lock size={22} /> Ingresar a Plataforma
                        </a>
                        <a href={`/${params.slug}/admisiones`}
                            className="bg-white text-blue-900 border-2 border-blue-900 px-10 py-5 rounded-[20px] font-black uppercase tracking-widest shadow-xl transition-all hover:bg-blue-50 flex items-center justify-center gap-3 active:scale-95"
                        >
                            <UserPlus size={22} /> Iniciar Admisión
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="container mx-auto px-6 py-16 bg-slate-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-blue-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Información General</span>
                            <h2 className="text-4xl font-black text-blue-900 mb-6 leading-tight">{school.slogan || 'EXCELENCIA EN FORMACIÓN INTEGRAL'}</h2>
                            <p className="text-blue-900/70 text-lg leading-relaxed mb-8 whitespace-pre-wrap font-medium">
                                {school.mision || `Este sitio ha sido diseñado para los Estudiantes de Básica Primaria, Básica Secundaria y Media del ${school.nombre} como estrategia virtual de apoyo Académico.\nAquí encontrarán horarios, guías y acceso a las aulas virtuales.`}
                            </p>
                            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-3xl border border-blue-100 flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-sm border border-blue-100">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-blue-900 uppercase tracking-widest text-sm mb-1">Horarios de Atención</h3>
                                    <p className="text-sm text-blue-600 font-bold italic">Lunes a Viernes: 7:00 AM - 3:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-blue-50 sticky top-24">
                            <h3 className="font-black text-blue-900 uppercase tracking-widest text-sm mb-8 border-b-2 border-blue-50 pb-4 flex items-center gap-3">
                                <span className="w-2 h-2 bg-blue-900 rounded-full"></span> Accesos Rápidos
                            </h3>
                            <div className="space-y-4">
                                <a href={`/${params.slug}/login`} className="block w-full bg-blue-900 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                                    PORTAL ACADÉMICO
                                </a>
                                <a href={`/${params.slug}/pagos`} className="block w-full bg-white border-2 border-blue-900 text-blue-900 text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all active:scale-95">
                                    Pagos en Línea
                                </a>
                                <a href={`/${params.slug}/costos`} className="block w-full bg-blue-50 text-blue-800 text-center py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-95 transition-all">
                                    Costos Académicos
                                </a>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Redes Sociales</h3>
                                <div className="flex gap-2">
                                    {school.facebook_url && (
                                        <a href={school.facebook_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center font-bold text-xs uppercase hover:bg-blue-700 transition-colors">Facebook</a>
                                    )}
                                    {school.instagram_url && (
                                        <a href={school.instagram_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white py-2 rounded-lg text-center font-bold text-xs uppercase hover:brightness-110 transition-all">Instagram</a>
                                    )}
                                    {school.tiktok_url && (
                                        <a href={school.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-black text-white py-2 rounded-lg text-center font-bold text-xs uppercase hover:bg-slate-900 transition-colors">TikTok</a>
                                    )}
                                    {school.youtube_url && (
                                        <a href={school.youtube_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-red-600 text-white py-2 rounded-lg text-center font-bold text-xs uppercase hover:bg-red-700 transition-colors">YouTube</a>
                                    )}
                                    {!school.facebook_url && !school.instagram_url && !school.tiktok_url && !school.youtube_url && (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase py-2">No configuradas</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Boletines y Circulares Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-institutional-magenta font-extrabold text-xs uppercase tracking-[0.3em] mb-2 block">Comunicación Oficial</span>
                            <h2 className="text-4xl font-black text-slate-800">Boletines y Circulares</h2>
                        </div>
                        <a href={`/${params.slug}/noticias`} className="text-institutional-blue font-black text-sm hover:underline flex items-center gap-2">
                            Ver Histórico <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Circular Card */}
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-institutional-blue/10 transition-all group cursor-pointer">
                            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-institutional-blue mb-6 shadow-sm group-hover:scale-110 transition-transform" style={{ color: branding.primary }}>
                                <Calendar size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 font-black">Circular 001: Inicio de Actividades 2026</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">Información importante sobre el cronograma de matrícula y bienvenida al nuevo ciclo escolar.</p>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hace 2 días</span>
                                <button className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: branding.primary }}>Descargar PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatIA />
        </div >
    );
}

// Helper para crear cliente Server Side (Necesitamos este archivo si no existe, o reusar utils)
// NOTA: Asumo que tienes un utils/supabase/server.js configurado para Server Components.
// Si no, usaré código inline o mock data si falla el build.
