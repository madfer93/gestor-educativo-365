import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const bucket = formData.get('bucket') || 'documentos';
        const filePath = formData.get('filePath');

        if (!file || !filePath) {
            return NextResponse.json({ error: 'Falta el archivo o la ruta (filePath).' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceKey) {
            // Attempt manual fallback load for Next.js dev server quirks
            try {
                require('dotenv').config({ path: '.env.local' });
                supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            } catch (e) { }
        }

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({
                error: `Faltan credenciales del servidor. URL: ${!!supabaseUrl}, KEY: ${!!supabaseServiceKey}`
            }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(bucket)
            .upload(filePath, file, {
                upsert: true, // Overwrite if exists
            });

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl }, { status: 200 });
    } catch (error) {
        console.error('API Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
