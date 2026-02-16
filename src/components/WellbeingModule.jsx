"use client";
import React, { useState } from 'react';
import { Heart, Send, AlertTriangle, FileText, X } from 'lucide-react';

export default function WellbeingModule() {
    const [isOpen, setIsOpen] = useState(false);
    const [reportType, setReportType] = useState(null);

    const handleSend = (e) => {
        e.preventDefault();
        alert("Reporte enviado exitosamente. Rectoría y Coordinación han sido notificadas.");
        setIsOpen(false);
        setReportType(null);
    };

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-pink-50 text-institutional-magenta rounded-2xl flex items-center justify-center font-black">
                    <Heart size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-800">Bienestar y Reportes</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Comunicación directa con coordinación</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => { setReportType('ausencia'); setIsOpen(true); }}
                    className="flex items-center gap-4 p-6 bg-blue-50/50 border border-blue-100 rounded-3xl hover:bg-blue-50 transition-all text-left"
                >
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 text-institutional-blue">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="font-black text-gray-800 text-sm">Reportar Ausencia</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase opacity-60 tracking-wider text-wrap">Envía excusas médicas o permisos</p>
                    </div>
                </button>

                <button
                    onClick={() => { setReportType('urgencia'); setIsOpen(true); }}
                    className="flex items-center gap-4 p-6 bg-red-50/50 border border-red-100 rounded-3xl hover:bg-red-50 transition-all text-left"
                >
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-red-100 text-red-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="font-black text-gray-800 text-sm">Reportar Urgencia</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase opacity-60 tracking-wider">Informa situaciones críticas</p>
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={24} className="text-gray-400" />
                        </button>

                        <h4 className="text-2xl font-black text-gray-800 mb-2">
                            {reportType === 'ausencia' ? 'Reportar Ausencia' : 'Reportar Urgencia'}
                        </h4>
                        <p className="text-gray-500 text-sm mb-8 font-medium">Este reporte será enviado de forma privada a Rectoría y Coordinación.</p>

                        <form onSubmit={handleSend} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Detalles de la situación</label>
                                <textarea
                                    required
                                    placeholder="Explica brevemente lo ocurrido..."
                                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 font-medium h-32 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>

                            {reportType === 'ausencia' && (
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Adjuntar Excusa/Documento</label>
                                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-institutional-blue file:text-white hover:file:bg-blue-600" />
                                </div>
                            )}

                            <button className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 ${reportType === 'ausencia' ? 'bg-institutional-blue' : 'bg-red-500 shadow-red-200'
                                }`}>
                                <Send size={18} /> Enviar Reporte Seguro
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
