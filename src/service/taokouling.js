/**
 * Create by henry at 2020/10/19
 * API from taokouling
 */

const request = require('request')
const axios = request('axios')
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
  check(text) {
    return new Promise((resolve, reject) => {
      // const url =  `http://api.taokouling.com/tkl/tkljm?apikey=${this.apiKey}&tkl=${encodeURI(text)}`
      // const url = `https://taodaxiang.com/taopass/parse/get?&content=${encodeURI(text)}`
      var data = new FormData()
      data.append('kouling', text)
      data.append('isitem', ' false')
      data.append('isquan', ' false')
      const config = {
        method: 'post',
        url: 'https://www.2017taoke.com/tool/kouling.html?submit',
        headers: {
          referer: 'https://www.2017taoke.com/tool/kouling.html',
          ...data.getHeaders(),
        },
        data: data,
      }
      axios(config)
        .then(function (response) {
          if (response.success) {
            const data = response.url.split('?')
            const obj = data[1].split('&')
            let itemId = ''
            for (let i = 0; i < obj.length; i++) {
              const [key, value] = obj[i].split('=')
              if (key === 'id') {
                itemId = value
                break
              }
            }
            if (itemId) {
              resolve(itemId)
            }
          }
          reject('Check pwd error')
        })
        .catch(function (error) {
          reject('Check pwd error')
        })
      // request.get(url, { json: true }, (_err, _res, body) => {
      //   if (body && body.code === 0) {
      //     const data = body.data.url.split('?')
      //     const obj = data[1].split('&')
      //     let itemId = ''
      //     for (let i = 0; i < obj.length; i++) {
      //       const [key, value] = obj[i].split('=')
      //       if (key === 'id') {
      //         itemId = value
      //         break
      //       }
      //     }
      //     if (itemId) {
      //       resolve(itemId)
      //     }
      //   }
      //   reject('Check pwd error')
      // })
    })
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
          reject('Create link error')
        }
      })
    })
  }
}

module.exports = TKLService
