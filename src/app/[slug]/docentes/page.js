import { createClient } from '@/utils/supabase/server';
import TeachersList from "@/components/TeachersList";

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();
    return {
        title: school ? `Docentes - ${school.nombre}` : 'Docentes',
    }
}

export default async function TeachersPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return <div>Institución no encontrada</div>;

    const { data: teachers } = await supabase
        .from('profiles')
        .select('*')
        .eq('school_id', school.id)
        .neq('rol', 'student');

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="bg-slate-50 font-sans min-h-screen">
            <div className="container mx-auto px-6 py-20">
                <div className="mb-16">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Cuerpo Académico</span>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter">
                        Nuestro Equipo Docente
                    </h1>
                </div>

                {teachers && teachers.length > 0 ? (
                    <TeachersList teachers={teachers} branding={branding} />
                ) : (
                    <div className="text-center py-24 bg-white rounded-[40px] border-dashed border-2 border-slate-200">
                        <div className="mb-4 text-5xl opacity-20">👨‍🏫</div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">El directorio de docentes se está actualizando.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
