import { createClient } from '@supabase/supabase-js'

export default function ({ $config }, inject) {
  var url = $config.supabaseUrl || ''
  var key = $config.supabaseKey || ''

  if (!url || !key) {
    console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  }

  var supabase = createClient(url, key)
  inject('supabase', supabase)
}
