"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, Loader2, Phone, Clock } from "lucide-react";
import { mockData } from "@/data/mockData";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function ChatIA() {
    const { colegio } = mockData;
    const params = useParams();
    const [schoolId, setSchoolId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: `¡Hola! Soy el asistente virtual del ${colegio.nombre}. ¿En qué puedo ayudarte hoy?` }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        async function getSchool() {
            if (params?.slug) {
                const { data } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
                if (data) setSchoolId(data.id);
            }
        }
        getSchool();
    }, [params?.slug]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    school_id: schoolId
                })
            });

            if (!response.ok) throw new Error('Error en la respuesta');

            const data = await response.json();
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error("Error chat:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Lo siento, tuve un problema de conexión. ¿Podrías intentar de nuevo o escribirnos por WhatsApp?"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Check if within secretary business hours (Mon-Fri 7am-3pm COT)
    const isBusinessHours = () => {
        const now = new Date();
        const col = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
        const day = col.getDay();
        const hour = col.getHours();
        return day >= 1 && day <= 5 && hour >= 7 && hour < 15;
    };

    return (
        <>
            {/* Floating Center Button — Atención IA 24/7 (sin animación) */}
            <a
                href="https://wa.me/573229191905?text=Hola, necesito información sobre el Colegio Latinoamericano"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-500/30 hover:brightness-110 transition-all flex items-center gap-3"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Atención IA 24/7
            </a>

            {/* Bottom-Right Buttons */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
                {/* Chat Window */}
                {isOpen && (
                    <div className="bg-white w-[350px] h-[500px] rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5">
                        <div className="bg-institutional-blue p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm tracking-tight">Asistente Virtual</p>
                                        <p className="text-[10px] opacity-70 uppercase font-black tracking-widest flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> En línea
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "user"
                                        ? "bg-institutional-blue text-white rounded-br-none"
                                        : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full "></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full  delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full  delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Escribe tu duda o datos..."
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-institutional-blue outline-none transition-all disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-institutional-magenta text-white p-3 rounded-xl transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg shadow-magenta-500/20"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bubble Options Menu */}
                {showOptions && !isOpen && (
                    <div className="flex flex-col gap-3 mb-4 animate-in slide-in-from-bottom-5">
                        {/* WhatsApp Secretaría (persona real — con horario) */}
                        <a
                            href="https://wa.me/573212808022?text=Hola, necesito información del Colegio Latinoamericano"
                            target="_blank"
                            className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-transform"
                        >
                            <div className="flex-1">
                                <span className="block">Secretaría (Persona)</span>
                                <span className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                                    <Clock size={10} /> {isBusinessHours() ? '🟢 Disponible ahora' : '🔴 Lun-Vie 7am-3pm'}
                                </span>
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Phone size={18} />
                            </div>
                        </a>


                        {/* IA Chat interno */}
                        <button
                            onClick={() => { setIsOpen(true); setShowOptions(false); }}
                            className="flex items-center gap-3 bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-transform"
                        >
                            <span>Chat con IA Escolar</span>
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Bot size={18} />
                            </div>
                        </button>
                    </div>
                )}

                {/* Main Toggle Button */}
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all z-[101] ${showOptions ? "bg-red-500 text-white rotate-45" : "bg-institutional-magenta text-white"
                        }`}
                >
                    {showOptions ? <X size={28} /> : <MessageCircle size={28} />}
                </button>
            </div>
        </>
    );
}

