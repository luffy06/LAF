// 引入丢失和拾取所定义中间件
var express = require('express');
var _lost = require('../middleware/lost');
var _found = require('../middleware/found');
var Message = express.Router();

        // 丢失页面列表
Message.get('/lost', _lost.list)
        // 拾取页面列表
      .get('/found', _found.list)
        // 发布丢失信息
      .post('/lost/postlostmes', _lost.postlost)
        // 发布拾取信息
      .post('/found/postfoundmes', _found.postfound)

module.exports = Message;