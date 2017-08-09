// Description:
//   Hubot Query API for Neo blockchain
//
// Dependencies:
//   hubot-brain-redis
//
// Configuration:
//   None
//
// Notes:
//   This module reads options.rateLimit on each command and limits the rate of calling that command within a room / DM.
//   Default is 1000ms.
// Author:
//   Yak Jun Xiang <yakjunxiang@gmail.com>
//

module.exports = function (robot) {
  const lastExecutedTime = {}
  robot.listenerMiddleware((context, next, done) => {
    let listenerID = context.listener.options.id
    if (!listenerID) {
      next()
      return
    }
    try {
      let minPeriodMs, roomOrUser, listenerAndRoom
      minPeriodMs = context.listener.options.rateLimit || 1000

      if (context.response.message.user.room) {
        roomOrUser = context.response.message.user.room
      } else {
        roomOrUser = context.response.message.user.name
      }
      listenerAndRoom = listenerID + '_' + roomOrUser
      if (lastExecutedTime.hasOwnProperty(listenerAndRoom) && lastExecutedTime[listenerAndRoom] > Date.now() - minPeriodMs) {
        context.response.reply('Slow down!')
        done()
      } else {
        next(() => {
          lastExecutedTime[listenerAndRoom] = Date.now()
          done()
        })
      }
    } catch (err) {
      robot.emit('error', err, context.response)
    }
  })
}
