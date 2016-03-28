var express = require('express');
var _user = require('../middleware/user');
var _lost = require('../middleware/lost');
var _found = require('../middleware/found');
var User = express.Router();


User.get('/userdetail', function(req, res) {
      res.render('user/userdetail', {title: 'Detail'})
    })
    .get('/userupdate', function(req, res) {
      res.render('user/userupdate', {title: 'Update'})
    })
    .get('/userpassword', function(req, res) {
      res.render('user/userpassword', {title: 'Password'})
    })
    .get('/userlost', _lost.getuserlost)
    .get('/userfound', _found.getuserfound)
    .get('/userlist', _user.loginreq, _user.adminreq, _user.list)
    .post('/register', _user.register)
    .post('/login', _user.login)
    .post('/userupdate', _user.updatedetail)
    .post('/userpassword', _user.updatepsw)
    .post('/userlist/update', _user.loginreq, _user.adminreq, _user.edituser)


module.exports = User;