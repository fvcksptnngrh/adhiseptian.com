export async function onRequestGet(context) {
  const username = 'fvcksptnngrh'
  const token = context.env.GITHUB_TOKEN

  const headers = {
    'User-Agent': 'portfolio-app',
    'Accept': 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {})
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, { headers })
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub stats')
    }
    const user = await response.json()
    
    return Response.json({
      followers: user.followers || 0,
      public_repos: user.public_repos || 0,
      following: user.following || 0,
      created_at: user.created_at || null,
      avatar_url: user.avatar_url,
      html_url: user.html_url
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    return Response.json({ error: 'Failed to fetch GitHub stats' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  }
}
