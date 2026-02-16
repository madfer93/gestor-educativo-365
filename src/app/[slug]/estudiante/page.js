"use client";
import { mockData } from "@/data/mockData";
import AdmissionsChecklist from "@/components/AdmissionsChecklist";
import WompiWidget from "@/components/WompiWidget";
import ChatIA from "@/components/ChatIA";
import AssignmentsModule from "@/components/AssignmentsModule";
import { LogOut, User, CreditCard, FileCheck } from "lucide-react";
import WellbeingModule from "@/components/WellbeingModule";

export default function StudentDashboard() {
    const { estudiante, colegio } = mockData;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-[#002855] text-white sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={colegio.logoSolo} alt="Logo" className="w-10 h-10 brightness-0 invert" />
                        <div>
                            <h1 className="text-lg font-black leading-tight tracking-tighter">LATINOAMERICANO</h1>
                            <p className="text-[10px] text-[#E91E63] font-bold tracking-widest uppercase">Portal Estudiante</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-bold">
                        <span className="hidden sm:inline">{estudiante.nombre}</span>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <User size={18} />
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container mx-auto p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">¡Hola, {estudiante.nombre}!</h2>
                        <p className="text-gray-500 font-medium">Proceso de Admisión • Grado {estudiante.grado} • 2026</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">Pendiente Documentos</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-[#002855] rounded-2xl flex items-center justify-center font-black">
                                    <FileCheck size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-[#002855]">Requisitos de Ingreso</h3>
                            </div>
                            <AdmissionsChecklist initialRequirements={estudiante.estadoAdmision.checklist} />
                        </div>
                        <AssignmentsModule assignments={estudiante.tareas} />
                        <div className="mt-8">
                            <WellbeingModule />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 border-t-8 border-t-[#E91E63] relative">
                            <h3 className="text-xl font-black text-[#002855] mb-6">Estado Financiero</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                                    <span className="text-lg font-black text-[#002855]">Total a Pagar</span>
                                    <span className="text-2xl font-black text-[#E91E63]">$400.000</span>
                                </div>
                            </div>
                        </div>
                        <WompiWidget monto={400000} onSuccess={() => console.log("Pago verificado!")} />
                    </div>
                </div>
                <ChatIA />
            </main>
        </div>
    );
}
