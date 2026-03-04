"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckSquare, PlusCircle, Users, Clock, FileText, BarChart2, Heart, UserCircle, Save, Loader2, Camera } from 'lucide-react';
import WellbeingModule from "@/components/WellbeingModule";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfesoresDashboard({ params }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setUserProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData(e.target);

        try {
            const updateData = {
                id: userProfile.id,
                public_bio: fd.get('public_bio') || null,
                facebook_url: fd.get('facebook_url') || null,
                instagram_url: fd.get('instagram_url') || null,
                linkedin_url: fd.get('linkedin_url') || null,
                twitter_url: fd.get('twitter_url') || null
            };

            const response = await fetch('/api/auth/manage-user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            alert('¡Perfil actualizado con éxito!');
            setUserProfile({ ...userProfile, ...updateData });
        } catch (error) {
            alert('Error al actualizar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="bg-white w-full md:w-20 lg:w-64 p-4 lg:p-6 border-r border-gray-100 flex flex-col items-center lg:items-start shrink-0">
                <div className="w-10 h-10 lg:w-auto lg:h-auto bg-institutional-blue text-white p-2 rounded-xl mb-10 flex items-center justify-center lg:justify-start gap-3">
                    <BookOpen size={24} />
                    <span className="hidden lg:inline font-black tracking-tighter">DOCENTE</span>
                </div>

                <nav className="space-y-4 w-full">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-institutional-blue text-white shadow-lg shadow-blue-500/20 font-bold' : 'text-gray-400 hover:bg-gray-100'}`}>
                        <BookOpen size={20} /> <span className="hidden lg:inline">Mis Cursos</span>
                    </button>
                    <button className="w-full text-gray-400 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors">
                        <CheckSquare size={20} /> <span className="hidden lg:inline font-bold">Calificaciones</span>
                    </button>
                    <button className="w-full text-gray-400 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors">
                        <Calendar size={20} /> <span className="hidden lg:inline font-bold">Calendario</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors ${activeTab === 'profile' ? 'bg-institutional-blue text-white shadow-lg shadow-blue-500/20 font-bold' : 'text-gray-400 hover:bg-gray-100'}`}>
                        <UserCircle size={20} /> <span className="hidden lg:inline font-bold">Mi Perfil</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-institutional-blue"><Loader2 className="animate-spin" size={40} /></div>
                ) : activeTab === 'dashboard' ? (
                    <>
                        {/* DASHBOARD TAB */}
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-gray-800">Hola, {userProfile?.nombre?.split(' ')[0] || 'Profesor'}</h1>
                                <p className="text-gray-400 font-medium">Tienes <strong className="text-institutional-magenta">3 entregas</strong> pendientes por revisar hoy.</p>
                            </div>
                            <button className="bg-institutional-magenta text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-magenta-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                                <PlusCircle size={20} /> Crear Tarea
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl"><BarChart2 size={24} /></div>
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Grado 11°</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-institutional-blue transition-colors">Matemáticas</h3>
                                <p className="text-gray-400 text-sm mb-6">Álgebra Lineal y Estadística</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold"><Users size={16} /> 24 Estudiantes</div>
                                    <div className="flex items-center gap-2 text-institutional-magenta text-xs font-black uppercase">Ver Aula <PlusCircle size={16} /></div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-green-50 text-green-500 p-3 rounded-2xl"><FileText size={24} /></div>
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Grado 10°</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-institutional-blue transition-colors">Física</h3>
                                <p className="text-gray-400 text-sm mb-6">Mecánica Clásica</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold"><Users size={16} /> 28 Estudiantes</div>
                                    <div className="flex items-center gap-2 text-institutional-magenta text-xs font-black uppercase">Ver Aula <PlusCircle size={16} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><Clock size={20} className="text-gray-400" /> Actividad Reciente</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between font-sans">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-institutional-magenta"></div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">Juan Pérez entregó "Taller Vectores"</p>
                                                <p className="text-xs text-gray-400">Hace {i * 5} minutos • Grado 11°</p>
                                            </div>
                                        </div>
                                        <button className="text-institutional-blue font-black text-xs hover:underline uppercase tracking-widest">Calificar</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12"><WellbeingModule /></div>
                    </>
                ) : activeTab === 'profile' ? (
                    <>
                        {/* PROFILE TAB */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-black text-gray-800">Mi Perfil Público</h1>
                            <p className="text-gray-400 font-medium">Actualiza tu información, foto y redes sociales que verán los estudiantes.</p>
                        </div>

                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
                            <form onSubmit={handleSaveProfile} className="space-y-10">
                                <div className="flex items-center gap-8 border-b border-gray-50 pb-8">
                                    <div className="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg relative group">
                                        {userProfile?.public_photo_url ? (
                                            <img src={userProfile.public_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><UserCircle size={40} /></div>
                                        )}
                                        {/* Future Feature: Profile photo upgrader implementation via Storage */}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-800">{userProfile?.nombre}</h3>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-full">{userProfile?.specialty || 'General'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-institutional-magenta flex items-center gap-2"><UserCircle size={16} /> Biografía Profesional</label>
                                    <textarea name="public_bio" defaultValue={userProfile?.public_bio} className="w-full bg-gray-50 border-none rounded-3xl p-6 font-medium text-gray-600 focus:ring-2 focus:ring-institutional-blue min-h-[150px]" placeholder="Escribe un breve resumen profesional sobre ti para presentarte ante los estudiantes..."></textarea>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest pt-6 border-t border-gray-100">Visibilidad de Redes Sociales</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Facebook URL</label>
                                            <input name="facebook_url" type="url" defaultValue={userProfile?.facebook_url} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 placeholder-gray-300" placeholder="https://facebook.com/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram URL</label>
                                            <input name="instagram_url" type="url" defaultValue={userProfile?.instagram_url} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 placeholder-gray-300" placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">LinkedIn URL</label>
                                            <input name="linkedin_url" type="url" defaultValue={userProfile?.linkedin_url} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 placeholder-gray-300" placeholder="https://linkedin.com/in/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Twitter / X URL</label>
                                            <input name="twitter_url" type="url" defaultValue={userProfile?.twitter_url} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 placeholder-gray-300" placeholder="https://x.com/..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8 border-t border-gray-100">
                                    <button type="submit" disabled={saving} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        {saving ? 'Guardando...' : 'Guardar Perfil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}
