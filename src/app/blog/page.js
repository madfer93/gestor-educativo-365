"use client";
import React from "react";
import { mockData } from "@/data/mockData";
import { ArrowLeft, Clock, Calendar, ArrowRight, Bell, Share2 } from "lucide-react";

export default function BlogPage() {
    const { colegio } = mockData;

    return (
        <div className="min-h-screen bg-white">
            {/* Blog Navigation */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2 group">
                        <img src={colegio.logoSolo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-institutional-blue text-[10px] tracking-tighter group-hover:text-institutional-magenta transition-colors">
                            LATINOAMERICANO
                        </span>
                    </a>
                    <div className="flex gap-2 items-center">
                        <a href="/institucion" className="text-[10px] font-black text-institutional-blue hover:text-institutional-magenta transition-colors px-4 py-2 uppercase tracking-widest">Institución</a>
                        <a href="/blog" className="text-[10px] font-black text-institutional-magenta px-4 py-2 uppercase tracking-widest border-b-2 border-institutional-magenta">Blog</a>
                        <a href="/admin" className="text-[10px] font-black text-gray-400 hover:text-institutional-blue transition-colors px-4 py-2 uppercase tracking-widest">Rectoría</a>
                        <a href="/estudiante" className="bg-institutional-magenta text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-magenta-500/30 hover:scale-105 transition-transform">
                            Admisiones
                        </a>
                    </div>
                </div>
            </nav>

            {/* Blog Hero */}
            <header className="pt-40 pb-20 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="bg-blue-50 text-institutional-blue text-[10px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-full mb-8 inline-block shadow-sm">
                        Canal de Comunicación Oficial
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-institutional-blue tracking-tighter mb-8 leading-none">
                        Noticias y <span className="text-institutional-magenta">Actualidad</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed italic">
                        "Enterate de los últimos comunicados, eventos y logros de nuestra comunidad educativa."
                    </p>
                </div>
                {/* Abstract background elements */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-institutional-blue/5 rounded-full blur-3xl text-institutional-blue"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-institutional-magenta/5 rounded-full blur-3xl"></div>
            </header>

            {/* Blog Feed */}
            <main className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 gap-32 max-w-5xl mx-auto">
                    {colegio.noticias.map((nota) => (
                        <article key={nota.id} className="group relative">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                                {/* Visual Side */}
                                <div className="lg:col-span-5">
                                    <div className="aspect-[4/5] bg-gray-50 rounded-[60px] border-8 border-white shadow-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                        <div className="absolute inset-0 flex items-center justify-center text-institutional-blue/10">
                                            <Calendar size={180} strokeWidth={1} />
                                        </div>
                                        <div className="absolute top-10 left-10 bg-institutional-magenta text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-xl">
                                            {nota.categoria}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="lg:col-span-7 pt-4">
                                    <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-institutional-blue"><Clock size={16} /></div>
                                        {nota.fecha} • Por Rectoría
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-10 group-hover:text-institutional-blue transition-colors leading-[1.1] tracking-tighter">
                                        {nota.titulo}
                                    </h2>
                                    <p className="text-gray-500 text-xl leading-relaxed mb-12 font-medium">
                                        {nota.resumen}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <button className="bg-institutional-blue text-white px-10 py-5 rounded-3xl font-black text-sm shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-3">
                                            Leer Comunicado Completo <ArrowRight size={20} />
                                        </button>
                                        <button className="w-14 h-14 border-4 border-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:border-institutional-magenta hover:text-institutional-magenta transition-all">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Newsletter / Join Section */}
            <section className="bg-institutional-blue py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20"><Bell size={120} /></div>
                    <div className="absolute bottom-20 right-20"><Calendar size={200} /></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">No te pierdas de nada</h2>
                    <p className="text-white/60 text-xl font-medium max-w-xl mx-auto mb-12">Suscríbete para recibir los comunicados oficiales directamente en tu correo electrónico.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input type="email" placeholder="tu-correo@ejemplo.com" className="flex-1 bg-white/10 border-none rounded-2xl px-8 py-5 text-white placeholder:text-white/30 font-bold focus:ring-2 ring-institutional-magenta outline-none transition-all" />
                        <button className="bg-institutional-magenta text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">Unirse</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6 grayscale opacity-30">
                        <img src={colegio.logoSolo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-institutional-blue text-xs uppercase tracking-widest">COLEGIO LATINOAMERICANO</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold tracking-[0.4em] uppercase">© 2026 Reservados todos los derechos</p>
                </div>
            </footer>
        </div>
    );
}
