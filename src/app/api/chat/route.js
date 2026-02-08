import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Inicializar Groq
// Nota: Idealmente esto debería venir de .env.local o de la base de datos (si tuvieras Service Key)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Inicializar Supabase para guardar Leads (ANON key funciona porque la política es pública para INSERT)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Selector de Prompt Dinámico
const getSystemPrompt = (mode) => {
    if (mode === 'sales') {
        return `Eres Sofía, la Asistente de Ventas de "Gestor Educativo 365" (un producto de Variedades JyM).
Tu objetivo es vender el software a Rectores de colegios.
Datos de Contacto (ENTRÉGALOS SOLO SI PIDEN HABLAR CON UN HUMANO):
- Email: madfer1993@gmail.com
- WhatsApp: +573045788873

Instrucciones:
1. Sé persuasiva, profesional y entusiasta.
2. Destaca: Automatización de matrículas, pensiones online, y app para padres.
3. Intenta obtener el Nombre del Rector y del Colegio.
4. Si preguntan precios, invítalos a probar la demo gratis.`;
    }
    // Default: Modo Colegio (Soporte a Padres/Alumnos)
    return `Eres el asistente virtual del "Colegio Latinoamericano". Tu objetivo es brindar información sobre admisiones, costos y horarios.
Datos Clave:
- Ubicación: Villavicencio, Barrio El Estero.
- Teléfono: 321 280 8022.
Instrucciones:
1. Sé amable y conciso.
2. Si preguntan costos, invítalos a admisiones.`;
};

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages, mode = 'edu' } = body;

        // 1. Selector de System Prompt
        const systemPrompt = getSystemPrompt(mode);

        // 2. Llamar a Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "";

        // 3. Lógica de Captura de Leads (Solo en modo ventas)
        if (mode === 'sales') {
            const lastUserMessage = messages[messages.length - 1].content;
            const phoneRegex = /\b\d{7,10}\b/; // Detectar números de 7-10 dígitos

            if (phoneRegex.test(lastUserMessage.replace(/\s/g, ''))) {
                try {
                    await supabase.from('leads').insert([{
                        nombre: "Interesado desde Chat", // Podríamos mejorar esto con IA
                        telefono: lastUserMessage,
                        mensaje: aiResponse, // Guardamos lo que respondió la IA como contexto
                        origen: 'sales_chat_bot',
                        estado: 'nuevo'
                    }]);
                    console.log("Lead guardado en Supabase");
                } catch (err) {
                    console.error("Error guardando lead:", err);
                }
            }
        }

        if (hasPhone) {
            // Intentar guardar en Supabase como Lead
            try {
                // Nombre: Asumimos que todo el mensaje es el nombre si es corto, o "Interesado Chat"
                const possibleName = lastUserMessage.length < 50 ? lastUserMessage : "Usuario desde Chat";

                await supabase.from('leads').insert([
                    {
                        nombre: possibleName,
                        telefono: lastUserMessage, // Guardamos el mensaje completo para que el humano filtre
                        grado: 'Interés General',
                        estado: 'Pendiente',
                        acudiente: 'Capturado por IA'
                    }
                ]);
                console.log("Lead capturado desde IA");
            } catch (err) {
                console.error("Error guardando lead:", err);
            }
        }

        return NextResponse.json({ role: 'assistant', content: aiResponse });

    } catch (error) {
        console.error('Error en Chat API:', error);
        return NextResponse.json(
            { error: 'Error procesando tu solicitud.' },
            { status: 500 }
        );
    }
}
