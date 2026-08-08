const USERNAME = 'fvcksptnngrh'

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  })
}

function rateLimitReset(headers) {
  var reset = headers.get('x-ratelimit-reset')
  return reset ? new Date(Number(reset) * 1000).toISOString() : null
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, 405)
  }

  const token = context.env.GITHUB_TOKEN
  const headers = {
    'User-Agent': 'adhiseptian-portfolio',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: 'Bearer ' + token } : {})
  }

  try {
    const response = await fetch('https://api.github.com/users/' + USERNAME, { headers: headers })
    const body = await response.json()

    if (!response.ok) {
      if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        return jsonResponse({
          error: 'GitHub API rate limit exceeded. Configure GITHUB_TOKEN in Cloudflare Pages.',
          code: 'GITHUB_RATE_LIMITED',
          reset_at: rateLimitReset(response.headers)
        }, 429)
      }

      return jsonResponse({
        error: body && body.message ? 'GitHub API error: ' + body.message : 'GitHub API request failed',
        code: 'GITHUB_API_ERROR',
        upstream_status: response.status
      }, 502)
    }

    return jsonResponse({
      followers: body.followers,
      public_repos: body.public_repos,
      following: body.following,
      created_at: body.created_at || null,
      avatar_url: body.avatar_url || null,
      html_url: body.html_url || null,
      authenticated: Boolean(token)
    })
  } catch (err) {
    return jsonResponse({
      error: 'Unable to reach the GitHub API',
      code: 'GITHUB_NETWORK_ERROR'
    }, 502)
  }
}
