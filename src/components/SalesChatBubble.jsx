"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, Sparkles } from "lucide-react";

export default function SalesChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "¡Hola! 👋 Soy Sofía, asesora de Gestor Educativo 365. ¿Te gustaría saber cómo automatizar tu colegio hoy mismo?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, selectedImage]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        // Construir mensaje usuario
        const userContent = [];
        if (input.trim()) userContent.push({ type: "text", text: input });
        if (selectedImage) userContent.push({ type: "image_url", image_url: { url: selectedImage } });

        // Para mostrar en UI local (simplificado)
        const uiMessage = {
            role: "user",
            content: input,
            image: selectedImage
        };

        const newMessages = [...messages, uiMessage];
        setMessages(newMessages);

        setInput("");
        setSelectedImage(null);
        setIsLoading(true);

        // Preparar mensajes para API (formato compatible con Vision)
        const apiMessages = newMessages.map(msg => {
            if (msg.role === "user" && msg.image) {
                return {
                    role: "user",
                    content: [
                        { type: "text", text: msg.content || "Imagen adjunta" },
                        { type: "image_url", image_url: { url: msg.image } }
                    ]
                };
            }
            return { role: msg.role, content: msg.content };
        });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages, mode: 'sales' })
            });

            if (!response.ok) throw new Error('Error de red');

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]); // Ajuste para recibir objeto
        } catch (error) {
            console.error("Error sales chat:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Ups, mi conexión falló. Pero puedes escribirme directo a WhatsApp: +573045788873"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[340px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 transition-all duration-300 origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Sparkles size={20} className="text-yellow-300" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Ventas Gestor 365</p>
                                <p className="text-[10px] opacity-90 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> En línea
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-sm"
                                    : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm"
                                    }`}>
                                    {msg.image && (
                                        <img src={msg.image} alt="Upload" className="w-full rounded-lg mb-2 border border-white/20" />
                                    )}
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-300" />
                                <span className="text-xs text-slate-500">Imagen seleccionada</span>
                            </div>
                            <button onClick={() => setSelectedImage(null)} className="text-slate-500 hover:text-red-500">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <div className="flex gap-2 items-end">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                title="Adjuntar imagen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Escribe aquí..."
                                className="flex-1 bg-slate-100 text-slate-900 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Legal Footer */}
                    <div className="bg-slate-50 py-2 text-center border-t border-slate-100 px-4">
                        <p className="text-[9px] text-slate-400">
                            Variedades JyM AI. Al chatear, aceptas nuestra <a href="/legal/privacidad" target="_blank" className="underline hover:text-blue-500">Política de Privacidad</a>.
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all hover:shadow-blue-500/30"
                >
                    <span className="text-sm font-bold hidden group-hover:block transition-all duration-300">¿Hablemos?</span>
                    <MessageCircle size={24} />
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
            )}
        </div>
    );
}
