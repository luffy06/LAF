// 引入mongoose数据库管理，引入丢失和拾取schema，并利用丢失和拾取schema建立model
var mongoose = require('mongoose');
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);

// 发布拾取信息
exports.postfound = function(req, res) {
  // 获取拾取信息对象
  var _foundmes = req.body.found;
  // 获取当前登录用户
  var _user = req.session.user;
  // 未登录
  if (_user == null) {
    return res.render('error', {message: '用户未登录'});
  }
  // 复制发布人联系方式
  _foundmes["username"] = _user.name;
  _foundmes["useremail"] = _user.email;
  _foundmes["userphone"] = _user.phone;
  _foundmes["userQQ"] = _user.QQ;
  _foundmes["usercollege"] = _user.college;
  // 建立model
  foundmes = new Found(_foundmes);
  // 存入数据库
  foundmes.save(function(err, foundmes) {
    if (err) {
      console.log(err);
    }
    // 重定向页面
    res.redirect('/message/found');
  });
};

// 查看拾取信息列表
exports.list = function(req, res) {
  // 数据库获取所有丢失信息，并按照时间排序返回结果
  Found.fetch(-1, function(err, foundmes) {
    if (err) {
      console.log(err)
    }

    res.render('message/found', {
      title: 'Found',
      foundmes: foundmes
    });
  });
};

// 获取用户拾取信息
exports.getuserfound = function(req, res) {
  // 获取当前用户名
  var name = req.session.user.name;
  // 获取动作（查看，删除）
  var action = req.query.action;
  // 获取卡类型和卡号
  var cardtype = req.query.cardtype;
  var number = req.query.number;
  // 测试输出
  console.log('getuserfound');
  console.log(req.originalUrl);
  console.log(action + ' ' + cardtype + ' ' + number);
  // 查看用户拾取信息
  if (action == null) {
    Found.find({username: name}, function(err, userfound) {
      if (err) {
        return res.render('error', {message: err});
      }
      req.session.foundnum = userfound;
      res.render('user/userfound', {
        title: 'UserFound',
        userfound: userfound
      });
    });
  }
  // 删除用户拾取信息
  else if (action == 'deletefoundmes') {
    Found.remove({cardtype: cardtype, number: number}, function(err) {
      if (err) {
        return res.render('error', {message: err});
      }
      console.log('deletefoundmes success');
      res.redirect('userfound');
    })
  }
  // 错误动作
  else {
    res.render('error', {message: action + ' not fonud'});
  }
};