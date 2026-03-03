// Supabase Configuration
const SUPABASE_URL = 'https://nppcwprqiizrrnlrdeog.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Da6jkHHH8owADDFhVxdHQw_HLwgLaUb';

// Initialize Supabase client
const supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Storage helpers
const STORAGE = {
    photos: {
        bucket: 'photos',
        getPublicUrl: (path) => `${SUPABASE_URL}/storage/v1/object/public/photos/${path}`,
    },
    documents: {
        bucket: 'documents',
    },
};
