# wechaty-fanli 插件
[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)

基于wechaty实现的返利微信机器人，根据淘口令生成高佣转链接，并创建新的淘口令。
本项目实现功能：

- 淘宝优惠券查询

![](docs/images/weixin.png)


## 参考项目

根据[henryfanyiye](https://github.com/henryfanyiye) 的
[wechat-fanli-robot](https://github.com/henryfanyiye/wechat-fanli-robot) 项目改造而成，本项目属于wechaty插件，可以直接配置使用，无需关心源码。只要申请好自己的[淘宝联盟账号](https://pub.alimama.com/) 和 [淘口令](https://www.taokouling.com/) 的账号即可，具体步骤可参见[wechat-fanli-robot](https://github.com/henryfanyiye/wechat-fanli-robot) 项目说明


## 实现微信机器人

机器人是基于 [wechaty](https://wechaty.js.org/v/zh/quick-start) 来实现，官方文档已经有了非常的详细的教程，所以这里不做赘述。
由于微信 web 协议现在已经废除，所以需要采用iPad协议，wechaty 的 iPad 协议启动是需要 token 的，token 是需要申请的，[点击申请 token](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty) 。

## 使用步骤

### 安装插件和wechaty

```angular2html
npm install wechaty wechaty-fanli wechaty-puppet-padlocal --save
```

### 主要代码

index.js
```javascript
const {Wechaty} = require('wechaty')
const {PuppetPadlocal} = require('wechaty-puppet-padlocal')
const Qrterminal = require('qrcode-terminal')
const WechatyFanliPlugin = require('wechaty-fanli')
const token = '申请的ipadlocal token'
const name = 'wechat-fanli'
const puppet = new PuppetPadlocal({
    token,
})
const bot = new Wechaty({
    name, // generate xxxx.memory-card.json and save login data for the next login
    puppet,
    // puppet: 'wechaty-puppet-puppeteer',
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
        appSecret: 'appSecret' // 淘宝联盟 - 媒体备案管理- 媒体中的appkey - 查看 - appSecret
    }))
    .start()
    .catch((e) => console.error(e))

```

### 运行

```angular2html
node index.js
```
扫码登录，即可

## 问题

如有使用问题可以直接加小助手，回复`返利`，进微信群交流

![](https://user-gold-cdn.xitu.io/2019/2/28/1693401c6c3e6b02?w=430&h=430&f=png&s=53609)