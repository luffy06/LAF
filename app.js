var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var fs = require('fs');
var dbUrl = 'mongodb://localhost/card';
var app = express();

mongoose.connect(dbUrl);

var User = require('./routes/user');
var Index = require('./routes/index');
var Message = require('./routes/message');
var Search = require('./routes/search');

// view engine setup
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

app.use(function(req, res, next) {
  var _user = req.session.user;
  if (_user)
    app.locals.user = _user;
  else
    delete app.locals.user;
  next()
});

app.use(Index);
app.use('/user/logout', function(req, res) {
  delete req.session.user;
  delete app.locals.user;
  return res.redirect('/');
});
app.use('/user', User);
app.use('/message', Message);
app.use('/search', Search);

// catch 404 and forward to error handler
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
