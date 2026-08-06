function hasAiKeyword(name, keywords) {
  var normalizedName = name.toLowerCase()
  for (var i = 0; i < keywords.length; i++) {
    if (normalizedName.indexOf(keywords[i]) !== -1) return true
  }
  return false
}

export async function onRequest(context) {
  var apiKey = context.env.WAKATIME_API_KEY
  var responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ configured: false }), {
      headers: responseHeaders
    })
  }

  var trimmed = apiKey.trim()
  var encoded = btoa(trimmed)
  var headers = { Authorization: 'Basic ' + encoded }

  try {
    var responses = await Promise.all([
      fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', { headers: headers }),
      fetch('https://wakatime.com/api/v1/users/current/summaries?range=today', { headers: headers }),
      fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', { headers: headers })
    ])

    var data = await Promise.all([
      responses[0].json(),
      responses[1].json(),
      responses[2].json()
    ])
    var stats7d = data[0]
    var statsToday = data[1]
    var allTime = data[2]

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
          best_day: {
            date: new Date().toISOString().split('T')[0],
            text: today.grand_total ? today.grand_total.text : '0 secs'
          },
          modified_at: new Date().toISOString()
        }
      }
    }

    // Merge AI-related entries into regular coding stats
    var s = stats.data || {}
    var aiKeywords = ['ai', 'copilot', 'cursor', 'codeium', 'tabnine', 'chatgpt', 'claude']

    // Clean languages: remove AI-related entries, add their time to the closest real language
    if (s.languages && s.languages.length) {
      var realLangs = []
      var aiTotal = 0

      for (var i = 0; i < s.languages.length; i++) {
        var lang = s.languages[i]
        if (hasAiKeyword(lang.name, aiKeywords)) {
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
        if (hasAiKeyword(ed.name, aiKeywords)) {
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

    return new Response(JSON.stringify({
      configured: true,
      stats: s,
      allTime: allTime.data
    }), {
      headers: responseHeaders
    })
  } catch (err) {
    return new Response(JSON.stringify({ configured: true, error: err.message }), {
      status: 500,
      headers: responseHeaders
    })
  }
}
