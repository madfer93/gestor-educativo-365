import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Inicializar Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Inicializar Supabase para guardar Leads
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
1. Eres una CONSULTORA DE ÉLITE, no un simple robot. Tu tono es profesional, empático y orientado a resultados.
2. ESTRATEGIA DECAPTURA (HABEAS DATA IMPLÍCITO):
   - NO pidas datos "porque sí". Ofrece valor primero.
   - EJEMPLO CORRECTO: "Para poder enviarte una propuesta personalizada y la demo gratuita, ¿me autorizas a contactarte por WhatsApp? Si es así, por favor déjame tu nombre y número celular."
   - EJEMPLO INCORRECTO: "Dame tu teléfono."
3. Si el usuario da el dato, agradécele y confirma que un asesor humano (madfer1993) lo revisará.
4. Si preguntan precios, destaca el valor (ahorro de tiempo, control) antes de dar la cifra, o invítalos a ver la sección de precios.`;
    }
    // Default: Modo Colegio
    return `Eres el asistente virtual del "Colegio Latinoamericano" de Villavicencio, Meta. Tu objetivo es ayudar a padres, estudiantes e interesados con información sobre admisiones, costos, horarios y temas generales.

DATOS INSTITUCIONALES:
- Nombre: Colegio Latinoamericano
- Ubicación: Villavicencio, Barrio El Estero, Meta, Colombia
- Teléfono Principal: 321 280 8022
- WhatsApp Secretaría: 321 280 8022 (Lun-Vie 7AM-3PM)
- WhatsApp IA 24/7: 322 919 1905 (atención automática)

ADMISIONES:
- Para información de admisiones, invítalos a visitarnos en el colegio o contactar por WhatsApp al 321 280 8022.
- Menciona que pueden ver los costos en la sección de "Costos" del sitio web.

PAGOS:
- Pago en línea: mediante la pasarela Wompi (tarjeta, PSE).
- Transferencia bancaria: deben enviar el soporte de pago al WhatsApp de Secretaría (321 280 8022).
- Los pagos se registran automáticamente en el sistema de Tesorería.

POLÍTICAS LEGALES Y HABEAS DATA:
- El colegio cuenta con Política de Tratamiento de Datos Personales según la Ley 1581 de 2012.
- La política de Habeas Data, Privacidad, Uso de Imagen y Términos y Condiciones están disponibles en la página /legal del sitio web.
- Si el usuario comparte datos personales (nombre, teléfono, correo), debes informarle: "Al proporcionarnos tus datos, autorizas su tratamiento conforme a nuestra Política de Datos Personales (Ley 1581 de 2012). Puedes consultar la política completa en nuestra página de documentos legales."
- Siempre pide autorización antes de guardar datos: "¿Me autorizas a compartir tu información con Secretaría para que te contacten?"

INSTRUCCIONES:
1. Sé amable, profesional y conciso.
2. Si preguntan costos específicos, invítalos a la sección de Costos del sitio web o a contactar a Secretaría.
3. Si el usuario quiere hablar con una persona real, dirige al WhatsApp de Secretaría: 321 280 8022.
4. Responde SIEMPRE en español.
5. No inventes información que no conozcas, mejor sugiere contactar a Secretaría.`;
};

export async function POST(req) {
    console.log("🔥 [API/CHAT] Solicitud Recibida");
    try {
        const body = await req.json();
        const { messages, mode = 'edu' } = body;
        console.log(`📋 [API/CHAT] Modo: ${mode}, Mensajes: ${messages?.length}`);

        // 1. Selector de System Prompt
        const systemPrompt = getSystemPrompt(mode);

        // 2. Detectar si hay imágenes para usar modelo de Visión
        const hasImages = messages.some(msg =>
            Array.isArray(msg.content) && msg.content.some(c => c.type === 'image_url')
        );

        const selectedModel = hasImages ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile';

        console.log(`🚀 [API/CHAT] Conectando con Groq (Modelo: ${selectedModel})...`);
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: selectedModel,
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "";
        console.log("✅ [API/CHAT] Respuesta IA recibida.");

        // 3. Lógica de Captura de Leads (Modo Ventas o Educación)
        if (mode === 'sales' || mode === 'edu') {
            const { school_id } = body;
            const lastUserMessage = messages[messages.length - 1].content;
            console.log(`🕵️ [API/CHAT] Analizando: "${lastUserMessage}"`);

            // Regex para detectar números de 7 a 10 dígitos (posibles teléfonos)
            const phoneRegex = /\b\d{7,10}\b/;

            if (phoneRegex.test(lastUserMessage.replace(/\s/g, ''))) {
                console.log("📞 [API/CHAT] Teléfono encontrado. Guardando lead...");
                try {
                    const { data, error } = await supabase.from('leads').insert([{
                        school_id: school_id,
                        nombre: "Interesado desde Chat",
                        telefono: lastUserMessage,
                        interes: aiResponse,
                        origen: mode === 'sales' ? 'sales_chat_bot' : 'edu_chat_bot',
                        estado: 'nuevo'
                    }]).select();

                    if (error) {
                        console.error("❌ [API/CHAT] Error Supabase:", error);
                    } else {
                        console.log("💾 [API/CHAT] Lead guardado ID:", data[0]?.id);
                    }
                } catch (err) {
                    console.error("💥 [API/CHAT] Excepción al guardar lead:", err);
                }
            }
        }

        return NextResponse.json({ role: 'assistant', content: aiResponse });

    } catch (error) {
        console.error('💥💥 [API/CHAT] Error CRÍTICO:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor.', details: error.message },
            { status: 500 }
        );
    }
}
