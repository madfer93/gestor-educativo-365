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
        // Solo permitir campos válidos de la tabla profiles en metadata
        const allowedProfileFields = ['grado', 'public_bio', 'public_photo_url', 'specialty', 'is_public', 'fecha_nacimiento', 'tipo_documento', 'numero_documento', 'direccion', 'acudiente_nombre', 'acudiente_telefono', 'acudiente_email', 'acudiente_parentesco', 'es_menor_edad', 'documentos_entregados', 'grupo_sanguineo', 'alergias', 'condiciones_medicas', 'eps_salud'];
        const dateFields = ['fecha_nacimiento'];
        const safeMetadata = {};
        for (const key of allowedProfileFields) {
            if (metadata[key] !== undefined) {
                safeMetadata[key] = (metadata[key] === '' && dateFields.includes(key)) ? null : metadata[key];
            }
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email,
                nombre: name,
                rol,
                school_id,
                created_at: new Date().toISOString(),
                ...safeMetadata
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
        console.error('Error en manage-user API (POST):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Actualizar perfil existente (bypass RLS con Service Role)
export async function PUT(req) {
    try {
        const { id, password, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Falta el ID del usuario a actualizar' }, { status: 400 });
        }

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

        // Si se proporciona una nueva contraseña, actualizarla en Auth
        if (password) {
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
            if (authError) throw authError;
        }

        // Solo permitir campos válidos de la tabla profiles
        const allowedFields = ['nombre', 'email', 'rol', 'specialty', 'public_bio', 'public_photo_url', 'grado', 'is_public', 'school_id', 'fecha_nacimiento', 'tipo_documento', 'numero_documento', 'direccion', 'acudiente_nombre', 'acudiente_telefono', 'acudiente_email', 'acudiente_parentesco', 'es_menor_edad', 'documentos_entregados', 'grupo_sanguineo', 'alergias', 'condiciones_medicas', 'eps_salud'];
        const dateFields = ['fecha_nacimiento'];
        const safeData = {};
        for (const key of allowedFields) {
            if (updateData[key] !== undefined) {
                // Sanitize: empty strings -> null for date columns
                safeData[key] = (updateData[key] === '' && dateFields.includes(key)) ? null : updateData[key];
            }
        }

        const { error } = await supabaseAdmin
            .from('profiles')
            .update(safeData)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Perfil actualizado correctamente.'
        });

    } catch (error) {
        console.error('Error en manage-user API (PUT):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
