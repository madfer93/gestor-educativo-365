import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: Obtener planes activos (Público)
export async function GET(req) {
    try {
        const { data, error } = await supabase
            .from('pricing_plans')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Actualizar un plan (Protegido - Simulado con Key o Sesión)
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        // Aquí deberías validar la sesión del SuperAdmin
        // Por ahora, confiamos en la RLS de Supabase o en que esta ruta solo se llame desde el panel admin

        const { data, error } = await supabase
            .from('pricing_plans')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
