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

const SYSTEM_PROMPT = `
Eres el asistente virtual del "Colegio Latinoamericano". Tu objetivo es brindar información sobre admisiones, costos y horarios, y convencer a los padres de inscribir a sus hijos.

Datos Clave:
- Nombre: Colegio Latinoamericano.
- Ubicación: Villavicencio, Barrio El Estero.
- Teléfono: 321 280 8022.
- Niveles: Preescolar, Primaria, Bachillerato.
- Filosofía: Formación integral con valores.

Instrucciones:
1. Sé amable, profesional y persuasivo.
2. Si el usuario pregunta por costos, invítalo a dejar sus datos o visitar la sección de Admisiones.
3. IMPORTANTE: Intenta sutilmente obtener el NOMBRE y el TELÉFONO del interesado.
   Ejemplo: "¿Te gustaría que un asesor te contacte por WhatsApp para darte los costos detallados? Por favor indícame tu nombre y número."
4. Si el usuario te da su nombre y teléfono, CONFIRMA que los has recibido.

Responde siempre en español y de forma concisa.
`;

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages } = body;

        // 1. Llamar a Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "";

        // 2. Lógica de Captura de Leads (Básica)
        // Buscamos si el último mensaje del usuario tiene números (posible teléfono) y nombre
        const lastUserMessage = messages[messages.length - 1].content;

        // Regex simple para detectar teléfonos (7 a 10 dígitos)
        const phoneRegex = /\b\d{7,10}\b/;
        const hasPhone = phoneRegex.test(lastUserMessage.replace(/\s/g, '')); // Eliminar espacios para check

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
