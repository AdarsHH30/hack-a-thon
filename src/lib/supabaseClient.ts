import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chtlwpeyfrwalskfdlvn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodGx3cGV5ZnJ3YWxza2ZkbHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODg3NzgsImV4cCI6MjA3Mzk2NDc3OH0.-teE0DS7hFy1SpAdXX6sRuZvDEjl2kJP68pk2EEUPbM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

