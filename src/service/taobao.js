/**
 * Create by henry at 2020/10/20
 * API from TaoBao
 */

const {ApiClient} = require('../lib/tb_sdk');

class TaoBaoService {
    constructor({appKey, appSecret, uid}) {
        this.appKey = appKey
        this.appSecret = appSecret
        this.uid = uid
    }

    basic(apiName, params) {
        let client = new ApiClient({
            'appkey': this.appKey,
            'appsecret': this.appSecret,
            'url': 'http://gw.api.taobao.com/router/rest'
        });
        return new Promise((resolve, reject) => {
            client.executeWithHeader(
                apiName,
                params || {},
                {},
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    /**
     *  淘宝客-公用-淘宝客商品详情查询(简版)
     */
    async getItemInfo(itemId) {
        const res = await this.basic(
            'taobao.tbk.item.info.get',
            {
                num_iids: itemId
            }
        );
        return res.results.n_tbk_item[0];
    }

    /**
     * 淘宝客-公用-淘口令生成
     */
    async createPwd(url, text) {
        const res = await this.basic(
            'taobao.tbk.tpwd.create',
            {
                'user_id': this.uid,
                text,
                url
            }
        );
        return res.data;
    }

}

module.exports = TaoBaoService

