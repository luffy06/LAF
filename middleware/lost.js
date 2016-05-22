// 引入mongoose数据库管理，引入丢失和拾取schema，并利用丢失和拾取schema建立model
var mongoose = require('mongoose');
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);

// 发布丢失信息
exports.postlost = function(req, res) {
  // 获取丢失信息对象
  var _lostmes = req.body.lost;
  // 获取当前登录用户
  var _user = req.session.user;
  // 未登录
  if (_user == null) {
    return res.render('error', {message: '用户未登录'});
  }
  // 复制发布人联系方式
  _lostmes["username"] = _user.name;
  _lostmes["useremail"] = _user.email;
  _lostmes["userphone"] = _user.phone;
  _lostmes["userQQ"] = _user.QQ;
  _lostmes["usercollege"] = _user.college;
  // 建立model
  lostmes = new Lost(_lostmes);
  // 存入数据库
  lostmes.save(function(err, lostmes) {
    if (err) {
      console.log(err);
    }
    // 重定向页面
    res.redirect('/message/lost');
  });
};

// 查看丢失信息列表
exports.list = function(req, res) {
  // 数据库获取所有丢失信息，并按照时间排序返回结果
  Lost.fetch(-1, function(err, lostmes) {
    if (err) {
      console.log(err)
    }
    res.render('message/lost', {
      title: 'Lost',
      lostmes: lostmes
    });
  });
};

// 获取用户丢失信息
exports.getuserlost = function(req, res) {
  // 获取当前用户名
  var name = req.session.user.name;
  // 获取动作（查看，删除）
  var action = req.query.action;
  // 获取卡类型和卡号
  var cardtype = req.query.cardtype;
  var number = req.query.number;
  // 测试输出
  console.log('getuserlost');
  console.log(req.originUrl);
  console.log(action + ' ' + cardtype + ' ' + number);
  // 查看用户丢失信息
  if (action == null) {
    Lost.find({username: name}, function(err, userlost) {
      if (err) {
        return res.render('error', {message: err});
      }
      res.render('user/userlost', {
        title: 'UserLost',
        userlost: userlost
      });
    });
  }
  // 删除用户丢失信息
  else if (action == 'deletelostmes') {
    Lost.remove({cardtype: cardtype, number: number}, function(err) {
      if (err) {
        return res.render('error', {message: err});
      }
      console.log('deletelostmes success');
      res.redirect('userlost');
    })
  }
  // 错误动作
  else {
    res.render('error', {message: action + ' not fonud'});
  }
};

