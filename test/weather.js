const Tester = require('hubot-test-helper')
const chai = require('chai')
const nock = require('nock')
const expect = chai.expect

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}
const helper = new Tester('../src/weather.js')
const weather = require('../helper/weather.js')
const getMatch = weather.getMatch
const getAlias = weather.helpers.getAlias
const getCloseMatch = weather.getCloseMatch
const score = weather.helpers.score

const resp2Hr = {
  'area_metadata': [
    {
      'name': 'Ang Mo Kio',
      'label_location': {
        'latitude': 1.375,
        'longitude': 103.839
      }
    },
    {
      'name': 'Bedok',
      'label_location': {
        'latitude': 1.321,
        'longitude': 103.924
      }
    },
    {
      'name': 'Bishan',
      'label_location': {
        'latitude': 1.350772,
        'longitude': 103.839
      }
    },
    {
      'name': 'Boon Lay',
      'label_location': {
        'latitude': 1.304,
        'longitude': 103.701
      }
    },
    {
      'name': 'Bukit Batok',
      'label_location': {
        'latitude': 1.353,
        'longitude': 103.754
      }
    },
    {
      'name': 'Bukit Merah',
      'label_location': {
        'latitude': 1.277,
        'longitude': 103.819
      }
    },
    {
      'name': 'Bukit Panjang',
      'label_location': {
        'latitude': 1.362,
        'longitude': 103.77195
      }
    },
    {
      'name': 'Bukit Timah',
      'label_location': {
        'latitude': 1.325,
        'longitude': 103.791
      }
    },
    {
      'name': 'Central Water Catchment',
      'label_location': {
        'latitude': 1.38,
        'longitude': 103.805
      }
    },
    {
      'name': 'Changi',
      'label_location': {
        'latitude': 1.357,
        'longitude': 103.987
      }
    },
    {
      'name': 'Choa Chu Kang',
      'label_location': {
        'latitude': 1.377,
        'longitude': 103.745
      }
    },
    {
      'name': 'Clementi',
      'label_location': {
        'latitude': 1.315,
        'longitude': 103.76
      }
    },
    {
      'name': 'City',
      'label_location': {
        'latitude': 1.292,
        'longitude': 103.844
      }
    },
    {
      'name': 'Geylang',
      'label_location': {
        'latitude': 1.318,
        'longitude': 103.884
      }
    },
    {
      'name': 'Hougang',
      'label_location': {
        'latitude': 1.361218,
        'longitude': 103.886
      }
    },
    {
      'name': 'Jalan Bahar',
      'label_location': {
        'latitude': 1.347,
        'longitude': 103.67
      }
    },
    {
      'name': 'Jurong East',
      'label_location': {
        'latitude': 1.326,
        'longitude': 103.737
      }
    },
    {
      'name': 'Jurong Island',
      'label_location': {
        'latitude': 1.266,
        'longitude': 103.699
      }
    },
    {
      'name': 'Jurong West',
      'label_location': {
        'latitude': 1.34039,
        'longitude': 103.705
      }
    },
    {
      'name': 'Kallang',
      'label_location': {
        'latitude': 1.312,
        'longitude': 103.862
      }
    },
    {
      'name': 'Lim Chu Kang',
      'label_location': {
        'latitude': 1.423,
        'longitude': 103.717332
      }
    },
    {
      'name': 'Mandai',
      'label_location': {
        'latitude': 1.419,
        'longitude': 103.812
      }
    },
    {
      'name': 'Marine Parade',
      'label_location': {
        'latitude': 1.297,
        'longitude': 103.891
      }
    },
    {
      'name': 'Novena',
      'label_location': {
        'latitude': 1.327,
        'longitude': 103.826
      }
    },
    {
      'name': 'Pasir Ris',
      'label_location': {
        'latitude': 1.37,
        'longitude': 103.948
      }
    },
    {
      'name': 'Paya Lebar',
      'label_location': {
        'latitude': 1.358,
        'longitude': 103.914
      }
    },
    {
      'name': 'Pioneer',
      'label_location': {
        'latitude': 1.315,
        'longitude': 103.675
      }
    },
    {
      'name': 'Pulau Tekong',
      'label_location': {
        'latitude': 1.403,
        'longitude': 104.053
      }
    },
    {
      'name': 'Pulau Ubin',
      'label_location': {
        'latitude': 1.404,
        'longitude': 103.96
      }
    },
    {
      'name': 'Punggol',
      'label_location': {
        'latitude': 1.401,
        'longitude': 103.904
      }
    },
    {
      'name': 'Queenstown',
      'label_location': {
        'latitude': 1.291,
        'longitude': 103.78576
      }
    },
    {
      'name': 'Seletar',
      'label_location': {
        'latitude': 1.404,
        'longitude': 103.869
      }
    },
    {
      'name': 'Sembawang',
      'label_location': {
        'latitude': 1.445,
        'longitude': 103.818495
      }
    },
    {
      'name': 'Sengkang',
      'label_location': {
        'latitude': 1.384,
        'longitude': 103.891443
      }
    },
    {
      'name': 'Sentosa',
      'label_location': {
        'latitude': 1.243,
        'longitude': 103.832
      }
    },
    {
      'name': 'Serangoon',
      'label_location': {
        'latitude': 1.357,
        'longitude': 103.865
      }
    },
    {
      'name': 'Southern Islands',
      'label_location': {
        'latitude': 1.208,
        'longitude': 103.842
      }
    },
    {
      'name': 'Sungei Kadut',
      'label_location': {
        'latitude': 1.413,
        'longitude': 103.756
      }
    },
    {
      'name': 'Tampines',
      'label_location': {
        'latitude': 1.345,
        'longitude': 103.944
      }
    },
    {
      'name': 'Tanglin',
      'label_location': {
        'latitude': 1.308,
        'longitude': 103.813
      }
    },
    {
      'name': 'Tengah',
      'label_location': {
        'latitude': 1.374,
        'longitude': 103.715
      }
    },
    {
      'name': 'Toa Payoh',
      'label_location': {
        'latitude': 1.334304,
        'longitude': 103.856327
      }
    },
    {
      'name': 'Tuas',
      'label_location': {
        'latitude': 1.294947,
        'longitude': 103.635
      }
    },
    {
      'name': 'Western Islands',
      'label_location': {
        'latitude': 1.205926,
        'longitude': 103.746
      }
    },
    {
      'name': 'Western Water Catchment',
      'label_location': {
        'latitude': 1.405,
        'longitude': 103.689
      }
    },
    {
      'name': 'Woodlands',
      'label_location': {
        'latitude': 1.432,
        'longitude': 103.786528
      }
    },
    {
      'name': 'Yishun',
      'label_location': {
        'latitude': 1.418,
        'longitude': 103.839
      }
    }
  ],
  'items': [
    {
      'update_timestamp': '2017-08-10T00:11:18+08:00',
      'timestamp': '2017-08-09T23:30:00+08:00',
      'valid_period': {
        'start': '2017-08-09T23:30:00+08:00',
        'end': '2017-08-10T01:30:00+08:00'
      },
      'forecasts': [
        {
          'area': 'Ang Mo Kio',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bedok',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bishan',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Boon Lay',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bukit Batok',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bukit Merah',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bukit Panjang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Bukit Timah',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Central Water Catchment',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Changi',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Choa Chu Kang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Clementi',
          'forecast': 'Cloudy'
        },
        {
          'area': 'City',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Geylang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Hougang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Jalan Bahar',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Jurong East',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Jurong Island',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Jurong West',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Kallang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Lim Chu Kang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Mandai',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Marine Parade',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Novena',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Pasir Ris',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Paya Lebar',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Pioneer',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Pulau Tekong',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Pulau Ubin',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Punggol',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Queenstown',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Seletar',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Sembawang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Sengkang',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Sentosa',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Serangoon',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Southern Islands',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Sungei Kadut',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Tampines',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Tanglin',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Tengah',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Toa Payoh',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Tuas',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Western Islands',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Western Water Catchment',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Woodlands',
          'forecast': 'Cloudy'
        },
        {
          'area': 'Yishun',
          'forecast': 'Cloudy'
        }
      ]
    }
  ],
  'api_info': {
    'status': 'healthy'
  }
}

const resp24Hr = {
  'items': [
    {
      'update_timestamp': '2017-08-09T23:51:15+08:00',
      'timestamp': '2017-08-09T23:01:00+08:00',
      'valid_period': {
        'start': '2017-08-10T00:00:00+08:00',
        'end': '2017-08-10T00:00:00+08:00'
      },
      'general': {
        'forecast': 'Thundery Showers',
        'relative_humidity': {
          'low': 60,
          'high': 95
        },
        'temperature': {
          'low': 25,
          'high': 33
        },
        'wind': {
          'speed': {
            'low': 10,
            'high': 20
          },
          'direction': 'SSE'
        }
      },
      'periods': [
        {
          'time': {
            'start': '2017-08-10T00:00:00+08:00',
            'end': '2017-08-10T06:00:00+08:00'
          },
          'regions': {
            'west': 'Cloudy',
            'east': 'Cloudy',
            'central': 'Cloudy',
            'south': 'Cloudy',
            'north': 'Cloudy'
          }
        },
        {
          'time': {
            'start': '2017-08-10T06:00:00+08:00',
            'end': '2017-08-10T12:00:00+08:00'
          },
          'regions': {
            'west': 'Thundery Showers',
            'east': 'Thundery Showers',
            'central': 'Thundery Showers',
            'south': 'Thundery Showers',
            'north': 'Thundery Showers'
          }
        },
        {
          'time': {
            'start': '2017-08-10T12:00:00+08:00',
            'end': '2017-08-10T18:00:00+08:00'
          },
          'regions': {
            'west': 'Thundery Showers',
            'east': 'Thundery Showers',
            'central': 'Thundery Showers',
            'south': 'Thundery Showers',
            'north': 'Thundery Showers'
          }
        },
        {
          'time': {
            'start': '2017-08-10T18:00:00+08:00',
            'end': '2017-08-11T00:00:00+08:00'
          },
          'regions': {
            'west': 'Partly Cloudy (Night)',
            'east': 'Partly Cloudy (Night)',
            'central': 'Partly Cloudy (Night)',
            'south': 'Partly Cloudy (Night)',
            'north': 'Partly Cloudy (Night)'
          }
        }
      ]
    }
  ],
  'api_info': {
    'status': 'healthy'
  }
}

process.env.HUBOT_WEATHER_KEY = 'placeholder'

describe('Weather', function () {
  describe('Area matching', function () {
    it('Basic Matching', function () {
      expect(getMatch('ang mo kio')).to.equal('Ang Mo Kio', 'Ang mo kio did not match')
      expect(getMatch('sengkang')).to.equal('Sengkang', 'sengkang did not match')
      expect(getMatch('Malaysia')).to.equal('', 'Malaysia matched something')
    })

    it('Alias Matching', function () {
      expect(getAlias('Tpy')).to.equal('Toa Payoh', "Alias 'Tpy' did not match")
      expect(getAlias('Amk')).to.equal('Ang Mo Kio', "Alias 'Amk' did not match")
      expect(getAlias('Bkp')).to.equal('Bukit Panjang', "Alias 'Bkp' did not match")
      expect(getAlias('Sk')).to.equal('Sengkang', "Alias 'Sk' did not match")
    })

    it('Fuzzy Scoring', function () {
      expect(score('sengkang', 'sengkang')).to.equal(7, 'score failed')
      expect(score('mokio', 'angmokio')).to.equal(4, 'score failed')
    })

    it('Fuzzy Matching', function () {
      expect(getCloseMatch('bukit')).to.eql(['Bukit Batok', 'Bukit Merah', 'Bukit Panjang', 'Bukit Timah'], "Fuzzy 'bukit' failed")
      expect(getCloseMatch('seng kang')).to.eql(['Sengkang'], "Fuzzy 'seng kang' failed")
    })
  })

  describe('Chat Commands', function () {
    var room
    beforeEach('setupRoom', function () {
      room = helper.createRoom()
      room.robot.brain.set('weather', { 'Alice': ['Changi'], 'Bob': ['Bedok', 'Bishan'] })
      room.robot.brain.emit('connected')
      nock('https://api.data.gov.sg/', {
        reqheaders: { 'api-key': 'placeholder' }
      })
        .get('/v1/environment/2-hour-weather-forecast')
        .times(5)
        .reply(200, JSON.stringify(resp2Hr))

      nock('https://api.data.gov.sg/', {
        reqheaders: { 'api-key': 'placeholder' }
      })
        .get('/v1/environment/24-hour-weather-forecast')
        .times(5)
        .reply(200, JSON.stringify(resp24Hr))
    })

    afterEach('teardownRoom', function () {
      room.destroy()
      nock.cleanAll()
    })

    it('weather areas', function () {
      return room.user.say('Alice', 'hubot weather areas').then(function () {
        return delayPromise(10)
      }).then(function () {
        expect(room.messages.length).to.equal(3)
      })
    })

    describe('weather', function () {
      it('w/o area', function () {
        return room.user.say('Charlie', 'hubot weather').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Charlie', 'hubot weather'],
            ['hubot', '@Charlie Hi there! Did you just mention the weather?']
          ])
        })
      })
      it('with area', function () {
        return room.user.say('Bob', 'hubot weather').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Bob', 'hubot weather'],
            ['hubot', '@Bob It is Cloudy at Bedok now.']
          ])
        })
      })
    })

    describe('weather add', function () {
      it('add new area', function () {
        return room.user.say('Alice', 'hubot weather add bedok').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot weather add bedok'],
            ['hubot', '@Alice Bedok added']
          ])
        })
      })
      it('add repeated area', function () {
        return room.user.say('Bob', 'hubot weather add bedok').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Bob', 'hubot weather add bedok'],
            ['hubot', '@Bob You already have this area added!']
          ])
        })
      })
      it('add nonsense', function () {
        return room.user.say('Alice', 'hubot weather add bullshit').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot weather add bullshit'],
            ['hubot', `@Alice Did you misspell the area? I couldn't find it! I got bullshit`]
          ])
        })
      })
    })

    describe('weather remove', function () {
      it('remove area', function () {
        return room.user.say('Alice', 'hubot weather remove changi').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot weather remove changi'],
            ['hubot', '@Alice Changi removed']
          ])
        })
      })

      it('remove nothing', function () {
        return room.user.say('Charlie', 'hubot weather remove changi').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Charlie', 'hubot weather remove changi'],
            ['hubot', '@Charlie You do not have any areas!']
          ])
        })
      })

      it('remove wrong area', function () {
        return room.user.say('Alice', 'hubot weather remove bedok').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages).to.eql([
            ['Alice', 'hubot weather remove bedok'],
            ['hubot', '@Alice You do not have this area in your report!']
          ])
        })
      })
    })
    it('weather list', function () {
      return room.user.say('Bob', 'hubot weather list').then(function () {
        return delayPromise(10)
      }).then(function () {
        expect(room.messages).to.eql([
          ['Bob', 'hubot weather list'],
          ['hubot', '@Bob Bedok, Bishan']
        ])
      })
    })
    it('daycast', function () {
      return room.user.say('Alice', 'hubot daycast').then(function () {
        return delayPromise(10)
      }).then(function () {
        expect(room.messages.length).to.equal(2)
        expect(room.messages).to.eql([
          ['Alice', 'hubot daycast'],
          ['hubot', '@Alice Today looks to be Thundery Showers with temperatures of 25 to 33']
        ])
      })
    })
    it('weather <area>', function () {
      return room.user.say('Alice', 'hubot weather kallang').then(function () {
        return delayPromise(10)
      }).then(function () {
        expect(room.messages.length).to.equal(2)
        expect(room.messages).to.eql([
          ['Alice', 'hubot weather kallang'],
          ['hubot', '@Alice It is Cloudy at Kallang now.']
        ])
      })
    })
    describe('!weather', function () {
      it('no area', function () {
        return room.user.say('Charlie', '!weather').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages).to.eql([
            ['Charlie', '!weather'],
            ['hubot', `@Charlie Today's 24hrs forecast: Thundery Showers 25/33\n`]
          ])
        })
      })
      it('with 2 areas', function () {
        return room.user.say('Bob', '!weather').then(function () {
          return delayPromise(10)
        }).then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages).to.eql([
            ['Bob', '!weather'],
            ['hubot', '@Bob Today\'s 24hrs forecast: Thundery Showers 25/33\n```Bedok: Cloudy\nBishan: Cloudy\n```']
          ])
        })
      })
    })
  })
})
