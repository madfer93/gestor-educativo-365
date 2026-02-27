"use client";
import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, Lock, Facebook, Instagram, Youtube } from 'lucide-react';

const TikTokIcon = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const MENU_ITEMS = [
    {
        title: "PREESCOLAR-PRIMARIA",
        items: ["Prejardín", "Transición", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto"]
    },
    {
        title: "SEXTO",
        items: ["Biología", "Empresarial", "Química", "Inglés", "Ética y Religión", "Comportamiento", "Sociales", "Contabilidad", "Español", "Matemáticas", "Sistemas"]
    },
    {
        title: "SÉPTIMO",
        items: ["Biología", "Empresarial", "Química", "Inglés", "Ética y Religión", "Comportamiento", "Sociales", "Contabilidad", "Español", "Matemáticas", "Sistemas"]
    },
    {
        title: "OCTAVO",
        items: ["Biología", "Empresarial", "Química", "Inglés", "Sociales", "Español", "Matemáticas", "Sistemas"]
    },
    {
        title: "NOVENO",
        items: ["Biología", "Química", "Física", "Español", "Matemáticas", "Sistemas"]
    },
    {
        title: "DÉCIMO",
        items: ["Física", "Química", "Filosofía", "Matemáticas", "Sistemas"]
    },
    {
        title: "ONCE",
        items: ["Física", "Química", "Filosofía", "Matemáticas", "Sistemas"]
    }
];

export default function SchoolNavbar({ schoolName, logoUrl, brandingColors, slug, socialLinks }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Default colors if not provided
    const primary = brandingColors?.primary || '#0f172a'; // Default slate-900
    const secondary = brandingColors?.secondary || '#2563eb'; // Default blue-600

    return (
        <nav className="border-b border-white/10 sticky top-0 z-50 shadow-2xl transition-colors duration-300" style={{ backgroundColor: primary }}>
            {/* Top Bar - Contacto y Redes */}
            <div className="text-white/80 py-2 px-6 text-[10px] flex justify-between items-center border-b border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="flex gap-4 items-center">
                    <span>📞 313 411 1666</span>
                    <span className="hidden sm:inline">📍 Villavicencio, Meta</span>
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
                    <a href="#contact" className="hover:text-white transition-colors">Contáctenos</a>
                    <a href={`/${slug}/login`} className="hover:text-white transition-colors flex items-center gap-1">
                        <User size={12} /> Acceso Administrativo
                    </a>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Area */}
                <a href={`/${slug}`} className="flex items-center gap-4 group">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain drop-shadow-xl transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-lg">L</div>
                    )}
                    <div className="leading-tight">
                        <h1 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter transition-opacity opacity-90 group-hover:opacity-100 drop-shadow-md">
                            {schoolName || "Colegio Latinoamericano"}
                        </h1>
                    </div>
                </a>

                {/* Desktop Quick Nav (Centered) - MOVED HERE */}
                <div className="hidden xl:flex items-center gap-6">
                    <a href={`/${slug}/institucion`} className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        🏛️ Institución
                    </a>
                    <a href={`/${slug}/docentes`} className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        👨‍🏫 Docentes
                    </a>
                    <a href={`/${slug}/galeria`} className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        📸 Galería
                    </a>
                    <a href={`/${slug}/noticias`} className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        📰 Noticias
                    </a>
                    <a href={`/${slug}/costos`} className="text-white/80 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        📊 Costos
                    </a>
                    <a href={`/${slug}/pagos`} className="text-white/80 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                        💳 Pagos
                    </a>
                </div>

                {/* Desktop Login Button (Acceso Principal) */}
                <div className="hidden lg:block">
                    <a href={`/${slug}/login`}
                        className="text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all hover:scale-105 hover:brightness-110"
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

            {/* Navigation Menus */}
            <div className={`lg:block ${isOpen ? 'block' : 'hidden'} border-t border-white/10`} style={{ backgroundColor: primary }}>



                <div className="container mx-auto">
                    <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center text-sm font-bold text-white/80">
                        <li className="border-b lg:border-none border-white/10">
                            <a href={`/${slug}`} className="block px-6 py-4 hover:bg-white/10 hover:text-white transition-colors">HOME</a>
                        </li>

                        {MENU_ITEMS.map((item, idx) => (
                            <li
                                key={idx}
                                className="relative group border-b lg:border-none border-white/10"
                                onMouseEnter={() => setActiveDropdown(idx)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    className={`w-full text-left flex items-center justify-between px-6 py-4 hover:bg-white/10 hover:text-white transition-colors uppercase gap-1
                                        ${activeDropdown === idx ? 'bg-white/10 text-white' : ''}
                                    `}
                                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                                >
                                    {item.title}
                                    <ChevronDown size={14} className={`transform transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                <div className={`
                                    lg:absolute lg:left-0 lg:top-full lg:w-56 shadow-xl lg:rounded-b-xl overflow-hidden transition-all duration-200 z-50
                                    ${activeDropdown === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:hidden'}
                                `}
                                    style={{ backgroundColor: primary }}
                                >
                                    <ul className="py-2">
                                        {item.items.map((subItem, sIdx) => (
                                            <li key={sIdx}>
                                                <a href="#" className="block px-6 py-2.5 text-xs uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors border-l-2 border-transparent"
                                                    style={{ borderColor: 'transparent' }}
                                                    onMouseEnter={(e) => e.target.style.borderColor = secondary}
                                                    onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                                                >
                                                    {subItem}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav >
    );
}
