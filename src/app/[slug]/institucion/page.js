"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, GraduationCap, Calendar, CheckCircle, Target, Flag, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Institucion({ params }) {
    const supabase = createClient();
    const [school, setSchool] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { data: sData } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
            if (sData) {
                setSchool(sData);
                const { data: gData } = await supabase.from('school_gallery').select('*').eq('school_id', sData.id).order('created_at', { ascending: false });
                if (gData) setGallery(gData);
            }
            setLoading(false);
        }
        loadData();
    }, [params.slug]);

    const grados = [
        { nivel: "Preescolar", inscritos: "Cupos Disponibles", detalle: "Párvulos, Pre-jardín y Jardín." },
        { nivel: "Primaria", inscritos: "Cupos Disponibles", detalle: "Primero a Quinto Grado." },
        { nivel: "Bachillerato", inscritos: "Cupos Disponibles", detalle: "Sexto a Once (Ciclo completo)." },
        { nivel: "Sabatina", inscritos: "Matrículas Abiertas", detalle: "Bachillerato formal para adultos." },
    ];

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Cargando información...</div>;
    }

    return (
        <div className="bg-white">
            <main className="container mx-auto px-6 py-20">
                <div className="text-center mb-20">
                    <span className="bg-magenta-50 text-institutional-magenta text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block">
                        Identidad Institucional
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-institutional-blue tracking-tighter mb-6">{school?.nombre || "Nuestra Institución"}</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">{school?.slogan || "Formando líderes para el futuro"}</p>
                </div>

                {/* Misión y Visión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
                        <div className="w-14 h-14 bg-institutional-blue text-white rounded-2xl flex items-center justify-center mb-8 border-4 border-white shadow-xl group-hover:bg-institutional-magenta transition-colors">
                            <Target size={28} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 mb-4">Nuestra Misión</h3>
                        <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{school?.mision || "Misión no definida aún."}</p>
                    </div>
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
                        <div className="w-14 h-14 bg-institutional-blue text-white rounded-2xl flex items-center justify-center mb-8 border-4 border-white shadow-xl group-hover:bg-institutional-magenta transition-colors">
                            <Flag size={28} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 mb-4">Nuestra Visión</h3>
                        <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{school?.vision || "Visión no definida aún."}</p>
                    </div>
                </div>

                {/* Oferta y Horarios */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-institutional-blue tracking-tighter mb-4">Grados y Horarios</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Contamos con una oferta educativa robusta adaptada a las necesidades de la comunidad.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {grados.map((g, i) => (
                        <div key={i} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
                            <div className="w-14 h-14 bg-institutional-blue text-white rounded-2xl flex items-center justify-center mb-8 border-4 border-white shadow-xl group-hover:bg-institutional-magenta transition-colors">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2">{g.nivel}</h3>
                            <p className="text-institutional-magenta font-black text-[10px] uppercase tracking-widest mb-6">{g.inscritos}</p>
                            <p className="text-gray-500 font-medium leading-relaxed">{g.detalle}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="bg-institutional-blue rounded-[50px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Clock size={200} />
                        </div>
                        <h2 className="text-4xl font-black mb-10 relative z-10">Horarios Institucionales</h2>
                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-6 border-b border-white/10 pb-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">1</div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest text-institutional-magenta mb-1">Jornada Mañana</p>
                                    <p className="text-lg font-medium">{school?.schedule_morning || "6:30 AM — 12:30 PM"}</p>
                                    <p className="text-xs text-white/50">(Primaria y Bachillerato)</p>
                                </div>
                            </div>
                            <div className="flex gap-6 border-b border-white/10 pb-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">2</div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest text-institutional-magenta mb-1">Jornada Tarde</p>
                                    <p className="text-lg font-medium">{school?.schedule_afternoon || "1:00 PM — 6:00 PM"}</p>
                                    <p className="text-xs text-white/50">(Preescolar y refuerzos)</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">3</div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest text-institutional-magenta mb-1">Jornada Sabatina</p>
                                    <p className="text-lg font-medium">7:00 AM — 4:00 PM</p>
                                    <p className="text-xs text-white/50">(Ciclos de Adultos)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-institutional-blue mb-8">Calendario Académico 2026</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="text-institutional-magenta" size={24} />
                                <div>
                                    <p className="font-black text-gray-800">Cierre de Cupos:</p>
                                    <p className="text-gray-500 font-medium">Septiembre 2025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckCircle className="text-institutional-magenta" size={24} />
                                <div>
                                    <p className="font-black text-gray-800">Iniciación de Clases:</p>
                                    <p className="text-gray-500 font-medium">Enero 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckCircle className="text-institutional-magenta" size={24} />
                                <div>
                                    <p className="font-black text-gray-800">Entregas de Boletín:</p>
                                    <p className="text-gray-500 font-medium">Trimestrales</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-12 bg-institutional-magenta text-white px-10 py-5 rounded-3xl font-black text-sm shadow-2xl shadow-magenta-500/30 hover:scale-105 transition-transform">
                            Descargar Calendario Completo (PDF)
                        </button>
                    </div>
                </div>

                {/* Galería Fotográfica */}
                {gallery && gallery.length > 0 && (
                    <div className="mt-20">
                        <div className="text-center mb-16">
                            <span className="bg-blue-50 text-institutional-blue text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block">
                                Nuestras Aulas e Instalaciones
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter mb-4">Galería Fotográfica</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gallery.map((photo, i) => (
                                <div key={i} className="group relative rounded-[32px] overflow-hidden aspect-video border border-gray-100 shadow-sm">
                                    <img src={photo.image_url} alt={photo.title || "Galería"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-institutional-blue/90 via-institutional-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                        <p className="text-white font-bold text-lg mb-1">{photo.title}</p>
                                        <p className="text-blue-200 text-sm line-clamp-2">{photo.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-4">© 2026 Colegio Latinoamericano</p>
                    <p className="text-institutional-blue font-black text-xs">Nueva Administración • Villavicencio</p>
                </div>
            </footer>
        </div>
    );
}
