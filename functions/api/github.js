export async function onRequest(context) {
  const token = context.env.GITHUB_TOKEN
  const username = 'fvcksptnngrh'

  const headers = {
    'User-Agent': 'portfolio-app',
    'Accept': 'application/vnd.github.v3+json',
    ...(token ? { Authorization: 'token ' + token } : {})
  }

  const responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  try {
    const res = await fetch('https://api.github.com/users/' + username, { headers: headers })
    const user = await res.json()

    return new Response(JSON.stringify({
      followers: user.followers || 0,
      public_repos: user.public_repos || 0,
      avatar_url: user.avatar_url,
      html_url: user.html_url
    }), {
      headers: responseHeaders
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch GitHub stats' }), {
      status: 500,
      headers: responseHeaders
    })
  }
}
