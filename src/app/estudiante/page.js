"use client";
import { mockData } from "@/data/mockData";
import AdmissionsChecklist from "@/components/AdmissionsChecklist";
import WompiWidget from "@/components/WompiWidget";
import ChatIA from "@/components/ChatIA";
import AssignmentsModule from "@/components/AssignmentsModule";
import { LogOut, User, CreditCard, FileCheck } from "lucide-react";

export default function StudentDashboard() {
    const { estudiante, colegio } = mockData;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-institutional-blue text-white sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={colegio.logoSolo} alt="Logo" className="w-10 h-10 brightness-0 invert" />
                        <div>
                            <h1 className="text-lg font-black leading-tight tracking-tighter">
                                LATINOAMERICANO
                            </h1>
                            <p className="text-[10px] text-institutional-magenta font-bold tracking-widest uppercase">
                                Portal Estudiante
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-sm font-bold border-b-2 border-institutional-magenta pb-1">Mi Admisión</a>
                        <a href="#" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Pagos</a>
                        <a href="#" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Certificados</a>
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

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">¡Hola, {estudiante.nombre}!</h2>
                        <p className="text-gray-500 font-medium">Proceso de Admisión • Grado {estudiante.grado} • 2026</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">Pendiente Documentos</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checklist ocupa 2 columnas en pantallas grandes */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-institutional-blue rounded-2xl flex items-center justify-center font-black">
                                    <FileCheck size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-institutional-blue">Requisitos de Ingreso</h3>
                            </div>
                            <AdmissionsChecklist initialRequirements={estudiante.estadoAdmision.checklist} />
                        </div>

                        <AssignmentsModule assignments={estudiante.tareas} />
                    </div>

                    {/* Pagos ocupa 1 columna */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 border-t-8 border-t-institutional-magenta overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <CreditCard size={120} />
                            </div>
                            <h3 className="text-xl font-black text-institutional-blue mb-6">Estado Financiero</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Concepto</span>
                                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Valor</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Matrícula {estudiante.grado}</span>
                                    <span className="font-bold text-gray-900">${colegio.costos2026.bachillerato.matricula.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Seguro Estudiantil</span>
                                    <span className="font-bold text-gray-900">${colegio.costos2026.seguroEstudiantil.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Asopadres</span>
                                    <span className="font-bold text-gray-900">${colegio.costos2026.bachillerato.asopadres.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-institutional-blue">Total a Pagar</span>
                                        <span className="text-2xl font-black text-institutional-magenta">$400.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <WompiWidget monto={400000} onnSuccess={() => console.log("Pago verificado!")} />
                    </div>
                </div>

                <ChatIA />
            </main>
        </div>
    );
}
