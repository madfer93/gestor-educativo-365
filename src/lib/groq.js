import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export const getAIResponse = async (userMessage) => {
    // En producción, esto debería ir en una API Route para mayor seguridad
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Actúa como el asistente virtual del Colegio Latinoamericano (Nueva Administración). 
        Usa esta información para responder:
        - Costos: Pre-escolar (Matrícula $350k), Primaria/Bachillerato ($310k), Pensión ($200k-$220k).
        - Requisitos: Carpeta amarilla, SIMAT, Certificados, Fotos 3x4 fondo azul.
        - Ubicación: Calle 13 Carrera 14 Esquina Barrio El Estero, Villavicencio.
        - Horarios: Jornada Mañana, Tarde y Sabatina.
        Sé amable, profesional y conciso.`
            },
            { role: "user", content: userMessage }
        ],
        model: "llama3-8b-8192",
    });

    return chatCompletion.choices[0].message.content;
};
