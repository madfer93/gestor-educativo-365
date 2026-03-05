"use client";
import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, Lock, Facebook, Instagram, Youtube } from 'lucide-react';

const TikTokIcon = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const NAV_LINKS = [
    { href: 'institucion', label: '🏛️ Institución' },
    { href: 'docentes', label: '👨‍🏫 Docentes' },
    { href: 'galeria', label: '📸 Galería' },
    { href: 'noticias', label: '📰 Noticias' },
    { href: 'costos', label: '📊 Costos' },
    { href: 'pagos', label: '💳 Pagos' },
    { href: 'contacto', label: '📞 Contacto' },
];

export default function SchoolNavbar({ schoolName, logoUrl, brandingColors, slug, socialLinks }) {
    const [isOpen, setIsOpen] = useState(false);

    // Default colors if not provided
    const primary = brandingColors?.primary || '#0f172a'; // Default slate-900
    const secondary = brandingColors?.secondary || '#2563eb'; // Default blue-600

    return (
        <nav className="border-b border-white/10 sticky top-0 z-50 shadow-2xl transition-colors duration-300" style={{ backgroundColor: primary }}>
            {/* Top Bar - Contacto y Redes */}
            <div className="text-white/80 py-2 px-6 text-[10px] flex justify-between items-center border-b border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="flex gap-4 items-center">
                    <a href="tel:+573212808022" className="hover:text-white transition-colors">📞 321 280 8022</a>
                    <a href="https://maps.app.goo.gl/cjzBgYGZxi5bfS8k7" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-white transition-colors">📍 Villavicencio, Meta</a>
                    {/* Social Links In Top Bar */}
                    {socialLinks && (
                        <div className="hidden md:flex items-center gap-3 border-l border-white/10 ml-4 pl-4">
                            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Facebook size={12} /></a>}
                            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Instagram size={12} /></a>}
                            {socialLinks.tiktok && <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white"><TikTokIcon size={12} /></a>}
                            {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Youtube size={12} /></a>}
                        </div>
                    )}
                </div>
                <div className="flex gap-4 font-bold uppercase tracking-wider">
                    <a href={`/${slug}/contacto`} className="hover:text-white transition-colors">Contáctenos</a>
                    <a href={`/${slug}/login`} className="hover:text-white transition-colors flex items-center gap-1">
                        <User size={12} /> Acceso Administrativo
                    </a>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                {/* Logo Area */}
                <a href={`/${slug}`} className="flex items-center gap-3 md:gap-4 group shrink-0">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full p-1 md:p-1.5 shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/20">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-blue-900 text-2xl md:text-3xl">L</div>
                        )}
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-white font-black text-base md:text-xl lg:text-3xl uppercase tracking-tighter transition-opacity opacity-90 group-hover:opacity-100 drop-shadow-md">
                            {schoolName || "Colegio Latinoamericano"}
                        </h1>
                    </div>
                </a>

                {/* Desktop Quick Nav */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                    {NAV_LINKS.map((link) => (
                        <a key={link.href} href={`/${slug}/${link.href}`} className="text-white/80 hover:text-white font-bold text-[10px] xl:text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 whitespace-nowrap">
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop Login Button */}
                <div className="hidden lg:block shrink-0 ml-4">
                    <a href={`/${slug}/login`}
                        className="text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all hover:scale-105 hover:brightness-110"
                        style={{ backgroundColor: secondary }}
                    >
                        <Lock size={14} /> Portal Académico
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Desktop Grade Bar with Dropdowns - Estilo blog original */}
            <div className="hidden lg:block border-t border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                <div className="container mx-auto px-6 flex items-center justify-center gap-0">
                    {[
                        { label: 'PREESCOLAR-PRIMARIA', items: ['Prejardín', 'Transición', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto'] },
                        { label: 'SEXTO', items: ['Horario', 'Docentes', 'Guías'] },
                        { label: 'SÉPTIMO', items: ['Horario', 'Docentes', 'Guías'] },
                        { label: 'OCTAVO', items: ['Horario', 'Docentes', 'Guías'] },
                        { label: 'NOVENO', items: ['Horario', 'Docentes', 'Guías'] },
                        { label: 'DÉCIMO', items: ['Horario', 'Docentes', 'Guías'] },
                        { label: 'ONCE', items: ['Horario', 'Docentes', 'Guías'] },
                    ].map((g) => (
                        <div key={g.label} className="relative group">
                            <button className="flex items-center gap-1 text-white/80 hover:text-white hover:bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors">
                                {g.label} <ChevronDown size={10} className="opacity-60" />
                            </button>
                            <div className="absolute top-full left-0 min-w-[180px] bg-white rounded-b-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                                {g.items.map((item) => (
                                    <a key={item} href="#" className="block px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl uppercase tracking-wider">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] border-t border-white/10' : 'max-h-0'}`} style={{ backgroundColor: primary }}>
                <div className="container mx-auto px-4 py-4">
                    <ul className="space-y-1">
                        <li>
                            <a href={`/${slug}`} className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-bold text-sm uppercase tracking-wider">
                                🏠 Home
                            </a>
                        </li>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a href={`/${slug}/${link.href}`} className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-bold text-sm uppercase tracking-wider">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="pt-3 border-t border-white/10 mt-3">
                            <a href={`/${slug}/login`}
                                className="flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                style={{ backgroundColor: secondary }}
                            >
                                <Lock size={14} /> Portal Académico
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
