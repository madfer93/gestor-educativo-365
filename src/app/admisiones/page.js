"use client";
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Upload, User, Phone, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdmisionesPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        acudiente: '',
        telefono: '',
        grado: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        nombre: formData.nombre,
                        acudiente: formData.acudiente,
                        telefono: formData.telefono,
                        grado: formData.grado,
                        estado: 'Pendiente'
                    }
                ]);

            if (error) throw error;
            setStep(2);
        } catch (error) {
            alert('Error enviando solicitud: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Simple */}
            <header className="bg-white py-4 px-6 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-black text-institutional-blue tracking-tighter text-xl">
                        COLEGIO LATINOAMERICANO
                    </span>
                </div>
                <a href="/" className="text-sm font-bold text-gray-500 hover:text-institutional-blue">
                    Volver al Inicio
                </a>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-institutional-blue mb-4 tracking-tight">
                        Admisiones 2026
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        ¡Únete a nuestra familia! El primer paso hacia la excelencia.
                    </p>
                </div>

                {step === 1 && (
                    <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12">
                        <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                            <User className="text-institutional-magenta" size={28} />
                            Pre-Inscripción de Aspirante
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre del Aspirante</label>
                                    <input
                                        name="nombre"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                        placeholder="Ej. Juanito Pérez"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Grado de Interés</label>
                                    <select
                                        name="grado"
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                    >
                                        <option value="">Seleccionar Grado...</option>
                                        <option value="Pre-jardín">Pre-jardín</option>
                                        <option value="Jardín">Jardín</option>
                                        <option value="Transición">Transición</option>
                                        <option value="Primaria">Primaria (1° - 5°)</option>
                                        <option value="Bachillerato">Bachillerato (6° - 11°)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre del Acudiente</label>
                                    <input
                                        name="acudiente"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                        placeholder="Padre, Madre o Tutor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Teléfono de Contacto</label>
                                    <input
                                        name="telefono"
                                        onChange={handleChange}
                                        required
                                        type="tel"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                        placeholder="300 123 4567"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={loading} className="bg-institutional-blue text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-3 disabled:opacity-50 disabled:scale-100">
                                    {loading ? 'Enviando...' : 'Enviar Solicitud'} <ArrowRight />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white rounded-[40px] shadow-xl border border-green-100 p-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4">¡Solicitud Recibida!</h2>
                        <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto">
                            Gracias por tu interés en el Colegio Latinoamericano. La secretaría se pondrá en contacto contigo al número <strong>{formData.telefono}</strong> en breve.
                        </p>
                        <button onClick={() => setStep(1)} className="text-institutional-blue font-bold hover:underline">
                            Volver al inicio
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
