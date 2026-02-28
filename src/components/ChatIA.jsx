"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, Loader2 } from "lucide-react";
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

    return (
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
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
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
                                className="bg-institutional-magenta text-white p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg shadow-magenta-500/20"
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
                    {/* WhatsApp Button */}
                    <a
                        href={`https://wa.me/57${colegio.telefono.replace(/\s/g, '')}`}
                        target="_blank"
                        className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform"
                    >
                        <span>Hablar por WhatsApp</span>
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <MessageCircle size={18} />
                        </div>
                    </a>

                    {/* IA Button */}
                    <button
                        onClick={() => { setIsOpen(true); setShowOptions(false); }}
                        className="flex items-center gap-3 bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform"
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
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-[101] ${showOptions ? "bg-red-500 text-white rotate-45" : "bg-institutional-magenta text-white"
                    }`}
            >
                {showOptions ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
