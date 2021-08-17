const {Wechaty} = require('wechaty')
const Qrterminal = require('qrcode-terminal')
const WechatyFanliPlugin = require('../src/index')
const name = 'wechat-assistant'
const bot = new Wechaty({
    name, // generate xxxx.memory-card.json and save login data for the next login
    puppet: 'wechaty-puppet-wechat',
})



async function onLogin(user) {
    console.log(`返利小助手${user}登录了`)
}

async function onLogout(user) {
    console.log(`返利小助手${user}已登出`)
}

/**
 * 扫描登录，显示二维码
 */
async function onScan(qrcode, status) {
    Qrterminal.generate(qrcode)
    console.log('扫描状态', status)
    const qrImgUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log(qrImgUrl)
}


bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);

bot
    .use(WechatyFanliPlugin({
        keyword: '?', // 触发关键词 例： ?淘宝粘贴的链接 不填则对所有对话进行返利转化
        apiKey: '', // 淘口令网的apikey
        siteId: '', // 参见https://www.taokouling.com/html/8.html
        adzoneId: "", // 参见https://www.taokouling.com/html/8.html
        uid: '', // 淘口令网-高佣授权信息-淘宝用户id
        appKey: '', // 淘宝联盟 - 媒体备案管理- 媒体中的appkey
        appSecret: '' // 淘宝联盟 - 媒体备案管理- 媒体中的appkey - 查看 - appSecret
    }))
    .start()
    .catch((e) => console.error(e))
