import { createClient } from '@/utils/supabase/server';
import SchoolNavbar from '@/components/SchoolNavbar';
import SchoolFooter from '@/components/SchoolFooter';
import NavbarWrapper from '@/components/NavbarWrapper';

export async function generateMetadata({ params }) {
    const supabase = createClient();
    const { data: school } = await supabase.from('schools').select('*').eq('slug', params.slug).single();

    if (!school) return {};

    const iconPath = `/latinoamericano/`; // Por ahora fijo al slug que tenemos, pero podría ser dinámico: `/${params.slug}/`

    return {
        title: {
            default: school.nombre,
            template: `%s | ${school.nombre}`
        },
        description: school.slogan,
        icons: {
            icon: [
                { url: `${iconPath}favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
                { url: `${iconPath}favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
                { url: `${iconPath}favicon.ico` },
            ],
            apple: [
                { url: `${iconPath}apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
            ],
            other: [
                { rel: 'android-chrome-192x192', url: `${iconPath}android-chrome-192x192.png` },
                { rel: 'android-chrome-512x512', url: `${iconPath}android-chrome-512x512.png` },
            ]
        },
        manifest: `${iconPath}site.webmanifest`
    }
}

export default async function SchoolLayout({ children, params }) {
    const supabase = createClient();
    const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!school) return <>{children}</>;

    const branding = school.branding_colors || { primary: '#0f172a', secondary: '#2563eb' };

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarWrapper slug={params.slug}>
                <SchoolNavbar
                    schoolName={school.nombre}
                    logoUrl={school.logo_url}
                    brandingColors={branding}
                    slug={params.slug}
                    socialLinks={{
                        facebook: school.facebook_url,
                        instagram: school.instagram_url,
                        tiktok: school.tiktok_url,
                        youtube: school.youtube_url
                    }}
                />
            </NavbarWrapper>
            <main className="flex-1">
                {children}
            </main>
            <SchoolFooter
                schoolName={school.nombre}
                logoUrl={school.logo_url}
                primaryColor={branding.primary}
                socialLinks={{
                    facebook: school.facebook_url,
                    instagram: school.instagram_url,
                    tiktok: school.tiktok_url,
                    youtube: school.youtube_url
                }}
            />
        </div>
    );
}
