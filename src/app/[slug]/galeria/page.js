"use client";
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { X, Play, ChevronLeft, ChevronRight, Image as ImageIcon, Images } from 'lucide-react';

export default function GalleryPage({ params }) {
    const supabase = createClient();
    const [gallery, setGallery] = useState([]);
    const [school, setSchool] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumImages, setAlbumImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadingImages, setLoadingImages] = useState(false);

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

    const openAlbum = async (album) => {
        setSelectedAlbum(album);
        setCurrentIndex(0);
        setLoadingImages(true);

        // Fetch album images from gallery_images table
        const { data: images } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('gallery_id', album.id)
            .order('sort_order', { ascending: true });

        if (images && images.length > 0) {
            setAlbumImages(images);
        } else {
            // Fallback: if no gallery_images, use the single image from school_gallery
            setAlbumImages([{ image_url: album.image_url, media_type: album.media_type || 'image' }]);
        }
        setLoadingImages(false);
    };

    const closeAlbum = () => {
        setSelectedAlbum(null);
        setAlbumImages([]);
        setCurrentIndex(0);
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % albumImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + albumImages.length) % albumImages.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (!selectedAlbum) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeAlbum();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedAlbum, albumImages]);

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
                        {gallery.map((album, i) => (
                            <div
                                key={album.id || i}
                                onClick={() => openAlbum(album)}
                                className="relative group overflow-hidden rounded-2xl aspect-square bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
                            >
                                {album.media_type === 'video' ? (
                                    <>
                                        <video
                                            src={album.image_url}
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
                                        src={album.image_url}
                                        alt={album.title || 'Foto Galería'}
                                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                {/* Album badge */}
                                <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Images size={14} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div>
                                        <p className="text-white text-sm font-bold">{album.title}</p>
                                        {album.category && <span className="text-[10px] text-white/80 uppercase tracking-widest bg-white/20 px-2 py-1 rounded mt-2 inline-block">{album.category}</span>}
                                        {album.description && <p className="text-white/70 text-xs mt-1 line-clamp-2">{album.description}</p>}
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

            {/* Modal de Álbum con Carrusel */}
            {selectedAlbum && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200" onClick={closeAlbum}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 text-white" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <h3 className="text-xl font-black">{selectedAlbum.title}</h3>
                            {selectedAlbum.description && (
                                <p className="text-white/60 text-sm mt-1">{selectedAlbum.description}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {albumImages.length > 1 && (
                                <span className="text-white/60 text-sm font-bold">
                                    {currentIndex + 1} / {albumImages.length}
                                </span>
                            )}
                            <button
                                onClick={closeAlbum}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Area */}
                    <div className="flex-1 flex items-center justify-center relative px-4" onClick={(e) => e.stopPropagation()}>
                        {loadingImages ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        ) : albumImages.length > 0 ? (
                            <>
                                {albumImages[currentIndex]?.media_type === 'video' ? (
                                    <video
                                        src={albumImages[currentIndex].image_url}
                                        className="max-w-full max-h-[75vh] object-contain rounded-xl"
                                        controls
                                        autoPlay
                                    />
                                ) : (
                                    <img
                                        src={albumImages[currentIndex]?.image_url}
                                        alt={`${selectedAlbum.title} - ${currentIndex + 1}`}
                                        className="max-w-full max-h-[75vh] object-contain rounded-xl"
                                    />
                                )}

                                {/* Navigation Arrows */}
                                {albumImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all text-white"
                                        >
                                            <ChevronLeft size={28} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all text-white"
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : null}
                    </div>

                    {/* Thumbnail Strip */}
                    {albumImages.length > 1 && (
                        <div className="px-6 py-4 flex justify-center gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                            {albumImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    {img.media_type === 'video' ? (
                                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                            <Play size={16} className="text-white" />
                                        </div>
                                    ) : (
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Date Footer */}
                    <div className="text-center py-3 text-white/40 text-xs font-medium">
                        {new Date(selectedAlbum.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            )}
        </div>
    );
}
