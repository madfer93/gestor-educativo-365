"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash, Check, ArrowLeft } from 'lucide-react';

export default function ConfigPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            // Nota: En un entorno real, esta llamada debería incluir credenciales de admin
            // o usar una ruta protegida si TÚ configuras el acceso. 
            // Como usamos la ruta pública por ahora:
            const res = await fetch('/api/pricing');
            const data = await res.json();
            setPlans(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (plan) => {
        try {
            const res = await fetch('/api/pricing', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plan)
            });
            if (res.ok) {
                alert('Plan actualizado correctamente');
                fetchPlans();
            } else {
                throw new Error('Error al actualizar');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleFeatureChange = (planIndex, featureIndex, value) => {
        const newPlans = [...plans];
        newPlans[planIndex].features[featureIndex] = value;
        setPlans(newPlans);
    };

    const addFeature = (planIndex) => {
        const newPlans = [...plans];
        if (!newPlans[planIndex].features) newPlans[planIndex].features = [];
        newPlans[planIndex].features.push("Nueva característica");
        setPlans(newPlans);
    };

    const removeFeature = (planIndex, featureIndex) => {
        const newPlans = [...plans];
        newPlans[planIndex].features.splice(featureIndex, 1);
        setPlans(newPlans);
    };

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Cargando configuración...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <a href="/superadmin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Volver al Dashboard
                </a>

                <h1 className="text-4xl font-black mb-2 text-white tracking-tight">Configuración Global</h1>
                <p className="text-slate-400 font-medium mb-12">Administra los parámetros generales de la plataforma SaaS.</p>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                        <span className="bg-purple-500/10 p-2 rounded-lg"><Save size={20} /></span>
                        Gestión de Planes y Precios
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div key={plan.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between mb-6">
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${plan.highlight ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                                        {plan.name}
                                    </span>
                                    <button onClick={() => handleUpdate(plan)} className="bg-green-500/10 text-green-400 p-2 rounded-lg hover:bg-green-500 hover:text-white transition-all" title="Guardar cambios">
                                        <Save size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Precio Mensual</label>
                                        <input
                                            type="text"
                                            value={plan.price}
                                            onChange={(e) => {
                                                const newPlans = [...plans];
                                                newPlans[i].price = e.target.value;
                                                setPlans(newPlans);
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold text-lg focus:border-purple-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Link de Pago (Wompi)</label>
                                        <input
                                            type="text"
                                            value={plan.wompi_link}
                                            onChange={(e) => {
                                                const newPlans = [...plans];
                                                newPlans[i].wompi_link = e.target.value;
                                                setPlans(newPlans);
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:border-purple-500 outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Características</label>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {plan.features?.map((feat, fIdx) => (
                                                <div key={fIdx} className="flex gap-2 items-center">
                                                    <input
                                                        value={feat}
                                                        onChange={(e) => handleFeatureChange(i, fIdx, e.target.value)}
                                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:border-purple-500 outline-none transition-colors"
                                                    />
                                                    <button onClick={() => removeFeature(i, fIdx)} className="text-slate-600 hover:text-red-400 transition-colors">
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => addFeature(i)} className="mt-4 w-full py-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2">
                                            <Plus size={14} /> Agregar Característica
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
