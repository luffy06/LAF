var express = require('express');
var Index = express.Router();

Index.get('/', function(req, res) {
      res.render('index', {title: 'Index'});
    })
    .get('/index', function(req, res) {
      res.render('index', {title: 'Index'});
    })

module.exports = Index;