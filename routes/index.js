var express = require('express');
var Index = express.Router();
var index = require('../middleware/index');

// 设置Index的路由控制，即/和/index均可访问首页
Index.get('/', index.init)
    .get('/index', index.init)

module.exports = Index;