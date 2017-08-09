// Description:
//   Bombing Pugs and Cats around
//
// Dependencies:
//   None
//
// Configuration:
//   HUBOT_CATME_KEY: The API key from http://thecatapi.com
//
// Commands:
//   hubot pug me - Throws a pug at user
//   hubot pug bomb <n> - Throws <n> pugs at user, capped at 10
//   hubot cat me - Throws a cat at user
//   hubot cat bomb <n> - Throws <n> cats at user, capped at 10
//
// Notes:
//
//
// Author:
//   Yak Jun Xiang<yakjunxiang@gmail.com>

const $ = require('cheerio')

module.exports = function (robot) {
  const HUBOT_CATME_KEY = process.env.HUBOT_CATME_KEY

  robot.respond(/pug me$/i, { id: 'pug.me', powerLevel: 3 }, (res) => {
    robot.http('http://pugme.herokuapp.com/random')
      .get()((err, resp, body) => {
        if (err) {
          res.reply(`Something went wrong with the HTTP req :(`)
          return
        }
        res.send(JSON.parse(body).pug)
      })
  })

  robot.respond(/pug bomb( (\d+))?/i, { id: 'pug.bomb', powerLevel: 2 }, (res) => {
    let count = res.match[2] || 5
    count = count > 10 ? 10 : count
    robot.http('http://pugme.herokuapp.com/bomb?count=' + count)
      .get()((err, res, body) => {
        if (err) {
          res.reply(`Something went wrong with the HTTP req :(`)
          return
        }
        try {
          let pugs = JSON.parse(body).pugs
          for (let i = 0; i < count; i++) {
            res.send(pugs[i])
          }
        } catch (e) {
          res.reply(`Something went wrong with the API :( : ${e}`)
        }
      })
  })

  robot.respond(/cat me$/i, { id: 'cat.me', powerLevel: 3 }, (res) => {
    robot.http(`http://thecatapi.com/api/images/get?format=xml&api_key=${HUBOT_CATME_KEY}`)
      .get()((err, resp, body) => {
        if (err) {
          res.reply(`Something went wrong with the HTTP req :(`)
          return
        }
        res.send($(body).find('url').text())
      })
  })

  robot.respond(/cat bomb( (\d+))?/i, { id: 'cat.bomb', powerLevel: 2 }, (res) => {
    let count = res.match[2] || 5
    count = count > 10 ? 10 : count
    robot.http(`http://thecatapi.com/api/images/get?format=xml&results_per_page=${count.toString()}&api_key=${HUBOT_CATME_KEY}`)
      .get()((err, resp, body) => {
        if (err) {
          res.reply(`Something went wrong with the HTTP req :(`)
          return
        }
        try {
          let imgs = $(body).find('url')
          for (let i = 0; i < count; i++) {
            res.send($(imgs[i]).text())
          }
        } catch (e) {
          res.reply(`Something went wrong with the API :( : ${e}`)
        }
      })
  })
}
