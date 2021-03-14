/**
 * Create by henry at 2020/10/19
 * API from taokouling
 */

const request = require('request');

class TKLService {
    constructor({apiKey, siteId, adzoneId, uid}) {
        this.apiKey  = apiKey
        this.siteId  = siteId
        this.adzoneId  = adzoneId
        this.uid  = uid
    }
    /**
     * 淘口令解析
     */
    check(text) {
        return new Promise((resolve, reject) => {
            request.get(
                `http://api.taokouling.com/tkl/tkljm?apikey=${this.apiKey}&tkl=${encodeURI(text)}`,
                {json: true},
                (_err, _res, body) => {
                    if (body && body.code === 1) {
                        const data = body.url.split('?');
                        const obj = data[1].split('&');
                        let itemId = '';
                        for (let i = 0; i < obj.length; i++) {
                            const [key, value] = obj[i].split('=');
                            if (key === 'id') {
                                itemId = value;
                                break;
                            }
                        }
                        if (itemId) {
                            resolve(itemId);
                        }
                    }
                    reject('Check pwd error');
                }
            );
        });
    }

    /**
     * 高佣转链接
     */
    createLink(itemId) {
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.taokouling.com/tkl/TbkPrivilegeGet?apikey=${this.apiKey}&itemid=${itemId}&siteid=${this.siteId}&adzoneid=${this.adzoneId}&uid=${this.uid}`,
                {json: true},
                (_err, _res, body) => {
                    if (body && body.result && body.result.data) {
                        resolve(body.result.data);
                    } else {
                        reject('Create link error');
                    }
                }
            );
        });
    }
}

module.exports = TKLService

