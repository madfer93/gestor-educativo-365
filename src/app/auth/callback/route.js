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
                // 2. Consultar el ROL en la tabla profiles
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("rol")
                    .eq("id", user.id)
                    .single();

                // 3. Redirigir según el ROL
                if (profile) {
                    switch (profile.rol) {
                        case "superadmin":
                            return NextResponse.redirect(`${requestUrl.origin}/superadmin`);
                        case "admin":
                            return NextResponse.redirect(`${requestUrl.origin}/admin`);
                        case "secretary":
                            return NextResponse.redirect(`${requestUrl.origin}/secretaria`);
                        case "bursar":
                            return NextResponse.redirect(`${requestUrl.origin}/tesoreria`);
                        case "teacher":
                            return NextResponse.redirect(`${requestUrl.origin}/profesores`);
                        case "student":
                            return NextResponse.redirect(`${requestUrl.origin}/estudiante`);
                        default:
                            return NextResponse.redirect(`${requestUrl.origin}/`); // Fallback
                    }
                }
            }
            return NextResponse.redirect(`${requestUrl.origin}${next}`);
        }
    }

    // Si hubo error o no hay código, volver al login
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
}
