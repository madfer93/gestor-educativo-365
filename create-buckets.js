require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createBuckets() {
    const buckets = ['wellbeing-evidence', 'student-evidence', 'student-documents'];
    for (const b of buckets) {
        console.log('Attempting to create', b);
        const { data, error } = await supabase.storage.createBucket(b, { public: true });
        if (error) console.log('Error creating', b, error.message);
        else console.log('Created bucket:', b);
    }
}
createBuckets();
