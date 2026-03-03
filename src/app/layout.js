import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Gestor Educativo 365 - Plataforma Escolar",
    description: "La plataforma líder para la gestión de colegios en Latinoamérica.",
    icons: {
        icon: '/logo.png',
    },
    verification: {
        google: '2s7_GpgixQCwcQ7h_3wjfVn9Ay8KcthSU9QYbgtRlqg',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
