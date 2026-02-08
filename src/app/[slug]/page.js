import { createClient } from '@/utils/supabase/server';
import { ArrowRight, MapPin, Phone, Calendar, Clock, Lock, Menu } from "lucide-react";
import ChatIA from "@/components/ChatIA";
import { headers } from 'next/headers';

// Esta función permite generar metadatos dinámicos por colegio
export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    return {
        title: school ? school.nombre : 'Colegio no encontrado',
        description: school ? school.slogan : '',
    }
}

export default async function SchoolLanding({ params }) {
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

    // fallback de estilos si no hay custom branding (podríamos guardarlo en JSON en la DB)
    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {school.logo_url ? (
                            <img src={school.logo_url} alt="Logo" className="w-10 h-10 object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-500">{school.nombre.charAt(0)}</div>
                        )}
                        <span className="font-black text-slate-800 tracking-tighter uppercase text-sm md:text-base hidden sm:block">
                            {school.nombre}
                        </span>
                    </div>
                    <div>
                        <a href="/login" className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                            Portal Académico
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Admisiones Abiertas
                    </div>
                    {school.logo_url && (
                        <img
                            src={school.logo_url}
                            alt="Colegio Logo"
                            className="w-32 md:w-48 mx-auto mb-10 drop-shadow-2xl animate-fade-in"
                        />
                    )}
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                        {school.nombre}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        "{school.slogan || 'Excelencia académica y formación integral.'}"
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/admisiones" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-600/20">
                            Iniciar Admisión
                        </a>
                        <a href="#contacto" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all">
                            Contáctanos
                        </a>
                    </div>
                </div>
            </section>

            {/* Info Bar */}
            <section className="bg-slate-50 py-12 border-y border-slate-100">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500"><MapPin /></div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Ubicación</p>
                            <p className="font-bold text-slate-700">Campus Principal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500"><Phone /></div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Contacto</p>
                            <p className="font-bold text-slate-700">Secretaría Académica</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-500"><Calendar /></div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Calendario</p>
                            <p className="font-bold text-slate-700">Ciclo Escolar Activo</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 text-center">
                <p className="text-slate-400 italic">Más información disponible próximamente...</p>
            </section>

            {/* Footer Institucional */}
            <footer className="bg-slate-900 text-white py-12 text-center">
                <p className="font-bold opacity-50 text-sm">© {new Date().getFullYear()} {school.nombre}. Todos los derechos reservados.</p>
                <p className="text-[10px] uppercase tracking-widest mt-4 opacity-30">Powered by Variedades JyM SaaS</p>
            </footer>

            <ChatIA />
        </div>
    );
}

// Helper para crear cliente Server Side (Necesitamos este archivo si no existe, o reusar utils)
// NOTA: Asumo que tienes un utils/supabase/server.js configurado para Server Components.
// Si no, usaré código inline o mock data si falla el build.
