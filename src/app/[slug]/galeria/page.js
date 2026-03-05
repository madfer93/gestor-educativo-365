"use client";
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { X, Play, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage({ params }) {
    const supabase = createClient();
    const [gallery, setGallery] = useState([]);
    const [school, setSchool] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: schoolData } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
            setSchool(schoolData);
            if (schoolData) {
                const { data: galleryData } = await supabase
                    .from('school_gallery')
                    .select('*')
                    .eq('school_id', schoolData.id)
                    .order('created_at', { ascending: false });
                setGallery(galleryData || []);
            }
        };
        fetchData();
    }, [params.slug]);

    if (!school) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-200 pb-4">
                    📸 Galería Institucional
                </h1>

                {gallery && gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {gallery.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedItem(img)}
                                className="relative group overflow-hidden rounded-2xl aspect-square bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
                            >
                                {img.media_type === 'video' ? (
                                    <>
                                        <video
                                            src={img.image_url}
                                            className="object-cover w-full h-full"
                                            muted
                                            preload="metadata"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Play size={24} className="text-slate-700 ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={img.image_url}
                                        alt={img.title || 'Foto Galería'}
                                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div>
                                        <p className="text-white text-sm font-bold">{img.title}</p>
                                        {img.category && <span className="text-[10px] text-white/80 uppercase tracking-widest bg-white/20 px-2 py-1 rounded mt-2 inline-block">{img.category}</span>}
                                        {img.description && <p className="text-white/70 text-xs mt-1 line-clamp-2">{img.description}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-dashed border-2 border-slate-200">
                        <div className="mb-4 text-5xl opacity-20">📸</div>
                        <p className="text-slate-400 italic">No hay fotos en la galería aún.</p>
                    </div>
                )}
            </div>

            {/* Modal de Detalle */}
            {selectedItem && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-[30px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            {selectedItem.media_type === 'video' ? (
                                <video
                                    src={selectedItem.image_url}
                                    className="w-full max-h-[60vh] object-contain bg-black"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={selectedItem.image_url}
                                    alt={selectedItem.title}
                                    className="w-full max-h-[60vh] object-contain bg-slate-100"
                                />
                            )}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-black text-slate-800 mb-2">{selectedItem.title}</h3>
                            {selectedItem.category && (
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: `${branding.primary}15`, color: branding.primary }}>
                                    {selectedItem.category}
                                </span>
                            )}
                            {selectedItem.description && (
                                <p className="text-slate-600 text-sm font-medium leading-relaxed mt-3">{selectedItem.description}</p>
                            )}
                            <p className="text-slate-400 text-xs mt-4 font-medium">
                                {new Date(selectedItem.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
