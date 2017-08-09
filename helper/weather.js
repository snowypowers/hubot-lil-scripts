
// String toTitleCase helper
const toTitleCase = function (s) {
  return s.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

const regions = [
  'Ang Mo Kio',
  'Bedok',
  'Bishan',
  'Boon Lay',
  'Bukit Batok',
  'Bukit Merah',
  'Bukit Panjang',
  'Bukit Timah',
  'Central Water Catchment',
  'Changi',
  'Choa Chu Kang',
  'Clementi',
  'City',
  'Geylang',
  'Hougang',
  'Jalan Bahar',
  'Jurong East',
  'Jurong Island',
  'Jurong West',
  'Kallang',
  'Lim Chu Kang',
  'Mandai',
  'Marine Parade',
  'Novena',
  'Pasir Ris',
  'Paya Lebar',
  'Pioneer',
  'Pulau Tekong',
  'Pulau Ubin',
  'Punggol',
  'Queenstown',
  'Seletar',
  'Sembawang',
  'Sengkang',
  'Sentosa',
  'Serangoon',
  'Southern Islands',
  'Sungei Kadut',
  'Tampines',
  'Tanglin',
  'Tengah',
  'Toa Payoh',
  'Tuas',
  'Western Islands',
  'Western Water Catchment',
  'Woodlands',
  'Yishun'
]

const alias = {
  'Amk': 'Ang Mo Kio',
  'Bd': 'Bedok',
  'Bs': 'Bishan',
  'Bl': 'Boon Lay',
  'Bkb': 'Bukit Batok',
  'Bkm': 'Bukit Merah',
  'Bkp': 'Bukit Panjang',
  'Bkt': 'Bukit Timah',
  'Ctw': 'Central Water Catchment',
  'Ci': 'Changi',
  'Cck': 'Choa Chu Kang',
  'Cmt': 'Clementi',
  'Ct': 'City',
  'Gl': 'Geylang',
  'Hg': 'Hougang',
  'Jlb': 'Jalan Bahar',
  'Je': 'Jurong East',
  'Ji': 'Jurong Island',
  'Jw': 'Jurong West',
  'Kl': 'Kallang',
  'Lck': 'Lim Chu Kang',
  'Md': 'Mandai',
  'Mp': 'Marine Parade',
  'Nvn': 'Novena',
  'Psr': 'Pasir Ris',
  'Pyl': 'Paya Lebar',
  'Pn': 'Pioneer',
  'Plt': 'Pulau Tekong',
  'Plu': 'Pulau Ubin',
  'Pg': 'Punggol',
  'Qt': 'Queenstown',
  'Slt': 'Seletar',
  'Sbw': 'Sembawang',
  'Sk': 'Sengkang',
  'Sts': 'Sentosa',
  'Srg': 'Serangoon',
  'Sti': 'Southern Islands',
  'Sgk': 'Sungei Kadut',
  'Tpn': 'Tampines',
  'Tl': 'Tanglin',
  'Tg': 'Tengah',
  'Tpy': 'Toa Payoh',
  'T': 'Tuas',
  'Wti': 'Western Islands',
  'Wtw': 'Western Water Catchment',
  'Wl': 'Woodlands',
  'Ys': 'Yishun'
}

const get2HrCast = (robot) => {
  return robot.http('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
    .header('api-key', process.env.HUBOT_WEATHER_KEY)
    .get()
}

const get24HrCast = (robot) => {
  return robot.http('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast')
    .header('api-key', process.env.HUBOT_WEATHER_KEY)
    .get()
}

const getAlias = (query) => {
  if (query in alias) {
    return alias[query]
  } else {
    return ''
  }
}

const getCloseMatch = (query) => {
  query = minimize(query)
  let bestMatch = []
  let bestScore = 0
  for (let i = 0; i < regions.length; i++) {
    let newScore = score(query, minimize(regions[i]))
    if (newScore > bestScore) {
      bestMatch = [regions[i]]
      bestScore = newScore
    } else if (newScore === bestScore && bestScore > 0) {
      bestMatch.push(regions[i])
    }
  }
  if (bestMatch.length > 0) return bestMatch
  else return []
}

const getExact = (query) => {
  if (regions.includes(query)) {
    return query
  } else {
    return ''
  }
}

const getMatch = (query) => {
  query = sanitizeQuery(query)
  let match
  match = getExact(query)
  if (match) return match
  match = getAlias(query)
  if (match) return match
  return ''
}

const minimize = (query) => {
  return query.toLowerCase().replace(/\s/g, '')
}

const sanitizeQuery = (query) => {
  return toTitleCase(query.trim())
}

const score = (candidate, standard) => {
  let bestScore = 0
  for (let i = 0; i < candidate.length; i++) {
    for (let j = i + 1; j < candidate.length; j++) {
      if (standard.match(candidate.substr(i, j)) && bestScore < j - i) {
        bestScore = j - i
      }
    }
  }
  return bestScore
}

module.exports = {
  get2HrCast,
  get24HrCast,
  getMatch,
  getCloseMatch,
  regions,
  helpers: {
    getAlias,
    getExact,
    minimize,
    sanitizeQuery,
    score
  }
}
