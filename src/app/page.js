"use client";
import Link from 'next/link';
import { ArrowRight, Check, Zap, Shield, Globe } from 'lucide-react';
import SalesChatBubble from '@/components/SalesChatBubble';

export default function SaaSLanding() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Gestor Educativo 365 Logo" className="w-10 h-10 object-contain rounded-lg" />
                        <span className="font-black text-xl tracking-tight text-white">Gestor Educativo 365</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Iniciar Sesión</a>
                        <a href="#contacto" className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-black hover:bg-slate-200 transition-colors">Contactar Ventas</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-48 pb-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-8 hover:bg-white/10 transition-all cursor-default">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        Nuevo: Dashboard de Inteligencia Artificial
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                        La Plataforma Educativa <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Del Futuro.</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                        Automatiza matrículas, pagos y calificaciones con el SaaS más potente del mercado.
                        Diseñado para colegios que quieren liderar la era digital.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/login" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-purple-600/20">
                            Probar Demo Gratis <ArrowRight size={20} />
                        </a>
                        <a href="/latinoamericano" target="_blank" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                            Ver Colegio de Ejemplo <Globe size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-900/50 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Súper Rápido</h3>
                            <p className="text-slate-400">Infraestructura global optimizada para cargar en milisegundos, sin importar dónde estén tus estudiantes.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Seguridad Bancaria</h3>
                            <p className="text-slate-400">Tus datos financieros y académicos protegidos con encriptación de grado militar y backups automáticos.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Dominio Personalizado</h3>
                            <p className="text-slate-400">Vincula tu propio dominio (ej. tucolegio.edu.co) y ofrece una experiencia de marca 100% blanca.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-slate-500 text-sm">
                <p>© 2026 Gestor Educativo 365. Un producto de <a href="https://www.variedadesjym.online/" target="_blank" className="hover:text-white transition-colors">Variedades JyM</a>.</p>
            </footer>

            {/* Chatbot de Ventas */}
            <SalesChatBubble />
        </div>
    );
}
