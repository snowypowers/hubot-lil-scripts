const Tester = require('hubot-test-helper')
const chai = require('chai')
const expect = chai.expect

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}

const helper = new Tester('../scripts/crypto.js')

describe('Crypto', function () {
  var room
  beforeEach('setup', function () {
    room = helper.createRoom()
  })

  afterEach('teardown', function () {
    room.destroy()
  })

  describe('Chat Commands', function () {
    this.timeout(3000)
    it('BTC->USD', function () {
      return room.user.say('Alice', 'BTC->USD').then(function () {
        return delayPromise(2000)
      }).then(function () {
        expect(room.messages.length).to.equal(2)
        expect(room.messages[1][1]).to.match(/@Alice 1 BTC -> ([0-9.]*) USD/)
      })
    })
    it('hubot eth/usd', function () {
      return room.user.say('Alice', 'hubot btc/usd')
        .then(function () {
          return delayPromise(2000)
        }).then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages[1][1]).to.match(/@Alice 1 BTC -> ([0-9.]*) USD/)
        })
    })
    it('hubot crypto list', function () {
      return room.user.say('Alice', 'hubot crypto list')
        .then(function () {
          return delayPromise(100)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot crypto list'],
            ['hubot', '@Alice ¯\\_(ツ)_/¯ Use `crypto add` to add pairs to your report']
          ])
        })
    })
    it('hubot add eth/usd, btc/usd', function () {
      return room.user.say('Alice', 'hubot crypto add eth/usd')
        .then(function () {
          return delayPromise(100)
        }).then(function () {
          return room.user.say('Alice', 'hubot crypto add btc/usd')
        }).then(function () {
          return delayPromise(100)
        }).then(function () {
          return room.user.say('Alice', 'hubot crypto list')
        }).then(function () {
          return delayPromise(100)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot crypto add eth/usd'],
            ['hubot', '@Alice Added ETH/USD'],
            ['Alice', 'hubot crypto add btc/usd'],
            ['hubot', '@Alice Added BTC/USD'],
            ['Alice', 'hubot crypto list'],
            ['hubot', '@Alice ETH/USD, BTC/USD']
          ])
        })
    })
    it('!crypto w/o adding', function () {
      return room.user.say('Alice', '!crypto')
        .then(function () {
          expect(room.messages).to.eql([
            ['Alice', '!crypto'],
            ['hubot', '@Alice ¯\\_(ツ)_/¯ Use `crypto add` to add pairs to your report']
          ])
        })
    })
    it('!crypto', function () {
      this.timeout(5000)
      return room.user.say('Alice', 'hubot crypto add eth/usd')
        .then(function () {
          return delayPromise(100)
        }).then(function () {
          return room.user.say('Alice', 'hubot crypto add btc/usd')
        }).then(function () {
          return delayPromise(100)
        }).then(function () {
          return room.user.say('Alice', '!crypto')
        }).then(function () {
          return delayPromise(3000)
        }).then(function () {
          expect(room.messages.length).to.equal(6)
          expect(room.messages[5]).to.match(/@Alice 1 ETH -> ([0-9.]*) USD\n1 BTC -> ([0-9.]*) USD/)
        })
    })
  })
})
