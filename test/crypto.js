const Tester = require('hubot-test-helper')
const chai = require('chai')
const nock = require('nock')
const expect = chai.expect

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}

const helper = new Tester('../src/crypto.js')

describe('Crypto', function () {
  var room
  beforeEach('setupRoom', function () {
    room = helper.createRoom()
    nock('https://min-api.cryptocompare.com')
      .get('/data/price')
      .query({ fsym: 'BTC', tsyms: 'USD' })
      .times(2)
      .reply(200, JSON.stringify({ 'USD': 100 }))

    nock('https://min-api.cryptocompare.com')
      .get('/data/price')
      .query({ fsym: 'ETH', tsyms: 'USD' })
      .times(2)
      .reply(200, JSON.stringify({ 'USD': 10 }))
  })

  afterEach('teardownRoom', function () {
    room.destroy()
  })

  describe('Chat Commands', function () {
    it('BTC->USD', function () {
      return room.user.say('Alice', 'BTC->USD').then(function () {
        return delayPromise(100)
      }).then(function () {
        expect(room.messages).to.eql([
          ['Alice', 'BTC->USD'],
          ['hubot', '@Alice 1 BTC -> 100 USD']
        ])
      })
    })
    it('hubot eth/usd', function () {
      return room.user.say('Alice', 'hubot eth/usd')
        .then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot eth/usd'],
            ['hubot', '@Alice 1 ETH -> 10 USD']
          ])
        })
    })
    it('hubot crypto list', function () {
      return room.user.say('Alice', 'hubot crypto list')
        .then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot crypto list'],
            ['hubot', '@Alice ¯\\_(ツ)_/¯ Use `crypto add` to add pairs to your report']
          ])
        })
    })
    it('hubot add eth/usd, btc/usd', function () {
      return room.user.say('Alice', 'hubot crypto add eth/usd')
        .then(function () {
          return room.user.say('Alice', 'hubot crypto add btc/usd')
        }).then(function () {
          return room.user.say('Alice', 'hubot crypto list')
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
      return room.user.say('Alice', 'hubot crypto add eth/usd')
        .then(function () {
          return room.user.say('Alice', 'hubot crypto add btc/usd')
        }).then(function () {
          return room.user.say('Alice', '!crypto')
        }).then(function () {
          return delayPromise(100)
        }).then(function () {
          expect(room.messages.length).to.equal(6)
          expect(room.messages[5]).to.match(/@Alice 1 ETH -> 10 USD\n1 BTC -> 100 USD/)
        })
    })
  })
})
