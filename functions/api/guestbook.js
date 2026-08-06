export async function onRequest(context) {
  var request = context.request
  var env = context.env

  var corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    })
  }

  var supabaseUrl = env.SUPABASE_URL
  var supabaseKey = env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 500,
      headers: corsHeaders
    })
  }

  try {
    var endpoint = supabaseUrl + '/rest/v1/guestbook?select=*&order=created_at.desc&limit=50'
    var res = await fetch(endpoint, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'application/json'
      }
    })
    var responseBody = await res.text()
    var data
    try {
      data = JSON.parse(responseBody || '[]')
    } catch (e) {
      data = responseBody
    }

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: corsHeaders
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    })
  }
}
