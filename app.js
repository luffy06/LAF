// 引入所需的包
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 数据库相关包
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var fs = require('fs');

// 数据库链接
var dbUrl = 'mongodb://localhost/card';

// 创建项目
var app = express();

// 连接数据库
mongoose.connect(dbUrl);

// 引入自定义路由
var User = require('./routes/user');
var Index = require('./routes/index');
var Message = require('./routes/message');
var Search = require('./routes/search');

// 设置页面引擎为jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(multer());
app.use(session({
  secret: 'card',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

// 初始化，判断session中是否有用户
app.use(function(req, res, next) {
  var _user = req.session.user;
  if (_user)
    app.locals.user = _user;
  else
    delete app.locals.user;
  next()
});

// 首页
app.use(Index);

// 登出
app.use('/user/logout', function(req, res) {
  delete req.session.user;
  delete app.locals.user;
  return res.redirect('/');
});

// 用户相关
app.use('/user', User);

// 信息相关
app.use('/message', Message);

// 搜索相关
app.use('/search', Search);

// 404等错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
