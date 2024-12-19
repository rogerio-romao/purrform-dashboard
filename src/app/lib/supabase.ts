'use server';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    throw new Error('Missing env variables for Supabase');
}

// Create a single supabase client for interacting with your database
export const createServerSupabaseClient = () => {
    return createClient(SUPABASE_URL, SUPABASE_API_KEY);
};
