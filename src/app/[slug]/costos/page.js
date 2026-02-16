import { createClient } from '@/utils/supabase/server';
import { Check, Info, FileText, Star, DollarSign } from 'lucide-react';

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
    return {
        title: school ? `Costos y Admisiones - ${school.nombre}` : 'Costos',
    }
}

export default async function CostsPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return <div>Institución no encontrada</div>;

    const { data: costs } = await supabase
        .from('school_costs')
        .select('*')
        .eq('school_id', school.id)
        .order('display_order', { ascending: true });

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    // Organize Data
    const tarifas = costs?.filter(c => c.category?.startsWith('Tarifas')) || [];
    const otros = costs?.filter(c => c.category === 'Otros') || [];
    const requisitos = costs?.filter(c => c.category === 'Requisitos') || [];
    const actividades = costs?.filter(c => c.category === 'Actividades') || [];

    // Group items by their specific sub-category
    const groupedTarifas = tarifas.reduce((acc, item) => {
        const cat = item.category.split(': ')[1] || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="container mx-auto px-6 py-12 space-y-20">

                {/* Header Section */}
                <div className="text-center space-y-6">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest animate-fade-in">
                        Proceso de Matrículas 2026
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Invierte en su <span className="text-institutional-magenta italic">Futuro</span>
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 uppercase text-[10px] font-black tracking-widest mt-8">
                        <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full shadow-lg">Jornada Mañana</span>
                        <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full shadow-lg">Jornada Tarde</span>
                        <span className="bg-institutional-magenta text-white px-4 py-1.5 rounded-full shadow-lg">Jornada Continua</span>
                        <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full shadow-lg">Sabatina</span>
                    </div>
                </div>

                {/* TARIFAS Section: Grid dinámico de niveles */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-10 bg-institutional-blue rounded-full"></span>
                            Costos Académicos
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(groupedTarifas).map(([nivel, items]) => {
                            const isContinua = nivel.includes('Continua');
                            return (
                                <div key={nivel} className={`group bg-white rounded-[40px] shadow-sm border-2 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 relative ${isContinua ? 'border-institutional-magenta/30 lg:scale-105 z-10 bg-gradient-to-b from-white to-magenta-50/10' : 'border-slate-100'}`}>
                                    {isContinua && (
                                        <div className="absolute top-4 right-4 bg-institutional-magenta text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                                            Altamente Recomendado
                                        </div>
                                    )}
                                    <div className="py-8 px-6 text-center font-black uppercase tracking-widest text-white shadow-md relative" style={{ backgroundColor: isContinua ? '#be185d' : branding.primary }}>
                                        <span className="text-sm block opacity-70 mb-1">PROGRAMA</span>
                                        <h3 className="text-xl leading-tight">{nivel}</h3>
                                    </div>
                                    <div className="p-10 space-y-8">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                                                <div>
                                                    <span className="font-black text-slate-800 text-base block tracking-tight leading-none mb-1">{item.concept}</span>
                                                    {item.description && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.description}</span>}
                                                </div>
                                                <div className="text-right">
                                                    <span className={`block font-black text-2xl tracking-tighter ${isContinua ? 'text-institutional-magenta' : 'text-slate-900'}`}>{item.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* OTROS SERVICIOS & REQUISITOS Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* OTROS Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-institutional-magenta rounded-full"></span>
                            Servicios Complementarios
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {otros.map((item, i) => {
                                const isSpecial = item.concept.includes('Comedor') || item.concept.includes('Refrigerios');
                                return (
                                    <div key={i} className={`p-12 rounded-[50px] border-[6px] transition-all flex flex-col justify-between shadow-2xl group relative overflow-hidden ${isSpecial ? 'bg-slate-900 text-white border-institutional-magenta scale-105 z-20 shadow-magenta-500/20' : 'bg-white border-slate-100 text-slate-800 hover:border-institutional-blue/20'}`}>
                                        {isSpecial && (
                                            <div className="absolute top-0 right-0 bg-institutional-magenta text-[12px] font-black px-8 py-3 uppercase tracking-[0.2em] rounded-bl-[35px] shadow-xl animate-pulse">
                                                🚨 NIVEL PREESCOLAR
                                            </div>
                                        )}
                                        <div className="flex items-center gap-8 mb-10">
                                            <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all ${isSpecial ? 'bg-institutional-magenta text-white scale-110 shadow-2xl shadow-magenta-500/40' : 'bg-slate-50 text-slate-400 group-hover:bg-institutional-blue/10 group-hover:text-institutional-blue'}`}>
                                                <Info size={36} />
                                            </div>
                                            <div>
                                                <h4 className={`font-black uppercase text-2xl tracking-tight leading-none ${isSpecial ? 'text-white' : 'text-slate-800'}`}>{item.concept}</h4>
                                                {item.description && <p className={`text-sm font-bold uppercase tracking-wider mt-2 ${isSpecial ? 'text-institutional-magenta' : 'text-slate-400'}`}>{item.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-white/5 pt-8 gap-4">
                                            <div className="flex flex-col text-center sm:text-left">
                                                <span className={`text-xs font-black uppercase tracking-[0.3em] mb-1 ${isSpecial ? 'text-white/40' : 'text-slate-400'}`}>Inversión Mensual</span>
                                                {isSpecial && <span className="text-[10px] font-black text-institutional-magenta uppercase bg-white/5 px-4 py-1 rounded-full inline-block">Pre-jardín, Jardín, Transición</span>}
                                            </div>
                                            <p className={`text-5xl font-black tracking-tighter ${isSpecial ? 'text-white' : 'text-institutional-blue'}`}>{item.value}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* REQUISITOS Section */}
                    <aside className="space-y-8">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                            <FileText className="text-yellow-500" /> Requisitos
                        </h2>
                        <div className="bg-white p-10 rounded-[45px] shadow-sm border-2 border-slate-50">
                            <ul className="space-y-5">
                                {requisitos.map((req, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <div className="mt-0.5 bg-yellow-50 text-yellow-600 p-1.5 rounded-xl group-hover:bg-yellow-100 transition-colors">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <div>
                                            <span className="font-black text-slate-700 block text-xs uppercase tracking-tight">{req.concept}</span>
                                            {req.description && <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">{req.description}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>

                {/* ACTIVIDADES FOOTER */}
                <section className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-institutional-magenta/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-institutional-blue/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase tracking-tighter">
                                Mucho más que <br /> <span className="text-institutional-magenta underline decoration-white/20 underline-offset-8">Educación Académica</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {actividades.map((act, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
                                        <Star size={16} className="text-institutional-magenta" fill="currentColor" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{act.concept}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 backdrop-blur-xl text-center space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-widest text-institutional-magenta">Contacto Admisiones</h3>
                            <p className="text-4xl md:text-5xl font-black tracking-tighter">313 411 1666</p>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Villavicencio • Colegio Latinoamericano</p>
                            <button className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-institutional-magenta hover:text-white transition-all shadow-xl">
                                Iniciar Proceso por WhatsApp
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
