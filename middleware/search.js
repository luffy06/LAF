// 引入mongoose数据库管理，引入丢失和拾取schema，并利用丢失和拾取schema建立model
var mongoose = require('mongoose');
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);

// 搜索页面，重定向到结果页面
exports.search = function(req, res) {
  // 获取搜索类型和搜索卡号
  var number = req.body.number;
  var type = req.body.type;
  // 重定向结果页面
  res.redirect('result?type=' + type + '&number=' + number);
}

// 结果页面
exports.result = function(req, res) {
  // 搜索卡号和搜索类型
  var number = req.query.number;
  var type = req.query.type;
  // 搜索丢失信息
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
  // 搜索拾取信息
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
  // 未选择搜索类型
  else {
    res.render('error', {message: '未选择搜索类型'});
  }
}