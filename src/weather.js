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
  let weather = {}

  robot.brain.on('connected', function () {
    if (robot.brain.get('weather')) {
      weather = robot.brain.get('weather')
    } else {
      robot.brain.set('weather', weather)
    }
  })

  robot.respond(/weather areas/i, { id: 'weather.areas', powerLevel: 2, rateLimit: 60000 }, (res) => {
    res.reply('These are the areas that I will respond to:')
    res.reply('```' + w.regions.join('\n') + '```')
    res.finish()
  })

  robot.respond(/weather$/, { id: 'weather.main', powerLevel: 3 }, (res) => {
    if (weather[res.message.user.id]) {
      let area = weather[res.message.user.id][0]
      w.get2HrCast(robot, area).then((data) => {
        res.reply(`It is ${data[area]} at ${area} now.`)
      }, (err) => res.reply(err))
    } else {
      res.reply('Hi there! Did you just mention the weather?')
    }
  })

  robot.respond(/weather add (.+)/, { id: 'weather.add', powerLevel: 3 }, (res) => {
    if (!weather[res.message.user.id]) weather[res.message.user.id] = []
    const query = w.attemptMatch(res.match[1])
    if (query.match) {
      if (query.info) res.reply(query.info)
      if (weather[res.message.user.id].indexOf(query.match) === -1) {
        weather[res.message.user.id].push(query.match)
        res.reply(`${query.match} added`)
      } else {
        res.reply(`You already have this area added!`)
      }
    } else {
      res.reply(query.info)
    }
    res.finish()
  })

  robot.respond(/weather remove (.+)/, { id: 'weather.remove', powerLevel: 3 }, (res) => {
    if (!weather[res.message.user.id]) {
      res.reply(`You do not have any areas!`)
      res.finish()
      return
    }
    const query = w.attemptMatch(res.match[1])
    if (query.match) {
      if (query.err) res.reply(query.err)
      const ind = weather[res.message.user.id].indexOf(query.match)
      if (ind >= 0) {
        weather[res.message.user.id].splice(ind, 1)
        res.reply(`${query.match} removed`)
      } else {
        res.reply(`You do not have this area in your report!`)
      }
    } else {
      res.reply(query.err)
    }
    res.finish()
  })

  robot.respond(/weather list/i, { id: 'weather.list', powerLevel: 3 }, (res) => {
    if (weather[res.message.user.id]) {
      res.reply(weather[res.message.user.id].join(', '))
    } else {
      res.reply('You do not have any areas')
    }
    res.finish()
  })

  robot.respond(/daycast/i, { id: 'weather.daycast', powerLevel: 3 }, (res) => {
    w.get24HrCast(robot).then((data) => {
      res.reply(`Today looks to be ${data.forecast} with temperatures of ${data.tempLow} to ${data.tempHigh}`)
    }, (err) => res.reply(err))
  })

  robot.respond(/weather (.+)/i, { id: 'weather.forecast', powerLevel: 3 }, (res) => {
    // Check if area exists
    let query = w.attemptMatch(res.match[1])
    if (query.match) {
      if (query.err) res.reply(query.err)
      query = query.match
    } else {
      res.reply(query.err)
      res.finish()
      return
    }

    // API Req
    w.get2HrCast(robot, query).then((data) => {
      res.reply(`It is ${data[query]} at ${query} now.`)
    }, (err) => res.reply(err))
  })

  robot.hear(/!weather/i, { id: 'weather.report', powerLevel: 3, rateLimit: 10000 }, (res) => {
    let one, two
    one = w.get24HrCast(robot).then((data) => {
      return `Today's 24hrs forecast: ${data.forecast} ${data.tempLow}/${data.tempHigh}`
    })
    if (weather[res.message.user.id]) {
      two = w.get2HrCast(robot, weather[res.message.user.id]).then((data) => {
        let s = '```'
        for (const key in data) {
          if (data.hasOwnProperty(key)) s += `${key}: ${data[key]}\n`
        }
        return s + '```'
      })
    } else {
      two = null
    }
    Promise.all([one, two]).then((vals) => {
      res.reply(vals.join('\n'))
    })
  })
}
