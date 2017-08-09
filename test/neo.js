const Tester = require('hubot-test-helper')
const chai = require('chai')
const expect = chai.expect

let delayPromise = function (ms, payload) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(payload) }, ms)
  })
}

const helper = new Tester('../src/neo.js')
const methods = require('../helper/neo.js')

const sampleBlock = {
  'jsonrpc': '2.0',
  'id': 3,
  'result': {
    'hash': 'cb70c6b99f9790b41366b95e466493df109b799ae361fa134df5f2a4539156a0',
    'size': 1090,
    'version': 0,
    'previousblockhash': 'c658c74623c7d20258b29148384807e931979e87e9ada1245848ab0b195319c3',
    'merkleroot': '31503283e0529594cc5564ae37ff7f2451d93b28ee926df156c9b9f6c10c6a3e',
    'time': 1479135822,
    'index': 123456,
    'nonce': '178a3393e961e0cd',
    'nextconsensus': 'APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR',
    'script': {
      'invocation': '4042eecc13f8a54850625b058b8af1541ffbf545b2db72efed01204481c4f25857eb56461409cf1f555c15f4611b7b79795028bce26653bf1b48722390f4c6e1cc400da9dd7642b460e87c08ef0660e41831b53dc1255cddb5846e1a8a3ba1d08c666bbc23f38b393b55c393de104381782e682c8f073cd5266acee3d6981bc3c0a8406177337a594442a5f056cb23c994ca04e07f5cad9f32b9661291791f66ede6259bbd9c1a7347bd840ef18d3860610152df087b6408e8edb7d111cf168118a94a40257b6c56f3eec92dbf9d3b33b16b0cb9fb917cff5045c32e5a5e8d6289ca7da751995f2dac311b64d79280c49b72a7317392e5dabd25f35063a8f4752f0bc8a540c6fd3962971b2763eba0398df2f786ff4a9498973c152a907e16cf6e82b54e7b77934ce792c1da4bf812a1a97dd84b5637d5698a37e6bf963abd166361a6390f',
      'verification': '552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae'
    },
    'tx': [
      {
        'txid': '222cabe79c62d6d81d544620f6cbe342f3fc0268ef8e25d62e94bf35941e322f',
        'size': 10,
        'type': 'MinerTransaction',
        'version': 0,
        'attributes': [],
        'vin': [],
        'vout': [],
        'sys_fee': '0',
        'net_fee': '0',
        'scripts': [],
        'nonce': 3915505869
      },
      {
        'txid': '404166b7c202bacbd027b4d982671e43233f64156571f0ee93710e739da220f1',
        'size': 202,
        'type': 'ContractTransaction',
        'version': 0,
        'attributes': [],
        'vin': [
          {
            'txid': '3507f526f1bdd10ec8c934500685a17a8f9114c0adfcfb43b5d057495fcc8526',
            'vout': 0
          }
        ],
        'vout': [
          {
            'n': 0,
            'asset': 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
            'value': '4500',
            'address': 'APg2VNLfbMzVcNxbBR1bXLvUezj8J7UKjT'
          }
        ],
        'sys_fee': '0',
        'net_fee': '0',
        'scripts': [
          {
            'invocation': '4096b1edd845ea0a8da960924c071ec5225bea9fa0a1fe91e89fafa90da715896f7c4288d3ff86afe40492aed8d896a18add851f2ee5258338762858add2fd24bb',
            'verification': '210261388e2f993820974183aec1af8f6240c417b6905338284fa9b5c986c1ce75f9ac'
          }
        ]
      },
      {
        'txid': 'f42bbae942463f5cbdc01aaa40f9b8308ede95d279c6e4ea2ce27adc575352a7',
        'size': 202,
        'type': 'ContractTransaction',
        'version': 0,
        'attributes': [],
        'vin': [
          {
            'txid': '7d5bf4ee798f5166d3fec0e01362df761d19f8b1ac0021fcabf30a5481d6b37d',
            'vout': 7
          }
        ],
        'vout': [
          {
            'n': 0,
            'asset': 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
            'value': '401',
            'address': 'AUDhRYykhcCGMyuLwXVNfRWLoqSGGcGj53'
          }
        ],
        'sys_fee': '0',
        'net_fee': '0',
        'scripts': [
          {
            'invocation': '4098271a54f2a1226e09a7eb8e6ab84cdc146756e212f0fd0e4548a7d5639aaf1580c7c26be955982a70b8603c970389e724a6d508e139cf0b2e7f13b8bf34f947',
            'verification': '2103f8d4b213b30d1e2123cb561a3e6d403f6815f904ae5c2c67673f982a2aa3f610ac'
          }
        ]
      }
    ],
    'confirmations': 1040522,
    'nextblockhash': '99ead445d50910cb7ed8190b4a80e33bbc5d6d99d314376de8d6493d3f84d4c6'
  }
}

const expectedBlockOut = `Block No. \`123456\`
>cb70c6b99f9790b41366b95e466493df109b799ae361fa134df5f2a4539156a0
Created @ \`1479135822\` with *3* TXs:\`\`\`> MinerTransaction
222cabe79c62d6d81d544620f6cbe342f3fc0268ef8e25d62e94bf35941e322f
> ContractTransaction
404166b7c202bacbd027b4d982671e43233f64156571f0ee93710e739da220f1
> ContractTransaction
f42bbae942463f5cbdc01aaa40f9b8308ede95d279c6e4ea2ce27adc575352a7
\`\`\``

const sampleTxId = '512c19b20f6c154c84fafcf6aed3b96f681b52b1bbc744dad76fdb0a16eb6b7e'

const sampleTxn = {
  'jsonrpc': '2.0',
  'id': 3,
  'result': {
    'txid': '512c19b20f6c154c84fafcf6aed3b96f681b52b1bbc744dad76fdb0a16eb6b7e',
    'size': 262,
    'type': 'ContractTransaction',
    'version': 0,
    'attributes': [],
    'vin': [
      {
        'txid': 'd8a88306daf1fe00553d6c63cca97100bfe8e02a5c51830c1f01221ef72f35ed',
        'vout': 0
      }
    ],
    'vout': [
      {
        'n': 0,
        'asset': 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        'value': '194',
        'address': 'AWXGBCNgSRUjatCd9Cbd1pgTW1KXVU9WAR'
      },
      {
        'n': 1,
        'asset': 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        'value': '2',
        'address': 'AR4QmqYENiZAD6oXe7ftm6eDcwtHk7rVTT'
      }
    ],
    'sys_fee': '0',
    'net_fee': '0',
    'scripts': [
      {
        'invocation': '401885385bf940e2fbfdb0612e14e66a83dff92ce277edaae6d7f5d4ce5168ef340afebfabee1d0c23abf1ae2094ba7e11a607cd2fd14b7a4d94445783c238de34',
        'verification': '2103e9d9ef3925cc34d1af8b9eedea11c6fdf6a6a87a8d42df879b85c4d58a2d9280ac'
      }
    ],
    'blockhash': '643c03e9f60940454f54124e23d58aaa6322dee72192f710f978d43818f9dd57',
    'confirmations': 196,
    'blocktime': 1500477300
  }
}

const expectedTxnOut = `*ContractTransaction*: \`512c19b20f6c154c84fafcf6aed3b96f681b52b1bbc744dad76fdb0a16eb6b7e\`
> AR4QmqYENiZAD6oXe7ftm6eDcwtHk7rVTT
> received *2* AntShares
> AWXGBCNgSRUjatCd9Cbd1pgTW1KXVU9WAR
> has *194* AntShares left

SysFees: \`0\` NetFees: \`0\`
Block:
> 643c03e9f60940454f54124e23d58aaa6322dee72192f710f978d43818f9dd57`

describe('Neo', function () {
  var room
  beforeEach('setup', function () {
    room = helper.createRoom()
  })

  afterEach('teardown', function () {
    room.destroy()
  })

  describe('Helper Methods', function () {
    it('printBlock', function () {
      let output = methods.printBlock(sampleBlock.result)
      expect(output).to.equal(expectedBlockOut)
    })

    it('printTxn', function () {
      let output = methods.printTxn(sampleTxn.result)
      expect(output).to.equal(expectedTxnOut)
    })
  })

  describe('Chat Commands', function () {
    this.timeout(5000)
    it('neo height', function () {
      return room.user.say('Alice', 'hubot neo height')
        .then(function () {
          return delayPromise(3000)
        })
        .then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages[1][0]).to.equal('hubot')
          expect(room.messages[1][1]).to.match(/@Alice The current blockheight is `([0-9]*)`./)
        })
    })

    it('neo block', function () {
      return room.user.say('Alice', 'hubot neo block 123456')
        .then(function () {
          return delayPromise(3000)
        })
        .then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages[1][0]).to.equal('hubot')
          expect(room.messages[1][1]).to.equal('@Alice \n' + expectedBlockOut)
        })
    })

    it('neo transaction', function () {
      return room.user.say('Alice', `hubot neo transaction ${sampleTxId}`)
        .then(function () {
          return delayPromise(3000)
        })
        .then(function () {
          expect(room.messages.length).to.equal(2)
          expect(room.messages[1][0]).to.equal('hubot')
          expect(room.messages[1][1]).to.equal('@Alice \n' + expectedTxnOut)
        })
    })
  })
})
