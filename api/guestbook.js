var https = require('https')
var url = require('url')

var PINNED_COMMENT_ID = '21734c11-54eb-4720-a356-6dd33c3de447'

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

module.exports = function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    return res.end()
  }

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  var supabaseUrl = process.env.SUPABASE_URL
  var supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Supabase not configured' }))
  }

  var headers = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }
  var pinnedEndpoint = supabaseUrl + '/rest/v1/guestbook?select=*&id=eq.' + PINNED_COMMENT_ID + '&limit=1'
  var messagesEndpoint = supabaseUrl + '/rest/v1/guestbook?select=*&id=neq.' + PINNED_COMMENT_ID + '&order=created_at.desc&limit=50'

  Promise.all([
    supabaseRequest('GET', pinnedEndpoint, headers, null).catch(function () {
      return { status: 500, data: [] }
    }),
    supabaseRequest('GET', messagesEndpoint, headers, null)
  ])
    .then(function (results) {
      var pinnedResult = results[0]
      var messagesResult = results[1]

      if (messagesResult.status < 200 || messagesResult.status >= 300) {
        res.statusCode = messagesResult.status
        return res.end(JSON.stringify(messagesResult.data))
      }

      var pinned = pinnedResult.status >= 200 && pinnedResult.status < 300 && Array.isArray(pinnedResult.data)
        ? pinnedResult.data.slice(0, 1)
        : []
      var messages = Array.isArray(messagesResult.data) ? messagesResult.data : []

      res.statusCode = messagesResult.status
      res.end(JSON.stringify(pinned.concat(messages)))
    })
    .catch(function (err) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: err.message }))
    })
}
