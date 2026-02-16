const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer .env.local manualmente
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLeads() {
    console.log("Checking leads table columns...");
    // Intentar obtener una fila para ver las columnas
    const { data, error } = await supabase.from('leads').select('*').limit(1);

    if (error) {
        console.error("Error fetching leads:", error.message);
        if (error.message.includes('column "school_id" does not exist')) {
            console.log("CONFIRMED: Column 'school_id' is missing.");
        }
    } else {
        if (data && data.length > 0) {
            console.log("Columns found in leads row:", Object.keys(data[0]));
        } else {
            console.log("No data in leads table. Trying to filter to check column existence...");
            const { error: filterError } = await supabase.from('leads').select('*').eq('school_id', '00000000-0000-0000-0000-000000000000').limit(1);
            if (filterError) {
                console.error("Filtering by school_id failed:", filterError.message);
            } else {
                console.log("Filtering by school_id worked (column exists).");
            }
        }
    }
}

checkLeads();
