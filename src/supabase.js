import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eujqwpplhmtazchnibie.supabase.co'
const supabaseAnonKey = 'sb_publishable_XpIo64zbFDmlEjaR4ZldnA_VeKqJrcm'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)