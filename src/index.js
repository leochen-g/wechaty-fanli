const TaoBaoController = require('./controller/taobao')

let config = {}

async function fanli({ msg }) {
  try {
    const taobao = new TaoBaoController({ ...config })
    // const rgx = /\w{8,11}/
    // const pwd = msg.match(rgx)
    // if (pwd !== null) {
    const res = await taobao.getInfo(msg)
    return res
    // }
    // return '查询失败'
  } catch (e) {
    console.log('查询失败', e)
    return '查询失败'
  }
}

async function onMessage(msg) {
  try {
    const room = msg.room() // 是否为群消息
    const contact = msg.talker() // 发消息人
    const msgSelf = msg.self() // 是否自己发给自己的消息
    if (msgSelf) return
    if (!room) {
      const say = msg.text()
      if (config.keyword) {
        if (say.startsWith(config.keyword)) {
          console.log(`${await contact.name()}: 触发返利关键词"${config.keyword}"`)
          const res = await fanli({ msg: say })
          await msg.say(res)
        }
      } else {
        console.log('无关键词，全部触发返利')
        const res = await fanli({ msg: say })
        await msg.say(res)
      }
    }
  } catch (e) {
    console.log('reply error', e)
  }
}

module.exports = function WechatyFanliPlugin({ keyword, apiKey, siteId, adzoneId, uid, appKey, appSecret }) {
  config = {
    apiKey,
    siteId,
    adzoneId,
    uid,
    appKey,
    appSecret,
    keyword,
  }
  return function (bot) {
    bot.on('message', onMessage)
  }
}
