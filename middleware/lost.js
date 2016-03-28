var mongoose = require('mongoose');
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);

exports.postlost = function(req, res) {
  var _lostmes = req.body.lost;
  var _user = req.session.user;
  if (_user == null) {
    return res.render('error', {message: '用户未登录'});
  }
  _lostmes["username"] = _user.name;
  _lostmes["useremail"] = _user.email;
  _lostmes["userphone"] = _user.phone;
  _lostmes["userQQ"] = _user.QQ;
  _lostmes["usercollege"] = _user.college;
  lostmes = new Lost(_lostmes);
  lostmes.save(function(err, lostmes) {
    if (err) {
      console.log(err);
    }
    res.redirect('/message/lost');
  });
};

exports.list = function(req, res) {
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

exports.getuserlost = function(req, res) {
  var name = req.session.user.name;
  var action = req.query.action;
  var cardtype = req.query.cardtype;
  var number = req.query.number;
  console.log('getuserlost');
  // console.log(req.originUrl);
  // console.log(action);
  // console.log(cardtype + ' ' + number);
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
  else if (action == 'deletelostmes') {
    Lost.remove({cardtype: cardtype, number: number}, function(err) {
      if (err) {
        return res.render('error', {message: err});
      }
      console.log('deletelostmes success');
      res.redirect('userlost');
    })
  }
  else {
    res.render('error', {message: action + ' not fonud'});
  }
};

