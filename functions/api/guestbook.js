const PINNED_COMMENT_ID = '21734c11-54eb-4720-a356-6dd33c3de447'

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
  const pinnedEndpoint = `${supabaseUrl}/rest/v1/guestbook?select=*&id=eq.${PINNED_COMMENT_ID}&limit=1`
  const messagesEndpoint = `${supabaseUrl}/rest/v1/guestbook?select=*&id=neq.${PINNED_COMMENT_ID}&order=created_at.desc&limit=50`

  try {
    const [pinned, messagesResponse] = await Promise.all([
      fetch(pinnedEndpoint, { headers: supabaseHeaders })
        .then(async (response) => {
          if (!response.ok) return []
          const data = await response.json()
          return Array.isArray(data) ? data.slice(0, 1) : []
        })
        .catch(() => []),
      fetch(messagesEndpoint, { headers: supabaseHeaders })
    ])
    const messages = await messagesResponse.json()

    if (!messagesResponse.ok) {
      return Response.json(messages, { status: messagesResponse.status, headers })
    }

    return Response.json(
      pinned.concat(Array.isArray(messages) ? messages : []),
      { status: messagesResponse.status, headers }
    )
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers })
  }
}
