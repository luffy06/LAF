var express = require('express');
var _search = require('../middleware/search');
var Search = express.Router();

Search.get('/', function(req, res) {
        res.render('search/search', {title: 'Search'})
      })
      .get('/result', _search.result)
      .post('/go', _search.search)

module.exports = Search;