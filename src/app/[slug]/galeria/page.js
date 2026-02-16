import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
    return {
        title: school ? `Galería - ${school.nombre}` : 'Galería',
    }
}

export default async function GalleryPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return <div>Institución no encontrada</div>;

    const { data: gallery } = await supabase
        .from('school_gallery')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false });

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
                            <div key={i} className="relative group overflow-hidden rounded-2xl aspect-square bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
                                <img
                                    src={img.image_url}
                                    alt={img.title || 'Foto Galería'}
                                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div>
                                        <p className="text-white text-sm font-bold">{img.title}</p>
                                        {img.category && <span className="text-[10px] text-white/80 uppercase tracking-widest bg-white/20 px-2 py-1 rounded mt-2 inline-block">{img.category}</span>}
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
        </div>
    );
}
