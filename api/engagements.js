var https = require('https')
var url = require('url')

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

function send(res, status, payload) {
  res.statusCode = status
  res.end(JSON.stringify(payload))
}

function isAllowedOrigin(req) {
  var origin = req.headers.origin
  if (!origin) return true

  try {
    return new URL(origin).host === req.headers.host
  } catch (e) {
    return false
  }
}

function readJsonBody(req) {
  return new Promise(function (resolve, reject) {
    var body = ''

    req.on('data', function (chunk) {
      body += chunk
      if (body.length > 2048) {
        reject(new Error('Request body too large'))
      }
    })

    req.on('end', function () {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(new Error('Invalid JSON'))
      }
    })

    req.on('error', reject)
  })
}

function supabaseRequest(method, path, headers, body) {
  return new Promise(function (resolve, reject) {
    var opts = url.parse(path)
    var reqOpts = {
      hostname: opts.hostname,
      path: opts.path,
      method: method,
      headers: headers
    }
    var req = https.request(reqOpts, function (res) {
      var data = ''
      res.on('data', function (chunk) { data += chunk })
      res.on('end', function () {
        var parsed = data
        try { parsed = JSON.parse(data || '[]') } catch (e) {}
        resolve({ status: res.statusCode, data: parsed, headers: res.headers || {} })
      })
    })
    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

function countFromResult(result) {
  var contentRange = result.headers['content-range']
  var match = contentRange && contentRange.match(/\/(\d+)$/)
  if (match) return Number(match[1])
  return Array.isArray(result.data) ? result.data.length : 0
}

module.exports = async function (req, res) {
  var origin = req.headers.origin
  if (origin && isAllowedOrigin(req)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    if (!isAllowedOrigin(req)) return send(res, 403, { error: 'Origin not allowed' })
    res.statusCode = 204
    return res.end()
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' })
  }

  var supabaseUrl = process.env.SUPABASE_URL
  var supabaseKey = process.env.SUPABASE_ANON_KEY

  var baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  if (req.method === 'POST') {
    if (!isAllowedOrigin(req)) return send(res, 403, { error: 'Origin not allowed' })

    try {
      var parsed = await readJsonBody(req)
      var page = (parsed.page || '').trim()
      var type = (parsed.type || 'view').trim()

      if (!ALLOWED_PAGES[page]) {
        return send(res, 400, { error: 'Invalid page' })
      }

      if (!ALLOWED_TYPES[type]) {
        return send(res, 400, { error: 'Invalid engagement type' })
      }

      if (!supabaseUrl || !supabaseKey) {
        return send(res, 200, { ok: false, configured: false })
      }

      var postHeaders = Object.assign({}, baseHeaders, { 'Prefer': 'return=minimal' })
      var endpoint = supabaseUrl + '/rest/v1/page_views'
      var result = await supabaseRequest('POST', endpoint, postHeaders, {
        page: page,
        type: type
      })

      if (result.status >= 400) {
        return send(res, result.status, { error: 'Failed to record engagement' })
      }

      return send(res, 200, { ok: true })
    } catch (e) {
      return send(res, 400, { error: e.message })
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    return send(res, 200, { views: 0, reactions: 0 })
  }

  try {
    var countHeaders = Object.assign({}, baseHeaders, {
      'Prefer': 'count=exact',
      'Range-Unit': 'items',
      'Range': '0-0'
    })

    var allViews = await supabaseRequest(
      'GET',
      supabaseUrl + '/rest/v1/page_views?type=eq.view&select=id',
      countHeaders,
      null
    )

    var allReactions = await supabaseRequest(
      'GET',
      supabaseUrl + '/rest/v1/page_views?type=eq.reaction&select=id',
      countHeaders,
      null
    )

    return send(res, 200, {
      views: countFromResult(allViews),
      reactions: countFromResult(allReactions)
    })
  } catch (e) {
    return send(res, 200, { views: 0, reactions: 0 })
  }
}
