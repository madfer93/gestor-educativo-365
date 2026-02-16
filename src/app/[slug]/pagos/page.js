"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { CreditCard, ShieldCheck, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Info, Building2, Landmark, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function WompiPaymentPage({ params }) {
    const { slug } = params;
    const [school, setSchool] = useState(null);
    const [costs, setCosts] = useState([]);
    const [fetchingSchool, setFetchingSchool] = useState(true);
    const [monto, setMonto] = useState("");
    const [concepto, setConcepto] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success
    const [paymentMethod, setPaymentMethod] = useState("online"); // online, manual

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        const fetchData = async () => {
            const { data: schoolData } = await supabase
                .from('schools')
                .select('*')
                .eq('slug', slug)
                .single();

            if (schoolData) {
                setSchool(schoolData);
                const { data: costsData } = await supabase
                    .from('school_costs')
                    .select('*')
                    .eq('school_id', schoolData.id)
                    .order('display_order', { ascending: true });

                if (costsData) {
                    setCosts(costsData);
                    // Set default concept and amount if available
                    if (costsData.length > 0) {
                        const firstCost = costsData[0];
                        setConcepto(firstCost.concept);
                        const numericValue = firstCost.value?.replace(/[^0-9]/g, '');
                        setMonto(numericValue || "");
                    } else {
                        setConcepto("Otros Conceptos");
                    }
                }
            }
            setFetchingSchool(false);
        };
        fetchData();
    }, [slug]);

    const handleConceptChange = (e) => {
        const newConcept = e.target.value;
        setConcepto(newConcept);

        const selectedCost = costs.find(c => c.concept === newConcept);
        if (selectedCost) {
            const numericValue = selectedCost.value?.replace(/[^0-9]/g, '');
            setMonto(numericValue || "");
        }
    };

    const handlePay = (e) => {
        e.preventDefault();
        if (!monto || monto <= 0) return alert("Por favor ingresa un monto válido");

        if (school.wompi_url) {
            // Redirección real a Wompi
            window.open(school.wompi_url, '_blank');
            return;
        }

        setStatus("loading");
        // Simulación si no hay URL real
        setTimeout(() => {
            setStatus("success");
        }, 3000);
    };

    if (fetchingSchool) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-institutional-blue" size={48} />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <h1 className="text-2xl font-black text-slate-800">Institución no encontrada</h1>
                <Link href="/" className="mt-8 text-blue-600 hover:underline">Ir al Inicio</Link>
            </div>
        );
    }

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#be185d' };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header / Banner */}
            <div className="text-white py-12 md:py-20 text-center relative overflow-hidden" style={{ backgroundColor: branding.primary }}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors mb-8">
                        <ArrowLeft size={16} /> Volver al Colegio
                    </Link>
                    <div className="bg-white w-20 h-20 rounded-2xl p-3 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                        <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Pagos Institucionales</h1>
                    <p className="text-white/70 font-medium max-w-lg mx-auto italic">
                        Selecciona tu método preferido y realiza tus pagos de forma segura.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Payment Method Selector */}
                    <div className="flex p-2 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
                        <button
                            onClick={() => setPaymentMethod("online")}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'online' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <CreditCard size={18} /> Pago en Línea
                        </button>
                        <button
                            onClick={() => setPaymentMethod("manual")}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${paymentMethod === 'manual' ? 'bg-institutional-magenta text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Landmark size={18} /> Transferencia
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Main Payment Area */}
                        <div className="md:col-span-3">
                            {paymentMethod === 'online' ? (
                                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 h-full">
                                    {status === "success" ? (
                                        <div className="text-center py-12">
                                            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner">
                                                <CheckCircle2 size={48} />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-800 mb-4">¡Pago Exitoso!</h3>
                                            <p className="text-slate-500 font-medium mb-10">
                                                Hemos recibido tu pago por concepto de <span className="text-slate-800 font-bold">{concepto}</span> por un valor de <span className="text-slate-800 font-bold">${Number(monto).toLocaleString()}</span>.
                                            </p>
                                            <button
                                                onClick={() => setStatus("idle")}
                                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all w-full md:w-auto"
                                            >
                                                Realizar otro pago
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                                                <div className="bg-slate-100 p-3 rounded-2xl text-slate-400">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800">Pasarela Electrónica</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Powered by Wompi Colombia</p>
                                                </div>
                                            </div>

                                            <form onSubmit={handlePay} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Concepto de Pago</label>
                                                        <select
                                                            value={concepto}
                                                            onChange={handleConceptChange}
                                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 text-slate-800 font-bold focus:outline-none focus:border-institutional-blue transition-all"
                                                            style={{ focusBorderColor: branding.primary }}
                                                        >
                                                            {costs.length > 0 ? (
                                                                costs.map((c, i) => (
                                                                    <option key={i} value={c.concept}>{c.concept}</option>
                                                                ))
                                                            ) : (
                                                                <option>Otros Conceptos</option>
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Valor a Pagar (COP)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">$</span>
                                                            <input
                                                                type="number"
                                                                required
                                                                placeholder="0.00"
                                                                value={monto}
                                                                onChange={(e) => setMonto(e.target.value)}
                                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-10 pr-6 text-slate-800 font-bold focus:outline-none focus:border-institutional-blue transition-all font-mono text-xl"
                                                                style={{ focusBorderColor: branding.primary }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex gap-4">
                                                    <Info className="text-blue-500 shrink-0" size={20} />
                                                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                                        Los pagos por PSE y Tarjeta de Crédito se reflejan de inmediato en nuestro sistema.
                                                    </p>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={status === "loading"}
                                                    className="w-full bg-[#E4007C] text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                                                >
                                                    {status === "loading" ? (
                                                        <Loader2 className="animate-spin" size={24} />
                                                    ) : (
                                                        <>
                                                            {school.wompi_url ? 'Pagar con Wompi' : 'Abonar en Línea'} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 h-full space-y-10">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                        <div className="bg-magenta-50 p-3 rounded-2xl text-institutional-magenta">
                                            <Landmark size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">Transferencia Bancaria</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Datos de Cuenta Oficiales</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Soporte para el nuevo formato dinámico o el viejo estático */}
                                        {school.bank_accounts && school.bank_accounts.length > 0 ? (
                                            school.bank_accounts.map((acc, idx) => (
                                                <div key={idx} className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-institutional-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                                    <div className="relative z-10 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opción de Pago #{idx + 1}</span>
                                                            <span className="bg-white text-institutional-blue px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-50 tracking-tighter shadow-sm">{acc.tipo}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{acc.nombre}</p>
                                                            <p className="text-4xl font-black text-slate-800 font-mono tracking-tighter">{acc.numero}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : school.bank_info?.bank1?.numero ? (
                                            <>
                                                <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-institutional-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                                    <div className="relative z-10 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuenta Principal</span>
                                                            <span className="bg-white text-institutional-blue px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-50 tracking-tighter shadow-sm">{school.bank_info.bank1.tipo}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{school.bank_info.bank1.nombre}</p>
                                                            <p className="text-4xl font-black text-slate-800 font-mono tracking-tighter">{school.bank_info.bank1.numero}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {school.bank_info?.bank2?.numero && (
                                                    <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-institutional-magenta/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                                        <div className="relative z-10 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billetera Digital</span>
                                                                <Smartphone size={16} className="text-institutional-magenta" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-institutional-magenta uppercase tracking-widest mb-1">{school.bank_info.bank2.nombre}</p>
                                                                <p className="text-4xl font-black text-slate-800 font-mono tracking-tighter">{school.bank_info.bank2.numero}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="p-10 text-center text-slate-400 bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200 uppercase font-black text-xs tracking-widest">
                                                Cuentas Bancarias no configuradas
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
                                        <Info className="text-amber-600 shrink-0" size={20} />
                                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                            Una vez realizada la transferencia, es **obligatorio** enviar el comprobante via WhatsApp a la secretaría del colegio para legalizar tu pago.
                                        </p>
                                    </div>

                                    <a
                                        href={`https://wa.me/57${school.telefono?.replace(/\s/g, "")}?text=Hola, envío soporte de pago realizado por transferencia.`}
                                        target="_blank"
                                        className="w-full bg-green-500 text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] hover:bg-green-600 active:scale-[0.98]"
                                    >
                                        <Smartphone size={24} /> Enviar Soporte WhatsApp
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Resumen */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Cuentas Bancarias Sidebar */}
                            {((school.bank_accounts && school.bank_accounts.length > 0) || (school.bank_info?.bank1?.numero)) && (
                                <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 space-y-6">
                                    <h4 className="font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Transferencia Directa</h4>

                                    {school.bank_accounts && school.bank_accounts.length > 0 ? (
                                        school.bank_accounts.slice(0, 3).map((acc, idx) => (
                                            <div key={idx} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-3 text-institutional-blue">
                                                    <Landmark size={20} />
                                                    <p className="font-black text-sm uppercase">{acc.nombre}</p>
                                                </div>
                                                <div className="space-y-1 pl-8">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Número de Cuenta ({acc.tipo})</p>
                                                    <p className="text-lg font-black text-slate-800 font-mono tracking-tighter">{acc.numero}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {school.bank_info?.bank1?.numero && (
                                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-3 text-institutional-blue">
                                                        <Landmark size={20} />
                                                        <p className="font-black text-sm uppercase">{school.bank_info.bank1.nombre}</p>
                                                    </div>
                                                    <div className="space-y-1 pl-8">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Número de Cuenta ({school.bank_info.bank1.tipo})</p>
                                                        <p className="text-lg font-black text-slate-800 font-mono tracking-tighter">{school.bank_info.bank1.numero}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {school.bank_info?.bank2?.numero && (
                                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-3 text-institutional-magenta">
                                                        <Smartphone size={20} />
                                                        <p className="font-black text-sm uppercase">{school.bank_info.bank2.nombre}</p>
                                                    </div>
                                                    <div className="space-y-1 pl-8">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Número o Celular</p>
                                                        <p className="text-lg font-black text-slate-800 font-mono tracking-tighter">{school.bank_info.bank2.numero}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <p className="text-[10px] text-slate-400 font-medium text-center italic">
                                        Favor enviar el soporte de transferencia al WhatsApp de secretaría.
                                    </p>
                                </div>
                            )}

                            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
                                <h4 className="font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Resumen</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">Institución</span>
                                        <span className="text-slate-800 font-black">{school.nombre}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">Convenio</span>
                                        <span className="text-slate-800 font-black tracking-widest">WOMPI-8822</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">Concepto</span>
                                        <span className="text-slate-800 font-black">{concepto}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white">
                                <Building2 className="text-purple-400 mb-6" size={32} />
                                <h4 className="font-black uppercase tracking-widest mb-2">Soporte</h4>
                                <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                                    Si tienes problemas con tu pago, por favor contáctanos con el comprobante de la transacción.
                                </p>
                                <a
                                    href={`https://wa.me/57${school.telefono?.replace(/\s/g, "")}`}
                                    target="_blank"
                                    className="block w-full bg-white text-slate-950 text-center py-3 rounded-xl font-bold hover:bg-green-400 hover:text-white transition-all text-sm uppercase tracking-widest"
                                >
                                    Contactar Secretaría
                                </a>
                            </div>

                            <div className="flex justify-center gap-8 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all px-4 items-center">
                                {/* PSE SVG Directo (100% Estable) */}
                                <svg className="h-10 w-auto" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="50" cy="30" rx="45" ry="25" fill="#005EE5" />
                                    <text x="50" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="black" fill="white" textAnchor="middle">PSE</text>
                                </svg>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" className="h-8 object-contain" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" className="h-6 object-contain" alt="Visa" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Security Note */}
                <div className="container mx-auto px-6 mt-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                        <ShieldCheck size={14} /> Transacciones Encriptadas con Seguridad Bancaria
                    </div>
                </div>
            </div>
        </div>
    );
}
