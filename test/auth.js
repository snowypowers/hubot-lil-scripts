const Tester = require('hubot-test-helper')
const chai = require('chai')
const expect = chai.expect

process.env.HUBOT_AUTH_ADMIN = 'Alice'
const helper = new Tester('../src/auth.js')

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}

describe('Auth', function () {
  var room
  process.env.HUBOT_AUTH_ADMIN = 'Alice'
  beforeEach('brain setup', function () {
    room = helper.createRoom()
    room.robot.brain.userForName('Alice', { name: 'Alice', id: 'Alice' })
    room.robot.brain.userForName('Bob', { name: 'Bob', id: 'Bob' })
    room.robot.brain.userForName('Charlie', { name: 'Charlie', id: 'Charlie' })
    room.robot.brain.userForName('Dick', { name: 'Dick', id: 'Dick' })
    room.robot.brain.userForName('Eve', { name: 'Eve', id: 'Eve' })
    room.robot.brain.userForName('Frank', { name: 'Frank', id: 'Frank' })
    room.robot.brain.userForId('Alice', { name: 'Alice', id: 'Alice' })
    room.robot.brain.userForId('Bob', { name: 'Bob', id: 'Bob' })
    room.robot.brain.userForId('Charlie', { name: 'Charlie', id: 'Charlie' })
    room.robot.brain.userForId('Dick', { name: 'Dick', id: 'Dick' })
    room.robot.brain.userForId('Eve', { name: 'Eve', id: 'Eve' })
    room.robot.brain.userForId('Frank', { name: 'Frank', id: 'Frank' })
    room.robot.brain.set('auth', { 'Alice': 0, 'Bob': 1, 'Charlie': 2, 'Dick': 3, 'Eve': 4, 'Frank': 5 })
    room.robot.brain.set('banned', { 'Eve': Date.now() + 1000000 })
    return room.user.say('Alice', 'hubot auth seize')
      .then(function () {
        room.user.say('Alice', 'hubot auth load')
        room.user.say('Omega', 'hubot auth list')
        return delayPromise(100)
      })
      .then(function () {
        room.messages = []
      })
  })

  afterEach('teardown', function () {
    room.destroy()
  })

  describe('Roles', function () {
    it('Alice is admin', function () {
      return room.user.say('Alice', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot auth'],
            ['hubot', `@Alice You are a admin`]
          ])
        })
    })

    it('Bob is superuser', function () {
      return room.user.say('Bob', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.eql([
            ['Bob', 'hubot auth'],
            ['hubot', `@Bob You are a superuser`]
          ])
        })
    })

    it('Charlie is user', function () {
      return room.user.say('Charlie', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.eql([
            ['Charlie', 'hubot auth'],
            ['hubot', `@Charlie You are a user`]
          ])
        })
    })

    it('Dick is restricted', function () {
      return room.user.say('Dick', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.eql([
            ['Dick', 'hubot auth'],
            ['hubot', `@Dick You are a teletubby`]
          ])
        })
    })

    it('Eve is banned', function () {
      return room.user.say('Eve', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.eql([
            ['Eve', 'hubot auth'],
            ['hubot', `@Eve You have been temporarily banned.`]
          ])
        })
    })

    it('Frank is unspeakable', function () {
      return room.user.say('Frank', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages.length).to.equal(1)
        })
    })
  })

  describe('Bans', function () {
    it('Gets one notice of banned', function () {
      return room.user.say('Eve', 'hubot hi')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          return room.user.say('Eve', 'hubot auth')
        })
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          return room.user.say('Eve', 'hubot auth list')
        })
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.be.eql([
            ['Eve', 'hubot hi'],
            ['hubot', '@Eve You have been temporarily banned.'],
            ['Eve', 'hubot auth'],
            ['Eve', 'hubot auth list']
          ])
        })
    })

    it('Gets unbanned', function () {
      room.robot.banned['Eve'] = Date.now() - 100
      room.messages = []
      return room.user.say('Eve', 'hubot auth')
        .then(function () {
          return delayPromise(100)
        })
        .then(function () {
          expect(room.messages).to.be.eql([
            ['Eve', 'hubot auth'],
            ['hubot', '@Eve You are now unbanned'],
            ['hubot', '@Eve You are a user']
          ])
        })
    })
  })

  describe('Commands', function () {
    describe('Ban', function () {
      it('Admin use', function () {
        return room.user.say('Alice', 'hubot ban @Charlie 1')
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            return room.user.say('Charlie', 'hubot auth')
          })
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            expect(room.messages).to.eql([
              ['Alice', 'hubot ban @Charlie 1'],
              ['hubot', 'BAM Charlie has been banned for 1 minutes'],
              ['Charlie', 'hubot auth'],
              ['hubot', '@Charlie You have been temporarily banned.']
            ])
            expect(room.robot.banned['Charlie']).to.be.an('number')
          })
      })

      it('Superuser use', function () {
        return room.user.say('Bob', 'hubot ban @Charlie 1')
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            return room.user.say('Charlie', 'hubot auth')
          })
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            expect(room.messages).to.eql([
              ['Bob', 'hubot ban @Charlie 1'],
              ['hubot', 'BAM Charlie has been banned for 1 minutes'],
              ['Charlie', 'hubot auth'],
              ['hubot', '@Charlie You have been temporarily banned.']
            ])
            expect(room.robot.banned['Charlie']).to.be.an('number')
          })
      })

      it('User use', function () {
        return room.user.say('Charlie', 'hubot ban @Bob 1')
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            return room.user.say('Bob', 'hubot ban @Charlie 1')
          })
          .then(function () {
            return delayPromise(100)
          })
          .then(function () {
            expect(room.messages).to.eql([
              ['Charlie', 'hubot ban @Bob 1'],
              ['hubot', '@Charlie You are not authorised! you are only a mere user'],
              ['Bob', 'hubot ban @Charlie 1'],
              ['hubot', 'BAM Charlie has been banned for 1 minutes']
            ])
          })
      })

      it('Unknown use', function () {
        return room.user.say('Unknown', 'hubot ban @Bob 1')
          .then(function () {
            return delayPromise(500)
          })
          .then(function () {
            expect(room.messages).to.eql([
              ['Unknown', 'hubot ban @Bob 1'],
              ['hubot', '@Unknown You are not authorised! you are only a mere user']
            ])
          })
      })
    })
  })
})
