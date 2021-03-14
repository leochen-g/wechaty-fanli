'use strict';

var apiClient = require('./lib/api/topClient.js').TopClient;
var dingtalkClient = require('./lib/api/dingtalkClient.js').DingTalkClient;
var tmcClient = require('./lib/tmc/tmcClient.js').TmcClient;

module.exports = {
    ApiClient: apiClient,
    TmcClient: tmcClient,
	DingTalkClient: dingtalkClient
};
