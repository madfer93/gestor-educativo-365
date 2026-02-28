"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, PieChart, TrendingUp, CreditCard, Search, Filter, Download, PlusCircle, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export default function TesoreriaDashboard({ params }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, debt: 0, goal: 60000000 });
    const [school, setSchool] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: schoolData } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
            if (schoolData) {
                setSchool(schoolData);
                const { data: paymentsData } = await supabase
                    .from('pagos_estudiantes')
                    .select('*, profiles:student_id(nombre)')
                    .eq('school_id', schoolData.id)
                    .order('created_at', { ascending: false });

                setPayments(paymentsData || []);

                const totalRecaudo = (paymentsData || []).reduce((sum, p) => sum + Number(p.amount), 0);
                setStats(prev => ({ ...prev, total: totalRecaudo }));
            }
        } catch (err) {
            console.error("Error fetching tesoreria:", err);
        }
        setLoading(false);
    }, [params.slug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprovePayment = async (payId) => {
        try {
            const { error } = await supabase
                .from('pagos_estudiantes')
                .update({ status: 'Completado' })
                .eq('id', payId);

            if (error) throw error;

            // Refresh local state to avoid full refetch
            setPayments(prev => prev.map(p => p.id === payId ? { ...p, status: 'Completado' } : p));
            alert('Pago aprobado exitosamente.');
        } catch (err) {
            console.error("Error approving payment:", err);
            alert("Error al aprobar pago");
        }
    };

    const handleViewReceipt = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('documentos').createSignedUrl(path, 60);
            if (error) throw error;
            window.open(data.signedUrl, '_blank');
        } catch (err) {
            console.error("Error viewing receipt:", err);
            alert("Error al abrir el comprobante");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
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
                        <p className="text-3xl font-black text-gray-800">${stats.total.toLocaleString('es-CO')}</p>
                        <p className="text-xs font-bold text-green-500 mt-1">Sincronizado con base de datos</p>
                    </div>

                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Transacciones</p>
                        </div>
                        <p className="text-3xl font-black text-gray-800">{payments.length}</p>
                        <p className="text-xs font-bold text-blue-500 mt-1">Pagos registrados</p>
                    </div>

                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Cartera Estimada</p>
                        </div>
                        <p className="text-3xl font-black text-gray-800">$2.8M</p>
                        <p className="text-xs font-bold text-amber-500 mt-1">Manual (Próximamente dinámico)</p>
                    </div>

                    <div className="bg-institutional-blue p-6 rounded-[30px] shadow-xl text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <PieChart size={24} />
                            </div>
                            <p className="text-xs font-black uppercase text-white/50 tracking-widest">Proyección Mes</p>
                        </div>
                        <p className="text-3xl font-black">${stats.goal.toLocaleString('es-CO')}</p>
                        <div className="w-full bg-black/20 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-institutional-magenta h-full transition-all duration-1000" style={{ width: `${Math.min((stats.total / stats.goal) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-[10px] font-bold mt-2 text-white/70">{Math.round((stats.total / stats.goal) * 100)}% de la meta alcanzada</p>
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                    <th className="pb-4 px-4">Fecha</th>
                                    <th className="pb-4 px-4">Estudiante</th>
                                    <th className="pb-4 px-4">Concepto</th>
                                    <th className="pb-4 px-4">Método</th>
                                    <th className="pb-4 px-4">Monto</th>
                                    <th className="pb-4 px-4">Estado</th>
                                    <th className="pb-4 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-gray-600">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center">
                                            <Loader2 className="animate-spin text-institutional-blue mx-auto mb-2" />
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cargando transacciones...</p>
                                        </td>
                                    </tr>
                                ) : payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="py-4 px-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 font-bold text-gray-800">{payment.profiles?.nombre || 'Estudiante'}</td>
                                            <td className="py-4 px-4 text-xs">{payment.concept}</td>
                                            <td className="py-4 px-4">
                                                <span className="flex items-center gap-2 text-purple-600">
                                                    <CreditCard size={14} />
                                                    {payment.method}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-bold">${Number(payment.amount).toLocaleString('es-CO')}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${payment.status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                                {payment.receipt_url && (
                                                    <button
                                                        onClick={() => handleViewReceipt(payment.receipt_url)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title="Ver Comprobante"
                                                    >
                                                        <FileText size={14} />
                                                    </button>
                                                )}
                                                {payment.status === 'Pendiente' && (
                                                    <button
                                                        onClick={() => handleApprovePayment(payment.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Aprobar Pago"
                                                    >
                                                        <CheckCircle size={14} />
                                                    </button>
                                                )}
                                                <span className="text-[10px] font-black text-gray-400">{payment.transaction_id || 'S/N'}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-gray-400 italic">No hay pagos registrados aún.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
