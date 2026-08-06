var ALLOWED_PAGES = {
  '/': true,
  '/projects': true,
  '/dashboard': true,
  '/guestbook': true,
  '/about': true
}

var ALLOWED_TYPES = {
  view: true,
  reaction: true
}

function jsonResponse(data, status, extraHeaders) {
  var headers = { 'Content-Type': 'application/json' }
  if (extraHeaders) {
    var keys = Object.keys(extraHeaders)
    for (var i = 0; i < keys.length; i++) {
      headers[keys[i]] = extraHeaders[keys[i]]
    }
  }
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: headers
  })
}

function isAllowedOrigin(request) {
  var origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).host === new URL(request.url).host
  } catch (e) {
    return false
  }
}

export async function onRequest(context) {
  var request = context.request
  var env = context.env
  var origin = request.headers.get('origin')

  var corsHeaders = {}
  if (origin && isAllowedOrigin(request)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin
  }
  corsHeaders['Vary'] = 'Origin'
  corsHeaders['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type'

  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(request)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, corsHeaders)
    }
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (request.method !== 'GET' && request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
  }

  var supabaseUrl = env.SUPABASE_URL
  var supabaseKey = env.SUPABASE_ANON_KEY

  var baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  if (request.method === 'POST') {
    if (!isAllowedOrigin(request)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, corsHeaders)
    }

    try {
      var body = await request.text()
      if (body.length > 2048) {
        throw new Error('Request body too large')
      }

      var parsed
      try {
        parsed = body ? JSON.parse(body) : {}
      } catch (e) {
        throw new Error('Invalid JSON')
      }

      var page = (parsed.page || '').trim()
      var type = (parsed.type || 'view').trim()

      if (!ALLOWED_PAGES[page]) {
        return jsonResponse({ error: 'Invalid page' }, 400, corsHeaders)
      }

      if (!ALLOWED_TYPES[type]) {
        return jsonResponse({ error: 'Invalid engagement type' }, 400, corsHeaders)
      }

      if (!supabaseUrl || !supabaseKey) {
        return jsonResponse({ ok: false, configured: false }, 200, corsHeaders)
      }

      var postHeaders = {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }

      var result = await fetch(supabaseUrl + '/rest/v1/page_views', {
        method: 'POST',
        headers: postHeaders,
        body: JSON.stringify({ page: page, type: type })
      })

      if (result.status >= 400) {
        return jsonResponse({ error: 'Failed to record engagement' }, result.status, corsHeaders)
      }

      return jsonResponse({ ok: true }, 200, corsHeaders)
    } catch (e) {
      return jsonResponse({ error: e.message }, 400, corsHeaders)
    }
  }

  // GET — count views and reactions
  if (!supabaseUrl || !supabaseKey) {
    return jsonResponse({ views: 0, reactions: 0 }, 200, corsHeaders)
  }

  try {
    var countHeaders = {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'count=exact',
      'Range-Unit': 'items',
      'Range': '0-0'
    }

    var viewsRes = await fetch(
      supabaseUrl + '/rest/v1/page_views?type=eq.view&select=id',
      { headers: countHeaders }
    )

    var reactionsRes = await fetch(
      supabaseUrl + '/rest/v1/page_views?type=eq.reaction&select=id',
      { headers: countHeaders }
    )

    async function countFromResponse(res) {
      var cr = res.headers.get('content-range')
      var match = cr && cr.match(/\/(\d+)$/)
      if (match) return Number(match[1])

      var data = await res.json()
      return Array.isArray(data) ? data.length : 0
    }

    var counts = await Promise.all([
      countFromResponse(viewsRes),
      countFromResponse(reactionsRes)
    ])

    return jsonResponse({
      views: counts[0],
      reactions: counts[1]
    }, 200, corsHeaders)
  } catch (e) {
    return jsonResponse({ views: 0, reactions: 0 }, 200, corsHeaders)
  }
}
