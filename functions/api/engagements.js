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

function configurationError(corsHeaders) {
  return jsonResponse({
    error: 'Supabase is not configured for this deployment',
    code: 'SUPABASE_NOT_CONFIGURED',
    configured: false
  }, 503, corsHeaders)
}

function upstreamError(corsHeaders, status) {
  return jsonResponse({
    error: 'Unable to query engagement data from Supabase',
    code: 'SUPABASE_QUERY_FAILED',
    configured: true,
    upstream_status: status || null
  }, 502, corsHeaders)
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
        return configurationError(corsHeaders)
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
        return upstreamError(corsHeaders, result.status)
      }

      return jsonResponse({ ok: true, configured: true }, 200, corsHeaders)
    } catch (e) {
      return jsonResponse({ error: e.message, code: 'INVALID_ENGAGEMENT_REQUEST' }, 400, corsHeaders)
    }
  }

  // GET — count views and reactions
  if (!supabaseUrl || !supabaseKey) {
    return configurationError(corsHeaders)
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

    if (!viewsRes.ok) return upstreamError(corsHeaders, viewsRes.status)
    if (!reactionsRes.ok) return upstreamError(corsHeaders, reactionsRes.status)

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
      configured: true,
      views: counts[0],
      reactions: counts[1]
    }, 200, corsHeaders)
  } catch (e) {
    return upstreamError(corsHeaders)
  }
}
