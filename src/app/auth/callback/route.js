import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/";

    if (code) {
        const cookieStore = cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name, options) {
                        cookieStore.set({ name, value: "", ...options });
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // 1. Obtener el usuario autenticado
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // 2. Consultar el ROL y el COLEGIO en la tabla profiles
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("rol, school_id")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    let slug = "";

                    // Si el perfil tiene colegio, buscar el slug
                    if (profile.school_id) {
                        const { data: school } = await supabase
                            .from("schools")
                            .select("slug")
                            .eq("id", profile.school_id)
                            .single();
                        if (school) slug = school.slug;
                    }

                    // 3. Redirigir según el ROL (incluyendo el slug si existe)
                    const dashboardPath = slug ? `/${slug}` : "";

                    switch (profile.rol) {
                        case "superadmin":
                            return NextResponse.redirect(`${requestUrl.origin}/superadmin`);
                        case "admin":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/admin`);
                        case "secretary":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/secretaria`);
                        case "treasury":
                        case "bursar":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/tesoreria`);
                        case "coordinator":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/coordinacion`);
                        case "teacher":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/profesores`);
                        case "student":
                            return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}/estudiante`);
                        default:
                            return NextResponse.redirect(`${requestUrl.origin}/`); // Fallback
                    }
                }
            }
            return NextResponse.redirect(`${requestUrl.origin}${next}`);
        }
    }

    // Si hubo error o no hay código, volver al login
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=auth`);
}
