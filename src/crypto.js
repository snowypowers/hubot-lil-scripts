// Description:
//   Crypto-currency Report, based off API from Crypto-Compare
//
// Dependencies:
//   hubot-brain-redis
//
// Configuration:
//   None
//
// Commands:
//   XXX->YYY - Returns the price of 1 XXX in YYY. Eg: BTC->USD
//   ? XXX->YYY - Returns the price of ? XXX in YYY. Eg: 5 BTC->ETH
//   !crypto - Display your crypto report
//   hubot xxx/yyy - Same as XXX->YYY but with more relaxed rulings
//   hubot crypto add xxx/yyy - Add pair xxx/yyy to your crypto report
//   hubot crypto remove xxx/yyy - Remove pair xxx/yyy from your crypto report
//   hubot crypto list - Show your crypto report settings
// Notes:
//   None
//
// Author:
//   Yak Jun Xiang<yakjunxiang@gmail.com>
//

const getPair = require('../helper/crypto.js')

module.exports = function (robot) {
  let crypto = {}

  robot.brain.on('connected', function () {
    if (robot.brain.get('crypto')) {
      crypto = robot.brain.get('crypto')
    } else {
      robot.brain.set('crypto', crypto)
    }
  })
  robot.hear(/([0-9.]*)? ?([A-Z]{3,})->([A-Z]{3,})/, { id: 'crypto.getpair', powerLevel: 3 }, (res) => {
    getPair(robot, res.match[2], res.match[3]).then((data) => {
      try {
        let amt = parseFloat(res.match[1])
        if (isNaN(amt)) {
          amt = 1
        }
        const conversion = parseFloat(data[res.match[3]])
        if (isNaN(conversion)) {
          throw new Error('Conversion should be parsable')
        }
        res.reply(`${amt} ${res.match[2]} -> ${amt * conversion} ${res.match[3]}`)
      } catch (e) {
        res.reply(`Something went wrong with the response :( ${e}`)
      }
    }, (err) => res.reply(err))
  })

  robot.respond(/([A-Za-z]{3,})\/([A-Za-z]{3,})$/, { id: 'crypto.getpair', powerLevel: 3 }, (res) => {
    const fs = res.match[1].toUpperCase()
    const ts = res.match[2].toUpperCase()
    getPair(robot, fs, ts).then((data) => {
      try {
        const conversion = parseFloat(data[ts])
        if (isNaN(conversion)) {
          throw new Error('Conversion should be parsable')
        }
        res.reply(`1 ${fs} -> ${conversion} ${ts}`)
      } catch (e) {
        res.reply(`Something went wrong with the response :( ${e}`)
      }
    }, (err) => res.reply(err))
  })

  robot.respond(/crypto add ([A-Za-z]{3,})\/([A-Za-z]{3,})$/, { id: 'crypto.add', powerLevel: 3 }, (res) => {
    const fs = res.match[1].toUpperCase()
    const ts = res.match[2].toUpperCase()
    const query = fs + '/' + ts
    if (!crypto[res.message.user.id]) {
      crypto[res.message.user.id] = []
    }
    const report = crypto[res.message.user.id]
    if (report.indexOf(query) >= 0) {
      res.reply(`This query is already added!`)
    } else {
      getPair(robot, fs, ts).then(function (result) {
        if (result) {
          report.push(query)
          res.reply(`Added ${query}`)
        }
      }, function () {
        res.reply('This is an invalid pair ಠ_ಠ')
      })
    }
  })

  robot.respond(/crypto remove ([A-Za-z]{3})\/([A-Za-z]{3})$/, { id: 'crypto.remove', powerLevel: 3 }, (res) => {
    const query = res.match[1].toUpperCase() + '/' + res.match[2].toUpperCase()
    const report = crypto[res.message.user.id]
    if (report && report.indexOf(query) >= 0) {
      report.splice(report.indexOf(query), 1)
      res.reply(`Removed ${query}`)
    } else {
      res.reply(`Your report does not have this pair `)
    }
  })

  robot.respond(/crypto list/i, { id: 'crypto.list', powerLevel: 3 }, (res) => {
    const report = crypto[res.message.user.id]
    if (!report) {
      res.reply('¯\\_(ツ)_/¯ Use `crypto add` to add pairs to your report')
    } else {
      res.reply(report.join(', '))
    }
  })

  robot.hear(/!crypto$/i, { id: 'crypto.report', powerLevel: 2 }, (res) => {
    const report = crypto[res.message.user.id]
    if (!report) {
      res.reply('¯\\_(ツ)_/¯ Use `crypto add` to add pairs to your report')
    } else {
      const promises = []
      for (const pair of report) {
        const sym = pair.split('/')
        promises.push(getPair(robot, sym[0], sym[1]))
      }
      Promise.all(promises).then((vals) => {
        let lines = vals.map((val, ind, arr) => {
          const pair = report[ind]
          const sym = pair.split('/')
          return `1 ${sym[0]} -> ${val[sym[1]]} ${sym[1]}`
        })
        res.reply(lines.join(`\n`))
      })
    }
  })
}
