// Supabase Configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table names
const TABLES = {
    CLIENTS: 'clients',
    EXPENSES: 'expenses', 
    PAYMENTS: 'payments',
    EMPLOYEES: 'employees'
};

// Project status types
const PROJECT_STATUS = {
    CURRENT: 'Current',
    PENDING: 'Pending', 
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

// Payment status types
const PAYMENT_STATUS = {
    PAID: 'Paid',
    PENDING: 'Pending'
};

// Configuration for auto-refresh
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

// Toast notification configuration
const TOAST_DURATION = 3000; // 3 seconds