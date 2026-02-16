import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password, name, school_id, rol, metadata = {} } = await req.json();

        if (!email || !password || !rol || !school_id) {
            return NextResponse.json({ error: 'Faltan campos obligatorios (email, password, rol, school_id)' }, { status: 400 });
        }

        // Cliente con Service Role para bypass de RLS y creación de Auth
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Crear usuario en Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: name,
                rol: rol,
                school_id: school_id,
                ...metadata
            }
        });

        if (authError) throw authError;

        // 2. Crear/Actualizar Perfil en public.profiles
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email,
                nombre: name,
                rol,
                school_id,
                created_at: new Date().toISOString(),
                ...metadata
            });

        if (profileError) {
            // Si falla el perfil, intentamos borrar el usuario de auth para mantener consistencia
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            throw profileError;
        }

        return NextResponse.json({
            success: true,
            user: authData.user,
            message: `Usuario con rol ${rol} creado correctamente.`
        });

    } catch (error) {
        console.error('Error en manage-user API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
