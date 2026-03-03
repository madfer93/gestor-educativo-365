import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Wompi Webhook Endpoint
 * Receives payment events from Wompi and records them in pagos_estudiantes
 * 
 * Wompi event structure:
 * {
 *   event: "transaction.updated",
 *   data: {
 *     transaction: {
 *       id: "xxx",
 *       status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR",
 *       amount_in_cents: 15000000,
 *       reference: "student_id-concepto-timestamp",
 *       payment_method_type: "CARD" | "PSE" | "NEQUI",
 *       customer_email: "...",
 *       created_at: "..."
 *     }
 *   },
 *   signature: { checksum: "...", properties: [...] }
 * }
 */

export async function POST(req) {
    try {
        const body = await req.json();
        const { event, data, signature } = body;

        // Only process transaction updates
        if (event !== 'transaction.updated') {
            return NextResponse.json({ status: 'ignored' });
        }

        const transaction = data?.transaction;
        if (!transaction) {
            return NextResponse.json({ error: 'Missing transaction data' }, { status: 400 });
        }

        // Signature validation (optional but recommended)
        if (signature?.checksum) {
            // Wompi sends properties to concatenate for checksum
            // Format: concat(property values in order) + events_secret -> SHA256
            const properties = signature.properties || [];
            let concatenated = '';
            for (const prop of properties) {
                const value = prop.split('.').reduce((obj, key) => obj?.[key], data);
                concatenated += value;
            }

            // Try to find the school's webhook secret
            const reference = transaction.reference || '';
            const schoolSlug = reference.split('-')[0]; // First part of reference could be school slug

            let webhookSecret = process.env.WOMPI_EVENTS_SECRET || '';
            if (schoolSlug) {
                const { data: schoolData } = await supabase
                    .from('schools')
                    .select('wompi_webhook_secret')
                    .eq('slug', schoolSlug)
                    .single();
                if (schoolData?.wompi_webhook_secret) {
                    webhookSecret = schoolData.wompi_webhook_secret;
                }
            }

            if (webhookSecret) {
                const expectedChecksum = crypto
                    .createHash('sha256')
                    .update(concatenated + webhookSecret)
                    .digest('hex');

                if (expectedChecksum !== signature.checksum) {
                    console.error("🚫 [WEBHOOK/WOMPI] Checksum inválido");
                    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
                }
            }
        }

        // Only record APPROVED transactions
        if (transaction.status !== 'APPROVED') {
            return NextResponse.json({ status: 'noted', transaction_status: transaction.status });
        }

        // Parse the reference to extract info
        // Expected format: schoolSlug-studentId-concepto-timestamp or just free text
        const reference = transaction.reference || 'Pago Wompi';
        const amountCOP = transaction.amount_in_cents / 100;

        // Try to find the school based on reference or customer info
        let schoolId = null;
        let studentId = null;
        const refParts = reference.split('-');

        if (refParts.length >= 2) {
            // Try to find school by slug
            const { data: schoolData } = await supabase
                .from('schools')
                .select('id')
                .eq('slug', refParts[0])
                .single();
            if (schoolData) {
                schoolId = schoolData.id;
                studentId = refParts[1] || null;
            }
        }

        // If no school found via reference, try to find any school with this Wompi config
        if (!schoolId) {
            const { data: schools } = await supabase
                .from('schools')
                .select('id')
                .not('wompi_url', 'is', null)
                .limit(1);
            if (schools?.length > 0) {
                schoolId = schools[0].id;
            }
        }

        // Record the payment
        const paymentRecord = {
            school_id: schoolId,
            student_id: studentId,
            monto: amountCOP,
            concepto: reference,
            metodo_pago: `Wompi ${transaction.payment_method_type || 'Online'}`,
            estado: 'aprobado',
            referencia_pago: transaction.id,
            fecha_pago: transaction.created_at || new Date().toISOString(),
            notas: `Pago automático via Wompi. Email: ${transaction.customer_email || 'N/A'}. Ref: ${transaction.id}`
        };

        const { data: insertedPayment, error: insertError } = await supabase
            .from('pagos_estudiantes')
            .insert([paymentRecord])
            .select();

        if (insertError) {
            console.error("❌ [WEBHOOK/WOMPI] Error al insertar pago:", insertError);
            // Still return 200 to Wompi so it doesn't retry
            return NextResponse.json({ status: 'error_recording', error: insertError.message });
        }

        return NextResponse.json({
            status: 'success',
            payment_id: insertedPayment?.[0]?.id,
            amount: amountCOP
        });

    } catch (error) {
        console.error("💥 [WEBHOOK/WOMPI] Error crítico:", error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// Wompi also sends GET to verify endpoint is active
export async function GET() {
    return NextResponse.json({
        status: 'active',
        service: 'Colegio Latinoamericano - Wompi Webhook',
        timestamp: new Date().toISOString()
    });
}
