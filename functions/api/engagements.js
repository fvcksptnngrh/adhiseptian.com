export async function onRequest(context) {
  const { request } = context
  const { method } = request
  
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  // Handle OPTIONS
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  if (method !== 'GET' && method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
  }

  const supabaseUrl = context.env.SUPABASE_URL
  const supabaseKey = context.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (method === 'POST') {
      return Response.json({ ok: false, configured: false }, { headers })
    }
    return Response.json({ views: 0, reactions: 0 }, { headers })
  }

  const baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  if (method === 'POST') {
    try {
      const body = await request.json()
      const page = (body.page || '').trim()
      const type = (body.type || 'view').trim()

      const ALLOWED_PAGES = {
        '/': true,
        '/projects': true,
        '/dashboard': true,
        '/guestbook': true,
        '/about': true
      }

      const ALLOWED_TYPES = {
        view: true,
        reaction: true
      }

      if (!ALLOWED_PAGES[page] || !ALLOWED_TYPES[type]) {
        return Response.json({ error: 'Invalid page or engagement type' }, { status: 400, headers })
      }

      const endpoint = `${supabaseUrl}/rest/v1/page_views`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { ...baseHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ page, type })
      })

      if (!response.ok) {
        return Response.json({ error: 'Failed to record engagement' }, { status: response.status, headers })
      }

      return Response.json({ ok: true }, { headers })
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400, headers })
    }
  }

  // Handle GET
  try {
    const countHeaders = {
      ...baseHeaders,
      'Prefer': 'count=exact',
      'Range-Unit': 'items',
      'Range': '0-0'
    }

    const [viewsRes, reactionsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/page_views?type=eq.view&select=id`, { headers: countHeaders }),
      fetch(`${supabaseUrl}/rest/v1/page_views?type=eq.reaction&select=id`, { headers: countHeaders })
    ])

    const getCount = (res) => {
      const contentRange = res.headers.get('content-range')
      const match = contentRange && contentRange.match(/\/(\d+)$/)
      return match ? Number(match[1]) : 0
    }

    return Response.json({
      views: getCount(viewsRes),
      reactions: getCount(reactionsRes)
    }, { headers })
  } catch (e) {
    return Response.json({ views: 0, reactions: 0 }, { headers })
  }
}
