"use client";
import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, CreditCard, Search, Filter, Download, PlusCircle, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function TesoreriaDashboard() {
    const [activeTab, setActiveTab] = useState('resumen');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar Simple */}
            <aside className="bg-white w-full md:w-64 p-6 border-r border-gray-100 hidden md:block">
                <h1 className="text-xl font-black text-institutional-blue mb-10 tracking-tighter">TESORERÍA</h1>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('resumen')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'resumen' ? 'bg-institutional-blue text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <PieChart size={20} /> Dashboard KPI
                    </button>
                    <button
                        onClick={() => setActiveTab('ingresos')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'ingresos' ? 'bg-institutional-blue text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <TrendingUp size={20} /> Ingresos
                    </button>
                    <button
                        onClick={() => setActiveTab('pagos')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'pagos' ? 'bg-institutional-blue text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <CreditCard size={20} /> Registrar Pago
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">Control Financiero</h2>
                        <p className="text-gray-400 font-medium">Gestión de recaudos y cartera</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white text-gray-600 border border-gray-200 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2">
                            <Download size={18} /> Exportar
                        </button>
                        <button className="bg-institutional-blue text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                            <PlusCircle size={20} /> Registrar Ingreso
                        </button>
                    </div>
                </header>

                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Recaudo Total</p>
                        </div>
                        <p className="text-3xl font-black text-gray-800">$45.2M</p>
                        <p className="text-xs font-bold text-green-500 mt-1">+15% vs mes anterior</p>
                    </div>

                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Pensiones Al Día</p>
                        </div>
                        <p className="text-3xl font-black text-gray-800">85%</p>
                        <p className="text-xs font-bold text-blue-500 mt-1">12 Estudiantes pendientes</p>
                    </div>

                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Cartera Vencida</p>
                        </div>
                        <p className="text-3xl font-black text-gray-800">$2.8M</p>
                        <p className="text-xs font-bold text-amber-500 mt-1">Acción requerida</p>
                    </div>

                    <div className="bg-institutional-blue p-6 rounded-[30px] shadow-xl text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <PieChart size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-white/50 tracking-widest">Proyección Mes</p>
                        </div>
                        <p className="text-3xl font-black">$60.0M</p>
                        <div className="w-full bg-black/20 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-institutional-magenta h-full w-[75%]"></div>
                        </div>
                        <p className="text-[10px] font-bold mt-2 text-white/70">75% de la meta alcanzada</p>
                    </div>
                </div>

                {/* Transactions Grid */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-gray-800">Movimientos Recientes</h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold outline-none ring-1 ring-transparent focus:ring-institutional-blue" />
                            </div>
                            <button className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:text-institutional-blue"><Filter size={20} /></button>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                <th className="pb-4 px-4">Fecha</th>
                                <th className="pb-4 px-4">Estudiante</th>
                                <th className="pb-4 px-4">Concepto</th>
                                <th className="pb-4 px-4">Método</th>
                                <th className="pb-4 px-4">Monto</th>
                                <th className="pb-4 px-4">Estado</th>
                                <th className="pb-4 px-4 text-right">Comprobante</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-gray-600">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <td className="py-4 px-4">07 Feb 2026</td>
                                    <td className="py-4 px-4 font-bold text-gray-800">Juan Pérez</td>
                                    <td className="py-4 px-4">Pensión Febrero</td>
                                    <td className="py-4 px-4">
                                        <span className={`flex items-center gap-2 ${i % 2 === 0 ? 'text-purple-600' : 'text-green-600'}`}>
                                            {i % 2 === 0 ? <CreditCard size={14} /> : <DollarSign size={14} />}
                                            {i % 2 === 0 ? 'Transferencia' : 'Efectivo'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold">$220,000</td>
                                    <td className="py-4 px-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-black uppercase">Pagado</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {i % 2 === 0 && (
                                            <button className="text-institutional-blue hover:underline text-xs font-bold flex items-center justify-end gap-1">
                                                <FileText size={14} /> Ver Soporte
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}
