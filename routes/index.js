var express = require('express');
var Index = express.Router();

// 设置Index的路由控制，即/和/index均可访问首页
Index.get('/', function(req, res) {
      res.render('index', {title: 'Index'});
    })
    .get('/index', function(req, res) {
      res.render('index', {title: 'Index'});
    })

module.exports = Index;