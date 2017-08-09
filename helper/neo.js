
const SYS_SHARES = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
const SYS_COINS = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

const asset = (hash) => {
  if (hash === SYS_SHARES) {
    return 'AntShares'
  } else if (hash === SYS_COINS) {
    return 'AntCoins'
  } else {
    return 'Asset'
  }
}
const createReq = (robot, url) => {
  return (method, params) => {
    let payload = JSON.stringify({ 'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 92 })
    return robot.http(url).header('Content-Type', 'application/json').post(payload)
  }
}

const printBlock = (data) => {
  let txns = data.tx.map((v) => { return `> ${v.type}\n${v.txid}\n` }).join('')
  return `Block No. \`${data.index}\`
>${data.hash}
Created @ \`${data.time}\` with *${data.tx.length}* TXs:` + '```' + txns + '```'
}

const buildTxnFlow = (origin, vout) => {
  let owner = vout[origin]
  let output = ''
  for (let i = 0; i < vout.length; i++) {
    if (vout[i].n !== origin) {
      output += `> ${vout[i].address}
> received *${vout[i].value}* ${asset(vout[i].asset)}\n`
    }
  }
  output += `> ${owner.address}
> has *${owner.value}* ${asset(owner.asset)} left\n`
  return output
}

const printTxn = (data) => {
  switch (data.type) {
    case 'ClaimTransaction':
      return `*${data.type}*: \`${data.txid}\`
*${data.vout[0].value}* Antcoins was credited to
> ${data.vout[0].address}
Block :
> ${data.blockhash}`
    case 'ContractTransaction':
      return `*${data.type}*: \`${data.txid}\`
${buildTxnFlow(data.vin[0].vout, data.vout)}
SysFees: \`${data.sys_fee}\` NetFees: \`${data.net_fee}\`
Block:
> ${data.blockhash}`
    default:
      return `${data.type}: ${data.txid}
SysFees: ${data.sys_fee} NetFees: ${data.net_fee}
Block:
> ${data.blockhash} `
  }
}

module.exports = { createReq, printBlock, printTxn }
