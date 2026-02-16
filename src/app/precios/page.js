"use client";
import React from 'react';
import Link from 'next/link';
import { Check, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import SaaSNavbar from '@/components/SaaSNavbar';
import SalesChatBubble from '@/components/SalesChatBubble';

export default function PreciosPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <SaaSNavbar />

            {/* Header Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

                <div className="container mx-auto text-center max-w-4xl relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-[11px] font-bold uppercase tracking-widest mb-6">
                        Planes Flexibles 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        La mejor inversión para el <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">futuro de tu institución.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Sin costos ocultos. Sin complicaciones. Solo la tecnología que tu colegio necesita para brillar.
                    </p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="pb-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

                        {/* Plan Básico */}
                        <PricingCard
                            name="Escencial"
                            price="300.000"
                            desc="Ideal para colegios pequeños que inician su transformación digital."
                            features={[
                                "Hasta 200 estudiantes",
                                "Gestión Académica Básica",
                                "Boletines de Calificaciones",
                                "Soporte vía Email",
                                "App Básica Estudiantes"
                            ]}
                        />

                        {/* Plan Pro (Destacado) */}
                        <PricingCard
                            name="Institucional"
                            price="550.000"
                            desc="El plan más completo para instituciones en crecimiento y excelencia."
                            mostPopular={true}
                            features={[
                                "Estudiantes Ilimitados",
                                "Tesorería & Facturación Electrónica",
                                "Gestión de Matrículas Online",
                                "App Premium Padres y Alumnos",
                                "Soporte Prioritario 24/7",
                                "Integración con Wompi"
                            ]}
                            highlight={true}
                        />

                        {/* Plan Enterprise */}
                        <PricingCard
                            name="Personalizado"
                            price="Consultar"
                            desc="Soluciones a medida para corporaciones educativas masivas."
                            features={[
                                "Multi-Sede Centralizada",
                                "Desarrollo de Módulos a Medida",
                                "Capacitación Presencial",
                                "Manager de Cuenta Dedicado",
                                "API de Integración Abierta"
                            ]}
                            cta="Hablar con Ventas"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Pre-footer */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-12">Preguntas Frecuentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <FAQItem
                            q="¿Tienen cláusula de permanencia?"
                            a="No, puedes cancelar o cambiar de plan en cualquier momento sin penalizaciones."
                        />
                        <FAQItem
                            q="¿Cómo funciona la implementación?"
                            a="Nuestro equipo te acompaña en la migración de datos para que empieces en menos de 48 horas."
                        />
                        <FAQItem
                            q="¿El soporte técnico tiene costo?"
                            a="Todos nuestros planes incluyen soporte técnico especializado sin cargos adicionales."
                        />
                        <FAQItem
                            q="¿Es segura la información?"
                            a="Usamos infraestructura de nivel bancario con encriptación de datos y backups automáticos."
                        />
                    </div>
                </div>
            </section>

            <SalesChatBubble />

            <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-900">
                <p>© 2026 Gestor Educativo 365. Parte de Variedades JyM.</p>
            </footer>
        </div>
    );
}

function PricingCard({ name, price, desc, features, mostPopular, highlight, cta = "Comenzar Ahora" }) {
    return (
        <div className={`relative p-8 rounded-[32px] border transition-all duration-300 flex flex-col ${highlight
            ? 'bg-slate-900 border-purple-500 shadow-2xl shadow-purple-500/10 scale-105 z-10'
            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}>
            {mostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                    Recomendado
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black">${price}</span>
                    {price !== "Consultar" && <span className="text-slate-500 text-sm font-bold">/ mes</span>}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check size={18} className="text-purple-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <Link
                href="/auth"
                className={`w-full py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 ${highlight
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
            >
                {cta} <ArrowRight size={18} />
            </Link>
        </div>
    );
}

function FAQItem({ q, a }) {
    return (
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
            <h4 className="font-bold text-slate-100 mb-3">{q}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
        </div>
    );
}
