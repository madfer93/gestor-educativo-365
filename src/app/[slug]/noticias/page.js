import { createClient } from '@/utils/supabase/server';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
    return {
        title: school ? `Noticias - ${school.nombre}` : 'Noticias',
    }
}

export default async function NewsPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return <div>Institución no encontrada</div>;

    const { data: news } = await supabase
        .from('school_news')
        .select('*')
        .eq('school_id', school.id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-200 pb-4">
                    📰 Actualidad Institucional
                </h1>

                {news && news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transform transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                                            <span className="text-4xl">📰</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2">
                                        <Calendar size={12} />
                                        {new Date(item.published_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                        {item.summary || item.content?.substring(0, 150) + '...'}
                                    </p>
                                    <Link href={`/${params.slug}/noticias/${item.id}`} className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline mt-auto">
                                        Leer más <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-dashed border-2 border-slate-200">
                        <div className="mb-4 text-5xl opacity-20">📰</div>
                        <p className="text-slate-400 font-medium">No hay noticias publicadas recientemente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
