// 引入搜索的中间件
var express = require('express');
var _search = require('../middleware/search');
var Search = express.Router();
      
      // 搜索页面访问
Search.get('/', function(req, res) {
        res.render('search/search', {title: 'Search'})
      })
      // 结果页面
      .get('/result', _search.result)
      // 提交搜索信息
      .post('/go', _search.search)

module.exports = Search;