var express = require('express');
var _lost = require('../middleware/lost');
var _found = require('../middleware/found');
var Message = express.Router();

Message.get('/lost', _lost.list)
      .get('/found', _found.list)
      .post('/lost/postlostmes', _lost.postlost)
      .post('/found/postfoundmes', _found.postfound)

module.exports = Message;