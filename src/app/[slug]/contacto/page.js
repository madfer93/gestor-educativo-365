import { createClient } from '@/utils/supabase/server';
import { Phone, Mail, MapPin, Clock, Globe, Shield, FileText, Award } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import ChatIA from "@/components/ChatIA";

export default async function ContactoPage({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!school) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-bold">Institución no encontrada.</p>
            </div>
        );
    }

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#1e3a8a' };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <SchoolNavbar
                schoolName={school.nombre}
                logoUrl={school.logo_url}
                brandingColors={branding}
                slug={params.slug}
                socialLinks={{
                    facebook: school.facebook_url,
                    instagram: school.instagram_url,
                    tiktok: school.tiktok_url,
                    youtube: school.youtube_url
                }}
            />

            {/* Hero */}
            <div className="relative py-20 text-white text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${branding.primary}, ${branding.secondary || branding.primary}dd)` }}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0VjZINnYyaDI4djZoMloiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 px-6 py-2 rounded-full inline-block mb-6">Información de Contacto</span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">Contáctenos</h1>
                    <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
                        Estamos aquí para atenderte. Comunícate con nosotros por cualquiera de nuestros canales.
                    </p>
                </div>
            </div>

            {/* Contact Cards */}
            <div className="container mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Phone */}
                    <a href={`tel:+57${(school.telefono || '3212808022').replace(/\s/g, '')}`} className="bg-white p-8 rounded-[30px] shadow-xl shadow-black/5 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${branding.primary}15` }}>
                            <Phone size={24} style={{ color: branding.primary }} />
                        </div>
                        <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-2">Teléfono Principal</h3>
                        <p className="text-lg font-bold" style={{ color: branding.primary }}>{school.telefono || '321 280 8022'}</p>
                    </a>

                    {/* Secondary Phone / WhatsApp */}
                    <a href={`https://wa.me/57${(school.telefono_secundario || '3212808022').replace(/\s/g, '')}`} target="_blank" className="bg-white p-8 rounded-[30px] shadow-xl shadow-black/5 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </div>
                        <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-2">WhatsApp Secretaría</h3>
                        <p className="text-lg font-bold text-green-600">{school.telefono_secundario || '321 280 8022'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lun - Vie: 7:00 AM - 3:00 PM</p>
                    </a>

                    {/* Email */}
                    <a href={`mailto:${school.correo_institucional || 'info@colegiolatinoamericano.edu.co'}`} className="bg-white p-8 rounded-[30px] shadow-xl shadow-black/5 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Mail size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-2">Correo Electrónico</h3>
                        <p className="text-sm font-bold text-blue-600 break-all">{school.correo_institucional || 'info@colegiolatinoamericano.edu.co'}</p>
                    </a>

                    {/* Hours */}
                    <div className="bg-white p-8 rounded-[30px] shadow-xl shadow-black/5 border border-gray-100">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                            <Clock size={24} className="text-amber-600" />
                        </div>
                        <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-3">Horarios de Atención</h3>
                        <div className="space-y-2 text-sm font-bold text-gray-600">
                            {school.schedule_morning && <p>☀️ {school.schedule_morning}</p>}
                            {school.schedule_afternoon && <p>🌅 {school.schedule_afternoon}</p>}
                            {school.schedule_saturday && <p>📅 {school.schedule_saturday}</p>}
                            {!school.schedule_morning && !school.schedule_afternoon && <p>Lun - Vie: 7:00 AM - 3:00 PM</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Map + Info */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Map */}
                    <div className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                <MapPin size={24} style={{ color: branding.primary }} />
                                Ubicación
                            </h2>
                            <p className="text-gray-500 font-medium mt-2">{school.direccion || 'Villavicencio, Meta, Colombia'}</p>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d341.72275465491464!2d-73.61592952558351!3d4.133807653893291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3e2e7a566af2bf%3A0xab2a9e8adad4caa1!2sColegio%20Latinoamericano!5e0!3m2!1ses!2sco!4v1772476500345!5m2!1ses!2sco"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación del Colegio Latinoamericano"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <a
                                href="https://maps.app.goo.gl/cjzBgYGZxi5bfS8k7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                style={{ backgroundColor: branding.primary }}
                            >
                                <MapPin size={16} /> Abrir en Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-gray-100 p-10">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">Canales Directos</h2>
                            <div className="space-y-4">
                                <a
                                    href="https://wa.me/573229191905?text=Hola, necesito información sobre el Colegio Latinoamericano"
                                    target="_blank"
                                    className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <div>
                                        <span className="block text-lg font-black">Atención IA 24/7</span>
                                        <span className="text-white/80 text-xs font-bold">Respuesta inmediata por WhatsApp</span>
                                    </div>
                                </a>

                                <a
                                    href="https://wa.me/573212808022?text=Hola, necesito información del Colegio Latinoamericano"
                                    target="_blank"
                                    className="flex items-center gap-4 bg-[#25D366] text-white p-5 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-lg font-black">Secretaría</span>
                                        <span className="text-white/80 text-xs font-bold">Persona real — Lun a Vie 7:00 AM - 3:00 PM</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Legal Quick Links */}
                        <div className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-gray-100 p-10">
                            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                <Shield size={24} style={{ color: branding.primary }} />
                                Documentos Legales
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href={`/${params.slug}/legal?seccion=habeas-data`} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-colors group">
                                    <FileText size={18} className="text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-sm font-bold text-slate-600">Habeas Data</span>
                                </a>
                                <a href={`/${params.slug}/legal?seccion=privacidad`} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-colors group">
                                    <Shield size={18} className="text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-sm font-bold text-slate-600">Política de Privacidad</span>
                                </a>
                                <a href={`/${params.slug}/legal?seccion=uso-imagen`} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-colors group">
                                    <Globe size={18} className="text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-sm font-bold text-slate-600">Uso de Imagen</span>
                                </a>
                                <a href={`/${params.slug}/legal?seccion=terminos`} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-colors group">
                                    <FileText size={18} className="text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-sm font-bold text-slate-600">Términos y Condiciones</span>
                                </a>
                                <a href={`/${params.slug}/legal?seccion=certificados`} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-colors group sm:col-span-2">
                                    <Award size={18} className="text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-sm font-bold text-slate-600">Certificados y Resoluciones</span>
                                </a>
                            </div>
                        </div>

                        {/* Social Networks */}
                        <div className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-gray-100 p-10">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">Redes Sociales</h2>
                            <div className="flex flex-wrap gap-3">
                                {school.facebook_url && (
                                    <a href={school.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-600/20">
                                        Facebook
                                    </a>
                                )}
                                {school.instagram_url && (
                                    <a href={school.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                                        Instagram
                                    </a>
                                )}
                                {school.tiktok_url && (
                                    <a href={school.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                                        TikTok
                                    </a>
                                )}
                                {school.youtube_url && (
                                    <a href={school.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-600/20">
                                        YouTube
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                © {new Date().getFullYear()} {school.nombre} — Todos los derechos reservados
            </div>

            <ChatIA />
        </div>
    );
}
