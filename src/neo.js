// Description:
//   Hubot Query API for Neo blockchain
//
// Dependencies:
//   hubot-brain-redis
//
// Configuration:
//   HUBOT_NEO_ADDR - The url for the full node
//
// Commands:
//   hubot neo block <hash|index> - Get block. Accepts hash and index
//   hubot neo height - Get the current height of the blockchain
//   hubot neo transaction <hash> - Get transaction
//
// Author:
//   Yak Jun Xiang <yakjunxiang@gmail.com>
//

const methods = require('../helper/neo.js')
const printBlock = methods.printBlock
const printTxn = methods.printTxn

module.exports = function (robot) {
  let url = 'http://seed5.neo.org:10332'
  if (process.env.HUBOT_NEO_ADDR) {
    url = process.env.HUBOT_NEO_ADDR
  }

  const req = methods.createReq(robot, url)

  robot.respond(/neo block (.*)$/i, { id: 'neo.block', rateLimit: 5000 }, (res) => {
    let hashOrInd = res.match[1]
    if (!isNaN(parseInt(res.match[1]))) {
      hashOrInd = parseInt(res.match[1])
    } else if (hashOrInd.length !== 64) {
      res.reply('Hash is not 64 long!')
    }
    req('getblock', [hashOrInd, 1])((err, resp, body) => {
      if (err) {
        res.reply(`Something went wrong with the API :( : ${err}`)
        res.finish()
        return
      }
      try {
        let data = JSON.parse(body)
        res.reply('\n' + printBlock(data.result))
        res.finish()
      } catch (e) {
        res.reply(`Something went wrong with the Response :( : ${e}`)
        res.finish()
      }
    })
  })

  robot.respond(/neo transaction (.*)$/i, { id: 'neo.transaction', rateLimit: 5000 }, (res) => {
    if (res.match[1].length !== 64) {
      res.reply('The hash is not 64 long!')
    }
    req('getrawtransaction', [res.match[1], 1])((err, resp, body) => {
      if (err) {
        res.reply(`Something went wrong with the API :( : ${err}`)
        res.finish()
        return
      }
      try {
        let data = JSON.parse(body)
        res.reply('\n' + printTxn(data.result))
        res.finish()
      } catch (e) {

      }
    })
  })

  robot.respond(/neo height$/i, { id: 'neo.height', rateLimit: 5000 }, (res) => {
    req('getblockcount', [])((err, resp, body) => {
      if (err) {
        res.reply(`Something went wrong with the API :( : ${err}`)
        res.finish()
        return
      }
      try {
        let data = JSON.parse(body)
        res.reply(`The current blockheight is \`${data.result}\`.`)
      } catch (e) {
        res.reply(`Something went wrong with the Response :( : ${e}`)
        res.finish()
      }
    })
  })

  // robot.respond(/neo address (.*)$/i, { id: "neo.address" }, function (res) => {
  //   return
  // })
}
