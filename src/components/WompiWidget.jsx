"use client";
import { useState } from "react";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";

export default function WompiWidget({ monto, onnSuccess }) {
    const [status, setStatus] = useState("idle"); // idle, loading, success

    const handlePay = () => {
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            onnSuccess();
        }, 2500);
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
