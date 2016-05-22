// 引入用户、丢失和拾取所定义中间件
var express = require('express');
var _user = require('../middleware/user');
var _lost = require('../middleware/lost');
var _found = require('../middleware/found');
var User = express.Router();

    // 访问用户详情页
User.get('/userdetail', function(req, res) {
      res.render('user/userdetail', {title: 'Detail'})
    })
    // 访问用户更新个人信息页
    .get('/userupdate', function(req, res) {
      res.render('user/userupdate', {title: 'Update'})
    })
    // 访问用户更新个人密码页
    .get('/userpassword', function(req, res) {
      res.render('user/userpassword', {title: 'Password'})
    })
    // 访问用户丢失信息页
    .get('/userlost', _lost.getuserlost)
    // 访问用户拾取信息页
    .get('/userfound', _found.getuserfound)
    // 访问用户列表页
    .get('/userlist', _user.loginreq, _user.adminreq, _user.list)
    // 用户注册
    .post('/register', _user.register)
    // 用户登录
    .post('/login', _user.login)
    // 用户更新个人信息
    .post('/userupdate', _user.updatedetail)
    // 用户更新个人密码
    .post('/userpassword', _user.updatepsw)
    // 高权限用户更新低权限用户相关信息（更新信息，删除用户，更新权限）
    .post('/userlist/update', _user.loginreq, _user.adminreq, _user.edituser)


module.exports = User;