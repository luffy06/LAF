var mongoose = require('mongoose');
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);

exports.postfound = function(req, res) {
  var _foundmes = req.body.found;
  var _user = req.session.user;
  if (_user == null) {
    return res.render('error', {message: '用户未登录'});
  }  
  _foundmes["username"] = _user.name;
  _foundmes["useremail"] = _user.email;
  _foundmes["userphone"] = _user.phone;
  _foundmes["userQQ"] = _user.QQ;
  _foundmes["usercollege"] = _user.college;
  foundmes = new Found(_foundmes);
  console.log(foundmes);
  foundmes.save(function(err, foundmes) {
    if (err) {
      console.log(err);
    }
    res.redirect('/message/found');
  });
};

exports.list = function(req, res) {
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

exports.getuserfound = function(req, res) {
  var name = req.session.user.name;
  var action = req.query.action;
  var cardtype = req.query.cardtype;
  var number = req.query.number;
  console.log('getuserfound');
  console.log(req.originalUrl);
  console.log(action);
  console.log(cardtype + ' ' + number);
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
  else if (action == 'deletefoundmes') {
    Found.remove({cardtype: cardtype, number: number}, function(err) {
      if (err) {
        return res.render('error', {message: err});
      }
      console.log('deletefoundmes success');
      res.redirect('userfound');
    })
  }
  else {
    res.render('error', {message: action + ' not fonud'});
  }
};