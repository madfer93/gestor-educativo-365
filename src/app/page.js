"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import SalesChatBubble from '@/components/SalesChatBubble';
import SaaSNavbar from '@/components/SaaSNavbar';

export default function SaaSLanding() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">

            <SaaSNavbar />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="container mx-auto text-center max-w-5xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-[11px] font-bold uppercase tracking-widest mb-8 hover:bg-white/10 transition-all cursor-default backdrop-blur-sm">
                        <SparkleIcon /> INNOVACIÓN EDUCATIVA 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                        Tu Colegio, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
                            Más Inteligente.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                        La plataforma "All-in-One" que automatiza matrículas, gestión académica y financiera. Delega lo operativo a la IA y enfócate en educar.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link href="/auth" className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300">
                            Prueba Gratis 7 Días <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="https://wa.me/573045788873?text=Hola,%20quiero%20mas%20informacion"
                            target="_blank"
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
                        >
                            Hablar con Ventas
                        </a>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="mt-20 relative mx-auto max-w-4xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30"></div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 md:p-4 shadow-2xl">
                            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                                {/* Simulated UI - High Fidelity */}
                                <div className="absolute inset-0 flex bg-slate-950">
                                    {/* Sidebar */}
                                    <div className="w-16 md:w-56 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:flex flex-col gap-4">
                                        <div className="flex items-center gap-2 mb-4 px-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <div className="space-y-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`h-8 rounded-lg w-full flex items-center px-3 gap-3 ${i === 0 ? 'bg-blue-600/20 border border-blue-600/30' : 'hover:bg-white/5'}`}>
                                                    <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                                                    <div className={`h-2 rounded w-20 ${i === 0 ? 'bg-blue-200' : 'bg-slate-700'}`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="flex-1 p-6 overflow-hidden">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <div className="h-2 w-20 bg-slate-600 rounded mb-2"></div>
                                                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                                                <div className="w-8 h-8 rounded-full bg-purple-600 border border-purple-500"></div>
                                            </div>
                                        </div>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-800 mb-1"></div>
                                                    <div className="h-6 w-16 bg-white rounded"></div>
                                                    <div className="h-3 w-24 bg-slate-600 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Chart Area */}
                                        <div className="h-full bg-slate-900/30 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                                            <div className="flex items-end justify-between h-32 gap-2 mt-8 px-4">
                                                {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95].map((h, i) => (
                                                    <div key={i} className="w-full bg-blue-600 rounded-t-sm opacity-60" style={{ height: `${h}%` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Teaser (Moved Up) */}
            <section className="py-12 bg-blue-950/20 border-y border-blue-500/10 backdrop-blur-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                    <div className="bg-blue-600/20 p-3 rounded-full text-blue-400">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-400 tracking-wider uppercase mb-1">Respaldo Total</p>
                        <h3 className="text-xl md:text-2xl font-bold text-white">Somos una iniciativa de <span className="text-blue-400">Variedades JyM</span></h3>
                    </div>
                    <Link href="/nosotros" className="px-6 py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-sm font-bold transition-all flex items-center gap-2">
                        Quiénes Somos <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Features (Grid) */}
            <section className="py-24 bg-slate-950 border-t border-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-blue-400 font-bold tracking-wider text-sm uppercase">Características Principales</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">Todo lo que necesitas en un solo lugar.</h2>
                        <p className="text-slate-400 text-lg">Olvídate de Excel, papeles perdidos y software de los años 90. Es hora de evolucionar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap size={32} className="text-yellow-400" />}
                            title="Gestión Académica"
                            desc="Boletines automáticos, control de asistencia y observador del alumno digitalizado."
                        />
                        <FeatureCard
                            icon={<Shield size={32} className="text-green-400" />}
                            title="Tesorería Blindada"
                            desc="Control de pensiones, facturación electrónica y pagos online integrados (Wompi)."
                        />
                        <FeatureCard
                            icon={<Globe size={32} className="text-purple-400" />}
                            title="Comunidad Conectada"
                            desc="Apps para padres y estudiantes. Notificaciones en tiempo real y cero fricción."
                        />
                    </div>
                </div>
            </section>



            {/* Mega Footer */}
            <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 font-sans">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-1">
                            <h4 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                                <img src="/logo.png" alt="Gestor365 Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-purple-900/20" />
                                Gestor365
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                La plataforma educativa más avanzada para colegios que buscan excelencia, automatización y crecimiento.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">FB</div>
                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all cursor-pointer">IG</div>
                            </div>
                        </div>

                        {/* Links Column */}
                        <div>
                            <h5 className="font-bold text-slate-200 mb-6">Plataforma</h5>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="/auth" className="hover:text-purple-400 transition-colors">Iniciar Sesión</Link></li>
                                <li><Link href="/precios" className="hover:text-purple-400 transition-colors">Planes y Precios</Link></li>
                                <li><Link href="/auth" className="hover:text-purple-400 transition-colors">Solicitar Demo</Link></li>
                                <li><Link href="/nosotros" className="hover:text-purple-400 transition-colors">Sobre Nosotros</Link></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h5 className="font-bold text-slate-200 mb-6">Legal</h5>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="/legal/terminos" className="hover:text-purple-400 transition-colors">Términos de Uso</Link></li>
                                <li><Link href="/legal/privacidad" className="hover:text-purple-400 transition-colors">Política de Privacidad</Link></li>
                                <li><Link href="/legal/habeas-data" className="hover:text-purple-400 transition-colors">Habeas Data</Link></li>
                                <li><Link href="/soporte" className="hover:text-purple-400 transition-colors">Centro de Ayuda</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h5 className="font-bold text-slate-200 mb-6">Contacto</h5>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">📍</span>
                                    <span>Villavicencio, Meta<br />Colombia</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-green-500">📱</span>
                                    <a href="https://wa.me/573045788873" target="_blank" className="hover:text-white transition-colors">+57 304 578 8873</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-blue-500">✉️</span>
                                    <a href="mailto:contacto@gestoreducativo365.com" className="hover:text-white transition-colors">contacto@gestoreducativo365.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-sm">© 2026 Gestor Educativo 365. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <span>Un producto de</span>
                            <a href="https://www.variedadesjym.online/" target="_blank" className="text-slate-400 font-bold hover:text-white transition-colors">Variedades JyM</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Chatbot */}
            <SalesChatBubble />
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-purple-400">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
        </svg>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all group">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
