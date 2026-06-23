export async function onRequestGet(context) {
  const apiKey = context.env.WAKATIME_API_KEY

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })

  if (!apiKey) {
    return Response.json({ configured: false }, { headers })
  }

  const trimmed = apiKey.trim()
  // In Cloudflare Workers, btoa is available for base64 encoding
  const encoded = btoa(trimmed)
  const wakatimeHeaders = { Authorization: `Basic ${encoded}` }

  try {
    const [stats7dRes, statsTodayRes, allTimeRes] = await Promise.all([
      fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', { headers: wakatimeHeaders }),
      fetch('https://wakatime.com/api/v1/users/current/summaries?range=today', { headers: wakatimeHeaders }),
      fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', { headers: wakatimeHeaders })
    ])

    const stats7d = await stats7dRes.json()
    const statsToday = await statsTodayRes.json()
    const allTime = await allTimeRes.json()

    // Use last_7_days if it has data, otherwise build from today's summary
    let stats = stats7d
    if ((!stats7d.data || stats7d.data.total_seconds === 0) && statsToday.data && statsToday.data.length > 0) {
      const today = statsToday.data[0]
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

    // Merge AI-related entries into regular coding stats
    const s = stats.data || {}

    // Clean languages: remove AI-related entries, add their time to the closest real language
    if (s.languages && s.languages.length) {
      const aiKeywords = ['ai', 'copilot', 'cursor', 'codeium', 'tabnine', 'chatgpt', 'claude']
      const realLangs = []
      let aiTotal = 0

      for (const lang of s.languages) {
        let isAI = false
        for (const keyword of aiKeywords) {
          if (lang.name.toLowerCase().includes(keyword)) {
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
        let totalSecs = 0
        for (const lang of realLangs) {
          totalSecs += lang.total_seconds || 0
        }
        for (const lang of realLangs) {
          lang.percent = totalSecs > 0 ? (lang.total_seconds / totalSecs) * 100 : 0
        }
      }

      s.languages = realLangs
    }

    // Clean editors: remove AI-related editor entries
    if (s.editors && s.editors.length) {
      const aiKeywords = ['ai', 'copilot', 'cursor', 'codeium', 'tabnine', 'chatgpt', 'claude']
      const cleanEditors = []
      let editorAiTotal = 0

      for (const ed of s.editors) {
        let edIsAI = false
        for (const keyword of aiKeywords) {
          if (ed.name.toLowerCase().includes(keyword)) {
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
        let edTotalSecs = 0
        for (const ed of cleanEditors) {
          edTotalSecs += ed.total_seconds || 0
        }
        for (const ed of cleanEditors) {
          ed.percent = edTotalSecs > 0 ? (ed.total_seconds / edTotalSecs) * 100 : 0
        }
      }

      s.editors = cleanEditors
    }

    // Clean categories: merge AI-related categories into "Coding"
    if (s.categories && s.categories.length) {
      const aiKeywords = ['ai', 'copilot', 'cursor', 'codeium', 'tabnine', 'chatgpt', 'claude']
      let codingCat = null
      let catAiTotal = 0
      const cleanCats = []

      for (const cat of s.categories) {
        const catName = cat.name.toLowerCase()
        if (catName === 'coding' || catName === 'code') {
          codingCat = cat
          cleanCats.push(cat)
        } else {
          let isAI = false
          for (const keyword of aiKeywords) {
            if (catName.includes(keyword)) {
              isAI = true
              break
            }
          }
          if (isAI) {
            catAiTotal += cat.total_seconds || 0
          } else {
            cleanCats.push(cat)
          }
        }
      }

      if (catAiTotal > 0) {
        if (codingCat) {
          codingCat.total_seconds = (codingCat.total_seconds || 0) + catAiTotal
        } else {
          cleanCats.unshift({ name: 'Coding', total_seconds: catAiTotal, percent: 0 })
          codingCat = cleanCats[0]
        }
        let catTotalSecs = 0
        for (const cat of cleanCats) {
          catTotalSecs += cat.total_seconds || 0
        }
        for (const cat of cleanCats) {
          cat.percent = catTotalSecs > 0 ? (cat.total_seconds / catTotalSecs) * 100 : 0
        }
      }

      s.categories = cleanCats
    }

    return Response.json({
      configured: true,
      stats: s,
      allTime: allTime.data
    }, { headers })
  } catch (err) {
    return Response.json({ configured: true, error: err.message }, { status: 500, headers })
  }
}
