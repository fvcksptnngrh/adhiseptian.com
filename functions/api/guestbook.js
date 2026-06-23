export async function onRequest(context) {
  const { request } = context
  const { method } = request

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers })
  }

  if (method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
  }

  const supabaseUrl = context.env.SUPABASE_URL
  const supabaseKey = context.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500, headers })
  }

  const supabaseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  const endpoint = `${supabaseUrl}/rest/v1/guestbook?select=*&order=created_at.desc&limit=50`
  
  try {
    const response = await fetch(endpoint, { headers: supabaseHeaders })
    const data = await response.json()
    return Response.json(data, { status: response.status, headers })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers })
  }
}
