export default ({ app }) => {
  app.router.afterEach(function (to) {
    var page = to.path || '/'

    // Record a page view for every navigation
    fetch('/api/engagements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: page, type: 'view' })
    }).catch(function () {})

    // Record a reaction when visiting dashboard or about
    if (page === '/dashboard' || page === '/about') {
      fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page, type: 'reaction' })
      }).catch(function () {})
    }
  })
}
