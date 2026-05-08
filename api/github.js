const https = require('https')

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url)
    https.get({ hostname: opts.hostname, path: opts.pathname + opts.search, headers }, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('Failed to parse response')) }
      })
    }).on('error', reject)
  })
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const username = 'fvcksptnngrh'
  const token = process.env.GITHUB_TOKEN

  const headers = {
    'User-Agent': 'portfolio-app',
    'Accept': 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {})
  }

  try {
    const user = await httpsGet(`https://api.github.com/users/${username}`, headers)
    res.end(JSON.stringify({
      followers: user.followers || 0,
      public_repos: user.public_repos || 0,
      following: user.following || 0,
      created_at: user.created_at || null,
      avatar_url: user.avatar_url,
      html_url: user.html_url
    }))
  } catch (err) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Failed to fetch GitHub stats' }))
  }
}
