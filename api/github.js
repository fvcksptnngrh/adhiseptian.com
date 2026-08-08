const https = require('https')

const USERNAME = 'fvcksptnngrh'

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url)
    https.get({ hostname: opts.hostname, path: opts.pathname + opts.search, headers }, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        let body
        try { body = JSON.parse(data || '{}') }
        catch (e) { return reject(new Error('Failed to parse GitHub response')) }
        resolve({ status: res.statusCode, headers: res.headers || {}, body })
      })
    }).on('error', reject)
  })
}

function send(res, status, body) {
  res.statusCode = status
  res.end(JSON.stringify(body))
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    return send(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
  }

  const token = process.env.GITHUB_TOKEN
  const headers = {
    'User-Agent': 'adhiseptian-portfolio',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  try {
    const result = await httpsGet(`https://api.github.com/users/${USERNAME}`, headers)
    if (result.status < 200 || result.status >= 300) {
      if (result.status === 403 && result.headers['x-ratelimit-remaining'] === '0') {
        const reset = result.headers['x-ratelimit-reset']
        return send(res, 429, {
          error: 'GitHub API rate limit exceeded. Configure GITHUB_TOKEN in Cloudflare Pages.',
          code: 'GITHUB_RATE_LIMITED',
          reset_at: reset ? new Date(Number(reset) * 1000).toISOString() : null
        })
      }
      return send(res, 502, {
        error: result.body && result.body.message ? `GitHub API error: ${result.body.message}` : 'GitHub API request failed',
        code: 'GITHUB_API_ERROR',
        upstream_status: result.status
      })
    }

    return send(res, 200, {
      followers: result.body.followers,
      public_repos: result.body.public_repos,
      following: result.body.following,
      created_at: result.body.created_at || null,
      avatar_url: result.body.avatar_url || null,
      html_url: result.body.html_url || null,
      authenticated: Boolean(token)
    })
  } catch (err) {
    return send(res, 502, { error: 'Unable to reach the GitHub API', code: 'GITHUB_NETWORK_ERROR' })
  }
}
