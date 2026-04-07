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

module.exports = function (req, res) {
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
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Supabase not configured' }))
  }

  var baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': 'Bearer ' + supabaseKey,
    'Content-Type': 'application/json'
  }

  // GET — fetch all messages
  if (req.method === 'GET') {
    var endpoint = supabaseUrl + '/rest/v1/guestbook?select=*&order=created_at.desc&limit=50'
    supabaseRequest('GET', endpoint, baseHeaders, null)
      .then(function (result) {
        res.statusCode = result.status
        res.end(JSON.stringify(result.data))
      })
      .catch(function (err) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: err.message }))
      })
    return
  }

  // POST — add new message
  if (req.method === 'POST') {
    var body = ''
    req.on('data', function (chunk) { body += chunk })
    req.on('end', function () {
      try {
        var parsed = JSON.parse(body)
        var name = (parsed.name || '').trim()
        var message = (parsed.message || '').trim()

        if (!name || !message) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'Name and message are required' }))
        }

        if (name.length > 50) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'Name too long (max 50 chars)' }))
        }

        if (message.length > 500) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'Message too long (max 500 chars)' }))
        }

        var postHeaders = Object.assign({}, baseHeaders, {
          'Prefer': 'return=representation'
        })

        var endpoint = supabaseUrl + '/rest/v1/guestbook'
        supabaseRequest('POST', endpoint, postHeaders, { name: name, message: message })
          .then(function (result) {
            res.statusCode = result.status
            res.end(JSON.stringify(result.data))
          })
          .catch(function (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          })
      } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  res.statusCode = 405
  res.end(JSON.stringify({ error: 'Method not allowed' }))
}
