# Gestor Educativo 365 - Plataforma SaaS

Este proyecto es el repositorio oficial de **Gestor Educativo 365**, una plataforma SaaS Multi-tenant diseñada para la gestión integral de colegios en Latinoamérica.

## 🚀 Tecnologías
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Iconos:** Lucide React
- **Backend:** Supabase (Auth & Database)
- **IA:** Groq SDK (Llama 3)
- **Despliegue:** Vercel

## 📂 Arquitectura (Multi-tenant)
- `/src/app/page.js`: Landing Page Comercial (Venta del Software).
- `/src/app/[slug]/page.js`: Landing Page Dinámica por Colegio (ej: `/latinoamericano`).
- `/src/app/superadmin`: Consola Maestra para el dueño del SaaS.
- `/src/app/admin`: Panel para Rectores de cada colegio.

## 🛠️ Configuración de Producción
Para conectar los servicios reales:
1. Crear un proyecto en [Supabase](https://supabase.com).
2. Obtener una API Key en [Groq Cloud](https://console.groq.com).
3. Configurar las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GROQ_API_KEY`

## 👤 Autor
**Manuel Fernando Madrid Rueda**
*CEO - Gestor Educativo 365*
Contacto: madfer1993@gmail.com

---
*Plataforma desarrollada con arquitectura escalable para múltiples instituciones.*

