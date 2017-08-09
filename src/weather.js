// Description:
//   Weather Reporter for Singapore, based off API from data.gov.sg
//
// Dependencies:
//   None
//
// Configuration:
//   HUBOT_WEATHER_KEY: The API key from https://api.data.gov.sg
//
// Commands:
//   hubot weather area list - Return a list of areas
//   hubot weather <area> - Returns the 2 hour forecast for <area>
//   hubot daycast - Returns a 24hrs overall forecast for Singapore
//
// Notes:
//
// Author:
//   Yak Jun Xiang<snowypowers@gmail.com>
//

const w = require('../helper/weather.js')

module.exports = function (robot) {
  robot.respond(/weather area list/i, { id: 'weather.area.list', powerLevel: 2 }, (res) => {
    res.reply('These are the areas that I will respond to:')
    res.reply('```' + w.regions.join('\n') + '```')
    res.finish()
  })

  robot.respond(/weather(.*)/i, { id: 'weather.forecast', powerLevel: 3 }, (res) => {
    // Cleanup query
    if (res.match.length === 1) {
      res.reply('Hi there! Did you just mention the weather?')
      return
    }

    // Check if area exists
    let query = w.getMatch(res.match[1])
    if (query === '') {
      let match = w.getCloseMatch(res.match[1])
      if (match.length === 1) {
        res.reply(`I think you meant: \`${match}\``)
        query = match
      } else if (match.length > 0) {
        res.reply(`Did you mean: \`\`\`${match.join('\n')}\`\`\``)
        res.finish()
        return
      } else {
        res.reply(`Did you misspell the area? I couldn't find it! I got ${res.match[1]}`)
        res.finish()
        return
      }
    }
    // API Req
    w.get2HrCast(robot)((err, resp, body) => {
      if (err) {
        res.send(`Encountered an error :( ${err}`)
      } else {
        try {
          let data = JSON.parse(body)
          let weather = ''
          let forecasts = data.items[0].forecasts
          for (let i = 0; i < forecasts.length; i++) {
            if (forecasts[i].area === query) {
              weather = forecasts[i].forecast
              break
            }
          }
          res.reply(`It is ${weather} at ${query} now.`)
        } catch (e) {
          res.send(`Something went wrong with the API :( : ${e}`)
        }
      }
    })
  })

  robot.respond(/daycast/i, { id: 'weather.daycast', powerLevel: 3 }, (res) => {
    w.get24HrCast(robot)((err, resp, body) => {
      if (err) {
        res.send(`Encountered an error :( ${err}`)
      } else {
        try {
          let data = JSON.parse(body)
          let forecast = data.items[0].general.forecast
          let tempLow = data.items[0].general.temperature.low
          let tempHigh = data.items[0].general.temperature.high
          res.reply(`Today looks to be ${forecast} with temperatures of ${tempLow} to ${tempHigh}`)
        } catch (e) {
          res.send('Something went wrong with the response :(')
        }
      }
    })
  })

  robot.hear(/!weather/i, {id: 'weather.report', powerLevel: 3, rateLimit: 10000}, (res) => {

  })
}
