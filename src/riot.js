// Description:
//   Pitchforks!
//
// Dependencies:
//   hubot-brain-redis
//
// Configuration:
//   None
//
// Commands:
//   riot! - Returns a random pitchfork
//   !fight @someone - Start a pitchfork fight with someone
// Notes:
//   None
//
// Author:
//   Yak Jun Xiang<yakjunxiang@gmail.com>
//

const pitchforks = {
  traditional: {
    fork: '---E',
    power: 5
  },
  leftHanded: {
    fork: 'Ǝ---',
    power: 3
  },
  fancy: {
    fork: '---{',
    power: 2
  },
  euro: {
    fork: '---€',
    power: 7
  },
  pound: {
    fork: '---£',
    power: 8
  },
  lira: {
    fork: '---₤',
    power: 9
  },
  yen: {
    fork: '---¥',
    power: 1
  },
  mace: {
    fork: '---¤',
    power: 4
  }
}

const forks = Object.keys(pitchforks)

const randomFork = () => {
  const key = forks[Math.floor(Math.random() * forks.length)]
  return pitchforks[key]
}

const fightMsgs = [
  "$loser has first hand experience of $winner's fork up the ass.",
  '$winner has a bigger tool than $loser. Too bad.',
  '$winner bashes $loser on the head. Well it works.',
  'It was an epic fight but it all boiled down to who had the bigger fork. $winner did.',
  '$loser forgot to sharpen his fork. $winner sliced him like a sausage.'
]

const formatFight = (winner, loser) => {
  let msg = fightMsgs[Math.floor(Math.random() * fightMsgs.length)]
  msg = msg.replace(/\$winner/g, winner)
  msg = msg.replace(/\$loser/g, loser)
  return msg + `\n :tada: ${winner} wins! :tada:`
}

module.exports = function (robot) {
  robot.hear(/riot!/i, { id: 'riot.riot', powerLevel: 3 }, (res) => {
    res.send(`Raise your pitchforks! ${randomFork().fork}`)
  })

  robot.hear(/!fight @([0-9a-zA-Z\-._]*)/, { id: 'riot.fight', powerLevel: 3 }, (res) => {
    let user = res.message.user
    let opponent = robot.brain.userForName(res.match[1])
    if (opponent) {
      let pf1 = randomFork()
      let pf2 = randomFork()
      let fight = pf1.power >= pf2.power ? formatFight(user.name, opponent.name) : formatFight(opponent.name, user.name)
      let msg = `${user.name} brings out ${pf1.fork}\n ${opponent.name} brings out ${pf2.fork}`
      res.send(msg + '\n' + fight)
    } else {
      res.reply(`Who are you fighting?`)
    }
  })
}
