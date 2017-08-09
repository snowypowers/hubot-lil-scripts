const chai = require('chai')
const assert = chai.assert

const weather = require('../src/weather.js')
const getMatch = weather.getMatch
const getAlias = weather.helpers.getAlias
const getCloseMatch = weather.getCloseMatch
const score = weather.helpers.score

describe('Area matching', function () {
  it('Basic Matching', function () {
    assert.equal(getMatch('ang mo kio'), 'Ang Mo Kio', 'Ang mo kio did not match')
    assert.equal(getMatch('sengkang'), 'Sengkang', 'sengkang did not match')
    assert.equal(getMatch('Malaysia'), '', 'Malaysia matched something')
  })

  it('Alias Matching', function () {
    assert.equal(getAlias('Tpy'), 'Toa Payoh', "Alias 'Tpy' did not match")
    assert.equal(getAlias('Amk'), 'Ang Mo Kio', "Alias 'Amk' did not match")
    assert.equal(getAlias('Bkp'), 'Bukit Panjang', "Alias 'Bkp' did not match")
    assert.equal(getAlias('Sk'), 'Sengkang', "Alias 'Sk' did not match")
  })

  it('Fuzzy Scoring', function () {
    assert.equal(score('sengkang', 'sengkang'), 7, 'score failed')
    assert.equal(score('mokio', 'angmokio'), 4, 'score failed')
  })

  it('Fuzzy Matching', function () {
    assert.sameMembers(getCloseMatch('bukit'), ['Bukit Batok', 'Bukit Merah', 'Bukit Panjang', 'Bukit Timah'], "Fuzzy 'bukit' failed")
    assert.sameMembers(getCloseMatch('seng kang'), ['Sengkang'], "Fuzzy 'seng kang' failed")
  })
})
