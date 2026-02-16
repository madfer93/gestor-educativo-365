import { NextResponse } from 'next/server';

export async function middleware(req) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host');

    // Define los dominios base de la plataforma (ajusta según tus dominios reales)
    const rootDomains = [
        'localhost:3000',
        'gestoreducativo365.online',
        'gestor-educativo-365.vercel.app'
    ];

    const isRootDomain = rootDomains.some(domain => hostname.includes(domain));

    // Si no es un dominio raíz, es un dominio personalizado de un colegio
    if (!isRootDomain) {
        // Aquí mapeamos el dominio a un slug específico
        // Por ahora lo haremos manual para el Colegio Latinoamericano
        // En el futuro esto se consultará en la base de datos (Supabase)
        let slug = '';

        if (hostname.includes('colegiolatinoamericanovillavicencio.com')) {
            slug = 'latinoamericano';
        }

        if (slug) {
            // Si la ruta ya empieza con el slug, no lo duplicamos
            if (url.pathname.startsWith(`/${slug}`)) {
                return NextResponse.next();
            }

            // Reescribe la URL internamente de "/" a "/latinoamericano/"
            // El usuario seguirá viendo "colegiolatinoamericanovillavicencio.com" en su barra de direcciones
            return NextResponse.rewrite(new URL(`/${slug}${url.pathname}${url.search}`, req.url));
        }
    }

    return NextResponse.next();
}

// Configura en qué rutas se debe ejecutar el middleware
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (static files)
         * 3. /_static (if used)
         * 4. /favicon.ico, /sitemap.xml, /robots.txt (metadata files)
         */
        '/((?!api|auth|_next/static|_next/image|assets|favicon.ico|logo.png|sitemap.xml|robots.txt|site.webmanifest).*)',
    ],
};
