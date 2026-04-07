var https = require('https')
var url = require('url')

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
        try { resolve({ status: res.statusCode, data: JSON.parse(data || '[]') }) }
        catch (e) { resolve({ status: res.statusCode, data: data }) }
      })
    })
    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

module.exports = async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    return res.end()
  }

  var supabaseUrl = process.env.SUPABASE_URL
  var supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 200
    return res.end(JSON.stringify({ views: 0, reactions: 0 }))
  }

  var baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  // POST — record a page view or reaction
  if (req.method === 'POST') {
    var body = ''
    req.on('data', function (chunk) { body += chunk })
    req.on('end', async function () {
      try {
        var parsed = JSON.parse(body)
        var page = (parsed.page || '').trim()
        var type = parsed.type || 'view' // 'view' or 'reaction'

        if (!page) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'page is required' }))
        }

        var postHeaders = Object.assign({}, baseHeaders, { 'Prefer': 'return=minimal' })
        var endpoint = supabaseUrl + '/rest/v1/page_views'
        await supabaseRequest('POST', endpoint, postHeaders, {
          page: page,
          type: type
        })

        res.statusCode = 200
        res.end(JSON.stringify({ ok: true }))
      } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid request' }))
      }
    })
    return
  }

  // GET — return aggregated stats
  if (req.method === 'GET') {
    try {
      // Count all views
      var viewsResult = await supabaseRequest(
        'GET',
        supabaseUrl + '/rest/v1/page_views?type=eq.view&select=id',
        Object.assign({}, baseHeaders, { 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }),
        null
      )

      // Count all reactions (dashboard + about visits)
      var reactionsResult = await supabaseRequest(
        'GET',
        supabaseUrl + '/rest/v1/page_views?type=eq.reaction&select=id',
        Object.assign({}, baseHeaders, { 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }),
        null
      )

      // Parse count from content-range header — Supabase returns count in response
      // Since we can't read headers easily, count array length or use RPC
      // Alternative: just count all rows
      var allViews = await supabaseRequest(
        'GET',
        supabaseUrl + '/rest/v1/page_views?type=eq.view&select=id',
        baseHeaders,
        null
      )

      var allReactions = await supabaseRequest(
        'GET',
        supabaseUrl + '/rest/v1/page_views?type=eq.reaction&select=id',
        baseHeaders,
        null
      )

      var views = Array.isArray(allViews.data) ? allViews.data.length : 0
      var reactions = Array.isArray(allReactions.data) ? allReactions.data.length : 0

      res.statusCode = 200
      res.end(JSON.stringify({ views: views, reactions: reactions }))
    } catch (e) {
      res.statusCode = 200
      res.end(JSON.stringify({ views: 0, reactions: 0 }))
    }
    return
  }

  res.statusCode = 405
  res.end(JSON.stringify({ error: 'Method not allowed' }))
}
