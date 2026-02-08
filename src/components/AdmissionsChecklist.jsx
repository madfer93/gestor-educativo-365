"use client";
import { useState } from "react";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

export default function AdmissionsChecklist({ initialRequirements }) {
    const [items, setItems] = useState(initialRequirements);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completado: !item.completado } : item
        ));
    };

    const completedCount = items.filter(i => i.completado).length;
    const progress = (completedCount / items.length) * 100;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-institutional-blue">Progreso de Admisión</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    {completedCount} / {items.length}
                </span>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
                <div
                    className="bg-institutional-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-4">
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        {item.completado ? (
                            <CheckCircle className="text-green-500 shrink-0" />
                        ) : (
                            <Circle className="text-gray-300 shrink-0" />
                        )}
                        <span className={`text-sm ${item.completado ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {progress < 100 && (
                <div className="mt-8 p-4 bg-amber-50 rounded-xl flex gap-3 items-start">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-700 italic">
                        Para completar tu matrícula, debes cargar todos los documentos en formato PDF o imagen nítida.
                    </p>
                </div>
            )}
        </div>
    );
}
