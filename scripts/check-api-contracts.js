const assert = require('assert')
const { EventEmitter } = require('events')

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
