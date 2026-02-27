import { createClient } from '@/utils/supabase/server';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: news } = await supabase.from('school_news').select('title').eq('id', params.id).single();
    return {
        title: news?.title || 'Noticia Institucional',
    }
}

export default async function NewsDetailPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return <div>Institución no encontrada</div>;

    const { data: item } = await supabase
        .from('school_news')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!item) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-slate-800 mb-4">Noticia no encontrada</h1>
                    <Link href={`/${params.slug}/noticias`} className="text-blue-600 hover:underline inline-flex items-center gap-2">
                        <ArrowLeft size={16} /> Volver a Noticias
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header / Banner de la Noticia */}
            <div className="w-full h-64 md:h-96 bg-slate-800 relative">
                {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <Link href={`/${params.slug}/noticias`} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold mb-6 transition-colors">
                            <ArrowLeft size={16} /> Volver
                        </Link>
                        <div className="flex items-center gap-2 text-white/90 text-sm font-bold mb-3">
                            <Calendar size={16} />
                            {new Date(item.published_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl">
                            {item.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Contenido de la Noticia */}
            <div className="container mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-100">
                    <div className="prose prose-slate md:prose-lg max-w-none whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">
                        {item.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
