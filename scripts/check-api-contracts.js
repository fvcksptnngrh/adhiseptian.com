const assert = require('assert')
const { EventEmitter } = require('events')
const https = require('https')

function withMockedHttps(responses, run) {
  const originalRequest = https.request
  const paths = []

  https.request = function (options, callback) {
    const request = new EventEmitter()
    const response = new EventEmitter()
    const next = responses.shift()

    paths.push(options.path)
    response.statusCode = next.status

    request.write = function () {}
    request.end = function () {
      process.nextTick(() => {
        callback(response)
        response.emit('data', JSON.stringify(next.data))
        response.emit('end')
      })
    }

    return request
  }

  return Promise.resolve()
    .then(() => run(paths))
    .finally(() => {
      https.request = originalRequest
    })
}

function invoke(handler, options) {
  return new Promise((resolve) => {
    const req = new EventEmitter()
    req.method = options.method || 'GET'
    req.headers = options.headers || {}

    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value
      },
      end(payload) {
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: payload ? String(payload) : ''
        })
      }
    }

    handler(req, res)

    process.nextTick(() => {
      if (options.body !== undefined) {
        req.emit('data', Buffer.from(JSON.stringify(options.body)))
      }
      req.emit('end')
    })
  })
}

async function main() {
  const names = ['wakatime', 'github', 'guestbook', 'engagements']
  for (const name of names) {
    assert.strictEqual(
      require(`../server-middleware/${name}.js`),
      require(`../api/${name}.js`),
      `${name} middleware must delegate to the production API handler`
    )
  }

  const guestbook = require('../api/guestbook')
  const guestbookPost = await invoke(guestbook, {
    method: 'POST',
    body: { name: 'Test', message: 'Hello' }
  })
  assert.strictEqual(guestbookPost.statusCode, 405, 'guestbook API POST must be disabled')

  const originalSupabaseUrl = process.env.SUPABASE_URL
  const originalSupabaseKey = process.env.SUPABASE_ANON_KEY
  process.env.SUPABASE_URL = 'https://project.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'

  try {
    await withMockedHttps([
      {
        status: 200,
        data: [{
          id: '21734c11-54eb-4720-a356-6dd33c3de447',
          user_id: '2227602c-eefd-46d7-b866-45b83511a220',
          message: 'Pinned owner message',
          created_at: '2026-01-01T00:00:00.000Z'
        }]
      },
      {
        status: 200,
        data: [
          { id: 'newest', created_at: '2026-07-17T10:00:00.000Z' },
          { id: 'older', created_at: '2026-07-16T10:00:00.000Z' }
        ]
      }
    ], async (paths) => {
      const response = await invoke(guestbook, { method: 'GET' })
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 200)
      assert.deepStrictEqual(
        body.map((message) => message.id),
        ['21734c11-54eb-4720-a356-6dd33c3de447', 'newest', 'older'],
        'guestbook must return the pinned row before newest-first ordinary rows'
      )
      assert.match(paths[0], /id=eq\.21734c11-54eb-4720-a356-6dd33c3de447/)
      assert.match(paths[0], /limit=1/)
      assert.match(paths[1], /id=neq\.21734c11-54eb-4720-a356-6dd33c3de447/)
      assert.match(paths[1], /order=created_at\.desc/)
      assert.match(paths[1], /limit=50/)
    })

    await withMockedHttps([
      { status: 404, data: [] },
      {
        status: 200,
        data: [
          { id: 'newest', created_at: '2026-07-17T10:00:00.000Z' },
          { id: 'older', created_at: '2026-07-16T10:00:00.000Z' }
        ]
      }
    ], async () => {
      const response = await invoke(guestbook, { method: 'GET' })
      assert.strictEqual(response.statusCode, 200)
      assert.deepStrictEqual(
        JSON.parse(response.body).map((message) => message.id),
        ['newest', 'older'],
        'guestbook must fall back to newest-first rows when the pin is unavailable'
      )
    })

    await withMockedHttps([
      { status: 200, data: [] },
      { status: 503, data: { error: 'ordinary query unavailable' } }
    ], async () => {
      const response = await invoke(guestbook, { method: 'GET' })
      assert.strictEqual(response.statusCode, 503)
      assert.deepStrictEqual(JSON.parse(response.body), { error: 'ordinary query unavailable' })
    })
  } finally {
    if (originalSupabaseUrl === undefined) delete process.env.SUPABASE_URL
    else process.env.SUPABASE_URL = originalSupabaseUrl
    if (originalSupabaseKey === undefined) delete process.env.SUPABASE_ANON_KEY
    else process.env.SUPABASE_ANON_KEY = originalSupabaseKey
  }

  const engagements = require('../api/engagements')
  const invalidPage = await invoke(engagements, {
    method: 'POST',
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
    body: { page: '/admin', type: 'view' }
  })
  assert.strictEqual(invalidPage.statusCode, 400, 'engagements must reject unknown pages')

  const invalidType = await invoke(engagements, {
    method: 'POST',
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
    body: { page: '/', type: 'share' }
  })
  assert.strictEqual(invalidType.statusCode, 400, 'engagements must reject unknown event types')

  const crossOrigin = await invoke(engagements, {
    method: 'POST',
    headers: { host: 'adhiseptian.com', origin: 'https://example.com' },
    body: { page: '/', type: 'view' }
  })
  assert.strictEqual(crossOrigin.statusCode, 403, 'engagements must reject cross-origin writes')

  console.log('API contracts passed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
