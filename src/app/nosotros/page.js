"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, Target, Eye, Users, Heart, Coffee, ArrowRight } from 'lucide-react';
import SaaSNavbar from '@/components/SaaSNavbar';
import SalesChatBubble from '@/components/SalesChatBubble';

export default function NosotrosPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <SaaSNavbar />

            {/* Hero / History Section */}
            <section className="relative pt-32 pb-24 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 block">Nuestra Historia</span>
                            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                Transformando el <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">futuro educativo.</span>
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Gestor Educativo 365 nació como una respuesta a la necesidad de modernizar las instituciones educativas en Latinoamérica.
                                <br /><br />
                                Bajo el respaldo de <strong>Variedades JyM</strong>, hemos desarrollado una herramienta "todo en uno" que permite a los rectores y docentes enfocarse en lo más importante: <strong>educar</strong>.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <Shield size={20} className="text-blue-400" />
                                    <span className="text-sm font-bold">Respaldo JyM</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <Heart size={20} className="text-pink-400" />
                                    <span className="text-sm font-bold">Hecho con Pasión</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071823930-74df213f1c18?q=80&w=2070&auto=format&fit=crop"
                                alt="Equipo de trabajo"
                                className="relative rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Cards */}
            <section className="py-24 bg-slate-900/50 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-10 rounded-[40px] bg-slate-950 border border-slate-800 hover:border-blue-500/30 transition-all group">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Target size={32} className="text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-black mb-6">Misión</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Proveer a las instituciones educativas de las herramientas tecnológicas más avanzadas para automatizar sus procesos académicos, administrativos y financieros,
                                fomentando una cultura de eficiencia y transparencia.
                            </p>
                        </div>
                        <div className="p-10 rounded-[40px] bg-slate-950 border border-slate-800 hover:border-purple-500/30 transition-all group">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Eye size={32} className="text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-black mb-6">Visión</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Ser para el 2030 la plataforma líder en el mercado educativo de habla hispana, reconocida por nuestra innovación constante y por facilitar el acceso a una gestión educativa de primer nivel.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values / Highlights */}
            <section className="py-32">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h2 className="text-4xl font-black mb-16">Por qué elegirnos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        <ValueItem icon={<Users size={40} />} title="Enfoque Humano" desc="Diseñado por educadores para educadores." />
                        <ValueItem icon={<Coffee size={40} />} title="Cero Estrés" desc="Nos encargamos de lo técnico, tú de enseñar." />
                        <ValueItem icon={<Shield size={40} />} title="Seguridad Máxima" desc="Tus datos y los de tus alumnos están blindados." />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-32 px-6">
                <div className="container mx-auto max-w-4xl bg-gradient-to-br from-blue-600 to-purple-700 rounded-[40px] p-12 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">¿Listo para transformar tu colegio?</h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto relative z-10">Únete a las instituciones que ya están liderando la educación del siglo XXI.</p>
                    <Link href="/auth" className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all hover:scale-105 shadow-xl relative z-10">
                        Agenda una Demo Gratis <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <SalesChatBubble />

            <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-sm">
                <p>© 2026 Gestor Educativo 365. Un producto de Variedades JyM.</p>
            </footer>
        </div>
    );
}

function ValueItem({ icon, title, desc }) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-blue-500 mb-6 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h4 className="text-xl font-bold mb-3">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
