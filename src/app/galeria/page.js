"use client";
import React from "react";
import { mockData } from "@/data/mockData";
import { ArrowLeft, Image as ImageIcon, Maximize2, Camera } from "lucide-react";

export default function GaleriaPage() {
    const { colegio } = mockData;

    const fotos = [
        { id: 1, url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop", titulo: "Fachada Principal", categoria: "Infraestructura" },
        { id: 2, url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", titulo: "Aula de Sistemas", categoria: "Tecnología" },
        { id: 3, url: "https://images.unsplash.com/photo-1577891721396-22c5a3e73d99?q=80&w=2070&auto=format&fit=crop", titulo: "Laboratorio de Ciencias", categoria: "Académico" },
        { id: 4, url: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop", titulo: "Zona de Juegos", categoria: "Recreación" },
        { id: 5, url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop", titulo: "Biblioteca", categoria: "Cultura" },
        { id: 6, url: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cc?q=80&w=2070&auto=format&fit=crop", titulo: "Auditorio", categoria: "Eventos" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2 group">
                        <img src={colegio.logoSolo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-institutional-blue text-[10px] tracking-tighter group-hover:text-institutional-magenta transition-colors">
                            LATINOAMERICANO
                        </span>
                    </a>
                    <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-institutional-blue transition-colors font-black text-[10px] uppercase tracking-widest">
                        <ArrowLeft size={16} /> Volver al Inicio
                    </a>
                </div>
            </nav>

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="bg-blue-50 text-institutional-blue text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-full mb-8 inline-block shadow-sm">
                            Galería Institucional
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-institutional-blue tracking-tighter mb-8 leading-none">
                            Nuestra <span className="text-institutional-magenta">Casa</span>
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed italic">
                            Un recorrido visual por los espacios donde transformamos vidas cada día.
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {fotos.map((foto) => (
                            <div key={foto.id} className="group relative rounded-[50px] overflow-hidden border-8 border-white shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-50">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={foto.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={foto.titulo} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                                    <span className="text-institutional-magenta text-[10px] font-black uppercase tracking-widest mb-2">{foto.categoria}</span>
                                    <h3 className="text-white text-2xl font-black mb-4">{foto.titulo}</h3>
                                    <button className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                                        <Maximize2 size={16} /> Ampliar Imagen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-32 bg-institutional-blue rounded-[60px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10">
                            <Camera className="absolute -top-10 -left-10 w-64 h-64" />
                            <ImageIcon className="absolute -bottom-10 -right-10 w-80 h-80" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter relative z-10">¿Quieres conocerlo en persona?</h2>
                        <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto mb-12 relative z-10">Programe una visita guiada y descubra por qué somos la mejor elección para el futuro de sus hijos.</p>
                        <a href="https://wa.me/3212808022" className="bg-institutional-magenta text-white px-12 py-6 rounded-3xl font-black text-sm shadow-xl hover:scale-105 transition-all relative z-10 inline-block">
                            Agendar Visita por WhatsApp
                        </a>
                    </div>
                </div>
            </main>

            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">© 2026 Colegio Latinoamericano • Villavicencio</p>
                </div>
            </footer>
        </div>
    );
}
