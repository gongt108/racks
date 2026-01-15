import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_PROJECT_URL;
const supabasePublishableAPIKey = import.meta.env.SUPABASE_PUBLISHABLE_API_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableAPIKey
)