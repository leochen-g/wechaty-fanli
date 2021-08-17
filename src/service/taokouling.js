/**
 * Create by henry at 2020/10/19
 * API from taokouling
 */

const request = require('request')
const axios = require('axios')
const FormData = require('form-data')
class TKLService {
  constructor({ apiKey, siteId, adzoneId, uid }) {
    this.apiKey = apiKey
    this.siteId = siteId
    this.adzoneId = adzoneId
    this.uid = uid
  }
  /**
   * 淘口令解析
   */
  async check(text) {
    let url= ''
    const res1 = await this.getDianShang(text)
    if(res1) {
      url = res1
      return this.getGoodId(url)
    } else {
      const res2 = await this.getDaXiang(text)
      if(res2) {
        url = res2
        return this.getGoodId(url)
      }else {
        return ''
      }
    }
  }

  /**
   * 淘口令解析 - 电商工具
   */
  async getDianShang(text) {
    var data = new FormData()
    data.append('tkl', text)
    const config = {
      method: 'post',
      url: 'http://tool.taobaourl.cn/Index/doTkljm.html',
      headers: {
        referer: 'http://tool.taobaourl.cn/Index/doTkljm.html',
        ...data.getHeaders(),
      },
      data: data,
    }
    try{
      console.log('使用电商工具解析中...')
      const res = await axios(config)
      if (res.data.status === 'success') {
        const url = res.data.data.url
        console.log(`解析url成功: ${url}`)
        return url
      }
    }catch (e) {
      console.log('电商工具解析错误,正在使用淘大象接口...')
      return  ''
    }
  }

  /**
   * 淘口令解析 - 淘大象
   */
  async getDaXiang(text) {
    var data = new FormData()
    data.append('content', text)
    const config = {
      method: 'post',
      url: 'https://taodaxiang.com/taopass/parse/get',
      headers: {
        // referer: 'https://taodaxiang.com/taopass',
        ...data.getHeaders(),
      },
      data: data,
    }
    try{
      console.log('使用淘大象解析中...')
      const res = await axios(config)
      if (res.data.code === 0) {
        const url = res.data.data.url
        console.log(`解析url成功: ${url}`)
        return url
      }
    }catch (e) {
      console.log('淘大象接口解析失败，请联系作者新增接口...')
      return  ''
    }
  }

  /**
   * 获取商品id
   * @param url
   * @returns {string}
   */
  getGoodId(url) {
    const data = url.split('?')
    const obj = data[1].split('&')
    let itemId = ''
    for (let i = 0; i < obj.length; i++) {
      const [key, value] = obj[i].split('=')
      if (key === 'id') {
        itemId = value
        break
      }
    }
    console.log(`解析得到商品id:${itemId}`)
    if (itemId) {
      return itemId
    } else {
      return  ''
    }
  }
  /**
   * 高佣转链接
   */
  createLink(itemId) {
    return new Promise((resolve, reject) => {
      request.get(`https://api.taokouling.com/tkl/TbkPrivilegeGet?apikey=${this.apiKey}&itemid=${itemId}&siteid=${this.siteId}&adzoneid=${this.adzoneId}&uid=${this.uid}`, { json: true }, (_err, _res, body) => {
        if (body && body.result && body.result.data) {
          resolve(body.result.data)
        } else {
          reject('查询失败原因：' + body.msg)
        }
      })
    })
  }
}

module.exports = TKLService
