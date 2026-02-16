"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function SaaSNavbar() {
    const pathname = usePathname();
    const [isColegiosOpen, setIsColegiosOpen] = useState(false);

    const isActive = (path) => pathname === path ? "text-purple-400 font-bold" : "text-slate-300 hover:text-white";

    return (
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-slate-950/60">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-purple-900/20" />
                    <span className="font-black text-xl tracking-tight hidden sm:block text-white">Gestor Educativo 365</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={`text-sm transition-colors ${isActive('/')}`}>Inicio</Link>
                    <Link href="/precios" className={`text-sm transition-colors ${isActive('/precios')}`}>Precios</Link>
                    <Link href="/nosotros" className={`text-sm transition-colors ${isActive('/nosotros')}`}>Nosotros</Link>

                    {/* Dropdown Colegios */}
                    <div className="relative group">
                        <button
                            onMouseEnter={() => setIsColegiosOpen(true)}
                            onMouseLeave={() => setIsColegiosOpen(false)}
                            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 py-2"
                        >
                            Colegios <ChevronDown size={14} className={`transform transition-transform ${isColegiosOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div
                            onMouseEnter={() => setIsColegiosOpen(true)}
                            onMouseLeave={() => setIsColegiosOpen(false)}
                            className={`absolute left-0 top-full pt-2 w-56 transition-all duration-200 ${isColegiosOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                        >
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                                <Link
                                    href="/latinoamericano"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group/item"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-xs group-hover/item:scale-110 transition-transform">
                                        CL
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold leading-none mb-1">C. Latinoamericano</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Villavicencio, Meta</p>
                                    </div>
                                </Link>
                                <div className="border-t border-slate-800 my-2 mx-2"></div>
                                <div className="px-4 py-2">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Más instituciones próximamente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth" className="text-sm font-bold text-white hover:text-purple-400 transition-colors">Ingresar</Link>
                    <a
                        href="https://wa.me/573045788873?text=Hola,%20me%20interesa%20Gestor%20Educativo%20365"
                        target="_blank"
                        className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-black hover:bg-green-400 hover:text-white transition-all hover:scale-105 shadow-lg shadow-white/10"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </nav>
    );
}
