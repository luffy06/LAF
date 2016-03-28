var mongoose = require('mongoose');
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);

exports.search = function(req, res) {
  var number = req.body.number;
  var type = req.body.type;
  res.redirect('result?type=' + type + '&number=' + number);
}

exports.result = function(req, res) {
  var number = req.query.number;
  var type = req.query.type;
  if (type == 'lost') {
    Lost.find({number: number}, function(err, lost) {
      if (err) {
        return res.render('error', {message: err});
      }
      res.render('search/result', {
        title: 'Result',
        match: lost,
        type: type
      });
    });
  }
  else if (type == 'found') {
    Found.find({number: number}, function(err, found) {
      if (err) {
        return res.render('error', {message: err});
      }
      res.render('search/result', {
        title: 'Result',
        match: found,
        type: type
      });
    });
  }
  else {
    res.render('error', {message: '未选择搜索类型'});
  }
}