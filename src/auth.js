// Description:
//   Auth controls for the team
//
// Dependencies:
//   hubot-brain-redis
//
// Configuration:
//   None
//
// Commands:
//   auth @user <n> - Change @user to power level <n>
//   auth list - Displays everyone's rank
//   auth ban @user <t> - Bans @user for <t> minutes. Requires superuser.
//   auth clear @user's name - Unbans @user. Requires superuser.
// Notes:
//   None
//
// Author:
//   Yak Jun Xiang<yakjunxiang@gmail.com>

module.exports = function (robot) {
  let admin = robot.brain.userForName(process.env.HUBOT_AUTH_ADMIN)
  let auth = {}
  if (admin) {
    auth[admin.id] = 0
  }
  let bannedTill = {}

  robot.auth = auth
  robot.banned = bannedTill

  let notified = {}
  let powerLevel = [
    'admin',
    'superuser',
    'user',
    'teletubby',
    'nub',
    'unspeakable'
  ]

  let changeAuth = (userID, newLevel) => {
    auth[userID] = newLevel
  }

  let noAdmin = () => {
    for (let id in auth) {
      if (auth.hasOwnProperty(id) && auth[id] === 0) {
        return false
      }
    }
    return true
  }
  robot.brain.on('connected', function () {
    let oldSave = robot.brain.get('auth')
    if (oldSave) {
      auth = robot.brain.get('auth')
      bannedTill = robot.brain.get('banned')
      robot.auth = auth
      robot.banned = bannedTill
    }
  })
  robot.receiveMiddleware((context, next, done) => {
    let userID = context.response.message.user.id
    let authLevel
    if (auth[userID] == null) {
      authLevel = 2
      auth[userID] = 2
    } else {
      authLevel = auth[userID]
    }
    if (authLevel <= 3) {
      next(done)
    } else if (authLevel === 5) {
      context.response.message.finish()
      done()
    } else if (authLevel === 4 && Date.now() <= bannedTill[userID]) {
      if (notified[userID]) {
        done()
      } else {
        context.response.reply('You have been temporarily banned.')
        notified[userID] = true
        done()
      }
    } else {
      context.response.reply('You are now unbanned')
      changeAuth(userID, 2)
      delete bannedTill[userID]
      next(done)
    }
  })

  robot.listenerMiddleware((context, next, done) => {
    let requiredPower = context.listener.options.hasOwnProperty('powerLevel') ? context.listener.options.powerLevel : 2
    let userPower = auth.hasOwnProperty(context.response.message.user.id) ? auth[context.response.message.user.id] : 2
    if (userPower > requiredPower) {
      context.response.reply(`You are not authorised! you are only a mere ${powerLevel[userPower]}`)
      done()
    } else {
      next(done)
    }
  })

  robot.respond(/ban @([0-9a-z\-._]*)( ([0-9]*)?)/i, { id: 'auth.ban', powerLevel: 1 }, (res) => {
    let user = robot.brain.userForName(res.match[1])
    let period = res.match[2] ? parseInt(res.match[2]) : 10
    let duration = Date.now() + period * 60 * 1000
    changeAuth(user.id, 4)
    bannedTill[user.id] = duration
    res.send(`BAM ${user.name} has been banned for ${period.toString()} minutes`)
  })

  robot.respond(/clear @([0-9a-z\-._]*)'s name/i, { id: 'auth.clear', powerLevel: 1 }, (res) => {
    let user = robot.brain.userForName(res.match[1])
    if (auth[user.id] > 2) {
      changeAuth(user.id, 2)
      delete bannedTill[user.id]
    }
    res.reply(`has brought salvation upon ${user.name}`)
  })

  robot.respond(/auth$/i, { id: 'auth.check', powerLevel: 3 }, (res) => {
    let power = auth[res.message.user.id]
    if (power == null) {
      auth[res.message.user.id] = 2
      power = 2
    }
    res.reply(`You are a ${powerLevel[power]}`)
  })

  robot.respond(/auth list$/i, { id: 'auth.list', powerLevel: 3, rateLimit: 30000 }, (res) => {
    let output = '```'
    for (let id in auth) {
      if (auth.hasOwnProperty(id)) {
        let user = robot.brain.userForId(id)
        output += `${user.name}: ${powerLevel[auth[id]]}\n`
      }
    }
    output += '```\n**BANNED**\n```'
    for (let id in bannedTill) {
      if (bannedTill.hasOwnProperty(id)) {
        let user = robot.brain.userForId(id)
        let timeLeft = Math.floor((bannedTill[user.id] - Date.now()) / 60000)
        let units = 'mins'
        if (timeLeft > 60) {
          timeLeft = Math.floor(timeLeft / 60)
          units = 'hrs'
        }
        if (timeLeft > 24) {
          timeLeft = Math.floor(timeLeft / 24)
          units = 'days'
        }
        output += `${user.name}: ${timeLeft} ${units}\n`
      }
    }
    res.send(output + '```')
  })

  robot.respond(/auth @([0-9a-z\-._]*) ([1-9])/i, { id: 'auth.main', powerLevel: 0 }, (res) => {
    let user = robot.brain.userForName(res.match[1])
    let newPower = parseInt(res.match[2])
    changeAuth(user.id, newPower)
    res.reply(`${user.name} is granted the status of ${powerLevel[newPower]}!`)
  })

  robot.respond(/auth save$/i, { id: 'auth.save', powerLevel: 0 }, (res) => {
    robot.brain.set('auth', auth)
    robot.brain.set('banned', bannedTill)
    res.reply(`Settings saved!`)
  })

  robot.respond(/auth load$/i, { id: 'auth.load', powerLevel: 0 }, (res) => {
    let oldSave = robot.brain.get('auth')
    if (oldSave) {
      auth = robot.brain.get('auth')
      bannedTill = robot.brain.get('banned')
      robot.auth = auth
      robot.banned = bannedTill
      res.reply(`Loaded old settings`)
    } else {
      res.reply(`No old settings found`)
    }
  })

  robot.respond(/auth reset$/i, { id: 'auth.reset', powerLevel: 0 }, (res) => {
    auth = {}
    auth[admin.id] = 0
    bannedTill = {}
    robot.brain.set('auth', auth)
    robot.brain.set('banned', bannedTill)
  })

  robot.respond(/auth seize$/i, { id: 'auth.reset', powerLevel: 2 }, (res) => {
    if (noAdmin()) {
      auth[res.message.user.id] = 0
      res.send(`${res.message.user.name} has seized the throne!`)
    }
  })
}
