import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock, Shield, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const TikTokIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const WhatsAppIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function SchoolFooter({ school, slug }) {
    if (!school) return null;

    const branding = school.branding_colors || { primary: '#0f172a', secondary: '#1e3a8a' };

    return (
        <footer className="text-white" style={{ backgroundColor: '#0f172a' }}>
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 pt-16 pb-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">

                    {/* Col 1: Institución */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-white w-10 h-10 rounded-xl p-1.5 flex items-center justify-center shadow-lg">
                                <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-wide" style={{ color: '#94a3b8' }}>
                                {school.nombre}
                            </h3>
                        </div>
                        {school.slogan && (
                            <p className="text-white/50 text-xs font-medium leading-relaxed mb-5 italic">
                                "{school.slogan}"
                            </p>
                        )}
                        <p className="text-white/40 text-xs font-medium leading-relaxed mb-5">
                            {school.direccion || 'Villavicencio, Meta, Colombia'}
                        </p>
                        <a
                            href="https://wa.me/573212808022?text=Hola, necesito información"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-green-600/20"
                        >
                            <WhatsAppIcon size={16} /> WhatsApp
                        </a>
                    </div>

                    {/* Col 2: Contacto */}
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">Contacto</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href={`tel:+57${(school.telefono || '3212808022').replace(/\s/g, '')}`} className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                                    <Phone size={14} className="mt-0.5 shrink-0 group-hover:text-green-400" />
                                    <span className="text-xs font-bold">{school.telefono || '321 280 8022'}</span>
                                </a>
                            </li>
                            {school.telefono_secundario && (
                                <li>
                                    <a href={`tel:+57${school.telefono_secundario.replace(/\s/g, '')}`} className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                                        <Phone size={14} className="mt-0.5 shrink-0 group-hover:text-green-400" />
                                        <span className="text-xs font-bold">{school.telefono_secundario}</span>
                                    </a>
                                </li>
                            )}
                            {school.correo_institucional && (
                                <li>
                                    <a href={`mailto:${school.correo_institucional}`} className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                                        <Mail size={14} className="mt-0.5 shrink-0 group-hover:text-blue-400" />
                                        <span className="text-xs font-bold break-all">{school.correo_institucional}</span>
                                    </a>
                                </li>
                            )}
                            <li className="flex items-start gap-3 text-white/40">
                                <MapPin size={14} className="mt-0.5 shrink-0" />
                                <span className="text-xs font-medium">{school.direccion || 'Villavicencio, Meta'}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Síguenos */}
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">Síguenos</h4>
                        <ul className="space-y-4">
                            {school.facebook_url && (
                                <li>
                                    <a href={school.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                                        <Facebook size={16} className="group-hover:text-blue-400" />
                                        <span className="text-xs font-bold">Facebook</span>
                                    </a>
                                </li>
                            )}
                            {school.instagram_url && (
                                <li>
                                    <a href={school.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                                        <Instagram size={16} className="group-hover:text-pink-400" />
                                        <span className="text-xs font-bold">Instagram</span>
                                    </a>
                                </li>
                            )}
                            {school.tiktok_url && (
                                <li>
                                    <a href={school.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                                        <TikTokIcon size={16} />
                                        <span className="text-xs font-bold">TikTok</span>
                                    </a>
                                </li>
                            )}
                            {school.youtube_url && (
                                <li>
                                    <a href={school.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                                        <Youtube size={16} className="group-hover:text-red-400" />
                                        <span className="text-xs font-bold">YouTube</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Col 4: Legal */}
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href={`/${slug}/legal?seccion=terminos`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/legal?seccion=privacidad`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/legal?seccion=habeas-data`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold">
                                    Habeas Data
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${slug}/legal?seccion=uso-imagen`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold">
                                    Uso de Imagen
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 5: Horarios */}
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">Horarios</h4>
                        <ul className="space-y-3">
                            {school.schedule_morning && (
                                <li className="flex items-start gap-2 text-white/50">
                                    <span className="text-xs">☀️</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Mañana</p>
                                        <p className="text-xs font-bold text-white/60">{school.schedule_morning}</p>
                                    </div>
                                </li>
                            )}
                            {school.schedule_afternoon && (
                                <li className="flex items-start gap-2 text-white/50">
                                    <span className="text-xs">🌅</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Tarde</p>
                                        <p className="text-xs font-bold text-white/60">{school.schedule_afternoon}</p>
                                    </div>
                                </li>
                            )}
                            {school.schedule_saturday && (
                                <li className="flex items-start gap-2 text-white/50">
                                    <span className="text-xs">📅</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Sabatina</p>
                                        <p className="text-xs font-bold text-white/60">{school.schedule_saturday}</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                        <div className="mt-6">
                            <Link
                                href={`/${slug}/pagos`}
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: branding.primary, color: 'white' }}
                            >
                                <ExternalLink size={12} /> Portal de Pagos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">
                        © {new Date().getFullYear()} {school.nombre} — Todos los derechos reservados
                    </p>
                    <p className="text-[10px] text-white/15 font-black uppercase tracking-[0.3em]">
                        Powered by Variedades JyM SaaS
                    </p>
                </div>
            </div>
        </footer>
    );
}
