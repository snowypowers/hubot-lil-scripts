const Tester = require('hubot-test-helper')
const chai = require('chai')
const nock = require('nock')
const expect = chai.expect

const helper = new Tester('../src/riot.js')

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}

describe.only('Riot', function () {
  var room
  beforeEach('setup', function () {
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
  })

  afterEach('teardown', function () {
    room.destroy()
  })

  it('riot', () => {
    return room.user.say('Alice', 'riot!')
      .then(() => {
        return delayPromise(10)
      })
      .then(() => {
        expect(room.messages.length).to.equal(2)
        expect(room.messages[1][1]).to.match(/Raise your pitchforks/)
      })
  })

  it('!fight', () => {
    return room.user.say('Alice', '!fight @Charlie')
      .then(() => {
        return delayPromise(10)
      })
      .then(() => {
        expect(room.messages.length).to.equal(2)
        console.log(room.messages[1])
      })
  })
})
