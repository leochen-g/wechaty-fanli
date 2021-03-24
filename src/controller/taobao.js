/**
 * Create by henry at 2020/10/20
 */

const TKLService = require('../service/taokouling')
const TaoBaoService = require('../service/taobao')

class TaoBaoController {
  constructor({ apiKey, siteId, adzoneId, uid, appKey, appSecret }) {
    this.apiKey = apiKey
    this.siteId = siteId
    this.uid = uid
    this.adzoneId = adzoneId
    this.appKey = appKey
    this.appSecret = appSecret
  }
  async getInfo(text) {
    const tkl = new TKLService({ apiKey: this.apiKey, siteId: this.siteId, adzoneId: this.adzoneId, uid: this.uid })
    const taobao = new TaoBaoService({ appKey: this.appKey, appSecret: this.appSecret, uid: this.uid })
    // 1. 检查淘口令
    const itemId = await tkl.check(text)
    // 2. 高佣转链接
    const { coupon_click_url, coupon_info, max_commission_rate } = await tkl.createLink(itemId)
    // 3. 生成淘口令
    const pwd = await taobao.createPwd(coupon_click_url, '我的淘口令')
    const info = await taobao.getItemInfo(itemId)
    const str = `${pwd.model}\n\n优惠券：${coupon_info || '无'}\n预计返利：${((info.zk_final_price * max_commission_rate) / 100).toFixed(2)} 元`
    return str
  }
}

module.exports = TaoBaoController
