"use client";
import { useState } from "react";
import { CreditCard, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export default function WompiWidget({ monto, onnSuccess }) {
    const [status, setStatus] = useState("idle"); // idle, loading, success
    const [error, setError] = useState(null);

    const handlePay = async () => {
        setStatus("loading");
        setError(null);
        try {
            // Simulación de proceso de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Registro real en base de datos al tener éxito
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No hay sesión activa");

            // Obtener el school_id desde la URL o perfil (aquí simplificado o pasado por prop si fuera necesario)
            // Por ahora asumimos que el padre ya tiene schoolContext o lo buscamos
            const { data: profile } = await supabase.from('profiles').select('school_id').eq('id', user.id).single();

            const { error: dbError } = await supabase.from('pagos_estudiantes').insert([{
                student_id: user.id,
                school_id: profile.school_id,
                amount: monto,
                concept: 'Pago Global de Servicios Educativos',
                method: 'Wompi (Simulado)',
                status: 'Completado',
                transaction_id: `WMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            }]);

            if (dbError) throw dbError;

            setStatus("success");
            if (onnSuccess) onnSuccess();
        } catch (err) {
            console.error("Error en pago:", err);
            setError(err.message);
            setStatus("idle");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center text-center">
            <CreditCard size={48} className="text-gray-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Simulador de Pago Wompi</h3>
            <p className="text-gray-500 mb-6 text-sm">Transferencia segura por ${monto.toLocaleString()}</p>

            {status === "idle" && (
                <button
                    onClick={handlePay}
                    className="bg-[#E4007C] text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all w-full"
                >
                    Pagar con Wompi
                </button>
            )}

            {status === "loading" && (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-institutional-blue" />
                    <p className="text-sm font-medium">Procesando pago...</p>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center gap-2 text-green-600">
                    <CheckCircle2 size={32} />
                    <p className="font-bold">¡Pago Exitoso!</p>
                </div>
            )}
        </div>
    );
}
