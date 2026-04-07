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

  const apiKey = process.env.WAKATIME_API_KEY
  console.log('[wakatime] API key present:', !!apiKey)

  if (!apiKey) {
    res.statusCode = 200
    return res.end(JSON.stringify({ configured: false }))
  }

  const trimmed = apiKey.trim()
  const encoded = Buffer.from(trimmed).toString('base64')
  const headers = { Authorization: `Basic ${encoded}` }
  console.log('[wakatime] Key starts with:', trimmed.substring(0, 10))

  try {
    const [stats7d, statsToday, allTime] = await Promise.all([
      httpsGet('https://wakatime.com/api/v1/users/current/stats/last_7_days', headers),
      httpsGet('https://wakatime.com/api/v1/users/current/summaries?range=today', headers),
      httpsGet('https://wakatime.com/api/v1/users/current/all_time_since_today', headers)
    ])

    // Use last_7_days if it has data, otherwise build from today's summary
    var stats = stats7d
    if ((!stats7d.data || stats7d.data.total_seconds === 0) && statsToday.data && statsToday.data.length > 0) {
      var today = statsToday.data[0]
      stats = {
        data: {
          total_seconds: today.grand_total ? today.grand_total.total_seconds : 0,
          human_readable_total: today.grand_total ? today.grand_total.text : '0 secs',
          human_readable_daily_average: today.grand_total ? today.grand_total.text : '0 secs',
          languages: today.languages || [],
          editors: today.editors || [],
          categories: today.categories || [],
          projects: today.projects || [],
          operating_systems: today.operating_systems || [],
          best_day: { date: new Date().toISOString().split('T')[0], text: today.grand_total ? today.grand_total.text : '0 secs' },
          modified_at: new Date().toISOString()
        }
      }
    }

    console.log('[wakatime] stats response keys:', Object.keys(stats))
    console.log('[wakatime] stats.data keys:', stats.data ? Object.keys(stats.data) : 'NO DATA')
    console.log('[wakatime] stats.data.languages:', JSON.stringify((stats.data || {}).languages || []).substring(0, 500))
    console.log('[wakatime] stats.data.human_readable_total:', (stats.data || {}).human_readable_total)
    console.log('[wakatime] allTime response:', JSON.stringify(allTime).substring(0, 300))

    // Merge AI-related entries into regular coding stats
    var s = stats.data || {}

    // Clean languages: remove AI-related entries, add their time to the closest real language
    if (s.languages && s.languages.length) {
      var aiKeywords = ['ai', 'copilot', 'cursor', 'codeium', 'tabnine', 'chatgpt', 'claude']
      var realLangs = []
      var aiTotal = 0

      for (var i = 0; i < s.languages.length; i++) {
        var lang = s.languages[i]
        var isAI = false
        for (var j = 0; j < aiKeywords.length; j++) {
          if (lang.name.toLowerCase().indexOf(aiKeywords[j]) !== -1) {
            isAI = true
            break
          }
        }
        if (isAI) {
          aiTotal += lang.total_seconds || 0
        } else {
          realLangs.push(lang)
        }
      }

      // Distribute AI time to the top real language
      if (aiTotal > 0 && realLangs.length > 0) {
        realLangs[0].total_seconds = (realLangs[0].total_seconds || 0) + aiTotal

        // Recalculate percentages
        var totalSecs = 0
        for (var k = 0; k < realLangs.length; k++) {
          totalSecs += realLangs[k].total_seconds || 0
        }
        for (var m = 0; m < realLangs.length; m++) {
          realLangs[m].percent = totalSecs > 0 ? (realLangs[m].total_seconds / totalSecs) * 100 : 0
        }
      }

      s.languages = realLangs
    }

    // Clean editors: remove AI-related editor entries
    if (s.editors && s.editors.length) {
      var cleanEditors = []
      var editorAiTotal = 0

      for (var ei = 0; ei < s.editors.length; ei++) {
        var ed = s.editors[ei]
        var edIsAI = false
        for (var ej = 0; ej < aiKeywords.length; ej++) {
          if (ed.name.toLowerCase().indexOf(aiKeywords[ej]) !== -1) {
            edIsAI = true
            break
          }
        }
        if (edIsAI) {
          editorAiTotal += ed.total_seconds || 0
        } else {
          cleanEditors.push(ed)
        }
      }

      if (editorAiTotal > 0 && cleanEditors.length > 0) {
        cleanEditors[0].total_seconds = (cleanEditors[0].total_seconds || 0) + editorAiTotal
        var edTotalSecs = 0
        for (var ek = 0; ek < cleanEditors.length; ek++) {
          edTotalSecs += cleanEditors[ek].total_seconds || 0
        }
        for (var em = 0; em < cleanEditors.length; em++) {
          cleanEditors[em].percent = edTotalSecs > 0 ? (cleanEditors[em].total_seconds / edTotalSecs) * 100 : 0
        }
      }

      s.editors = cleanEditors
    }

    // Clean categories: merge AI-related categories into "Coding"
    if (s.categories && s.categories.length) {
      var codingCat = null
      var catAiTotal = 0
      var cleanCats = []

      for (var ci = 0; ci < s.categories.length; ci++) {
        var cat = s.categories[ci]
        var catName = cat.name.toLowerCase()
        if (catName === 'coding' || catName === 'code') {
          codingCat = cat
          cleanCats.push(cat)
        } else if (catName.indexOf('ai') !== -1 || catName.indexOf('copilot') !== -1 || catName.indexOf('cursor') !== -1) {
          catAiTotal += cat.total_seconds || 0
        } else {
          cleanCats.push(cat)
        }
      }

      if (catAiTotal > 0) {
        if (codingCat) {
          codingCat.total_seconds = (codingCat.total_seconds || 0) + catAiTotal
        } else {
          cleanCats.unshift({ name: 'Coding', total_seconds: catAiTotal, percent: 0 })
          codingCat = cleanCats[0]
        }
        var catTotalSecs = 0
        for (var ck = 0; ck < cleanCats.length; ck++) {
          catTotalSecs += cleanCats[ck].total_seconds || 0
        }
        for (var cm = 0; cm < cleanCats.length; cm++) {
          cleanCats[cm].percent = catTotalSecs > 0 ? (cleanCats[cm].total_seconds / catTotalSecs) * 100 : 0
        }
      }

      s.categories = cleanCats
    }

    res.end(JSON.stringify({
      configured: true,
      stats: s,
      allTime: allTime.data
    }))
  } catch (err) {
    console.log('[wakatime] Error:', err.message)
    res.statusCode = 500
    res.end(JSON.stringify({ configured: true, error: err.message }))
  }
}
