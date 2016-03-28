var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);

exports.register = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  // console.log("use register: ");
  // console.log(_user);

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('error', {
        message: err
      });
    }
    if (user) {
      // 用户存在
      console.log("user exist!");
      return res.render('error', {
        message: "用户存在啦!"
      });
    }
    else {
      user = new User(_user);
      req.session.user = user;
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    }
  });
};

exports.login = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('error', {
        message: err
      });
    }

    if (!user) {
      console.log("User doesn't exist!");
      return res.render('error', {
        message: "用户不存在!"
      });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
        return res.render('error', {
        message: err
      });
      }

      if (isMatch) {
        req.session.user = user;
        console.log("User login success!");
      }
      else {
        console.log('password is not matched!');
        return res.render('error', {
          message: "密码错误!"
        })
      }
      res.redirect('/');
    });
  });
};

exports.updatedetail = function(req, res) {
  var local_user = req.session.user;
  var _user = req.body.user;
  var update_user = new User(local_user);
  var name = update_user.name;
  update_user["email"] = _user.email;
  update_user["phone"] = _user.phone;
  update_user["QQ"] = _user.QQ;
  update_user["address"] = _user.adr;
  update_user["college"] = _user.college;
  
  User.update({name: name}, update_user, function(err) {
    if (err) {
      console.log(err);
    }
    req.session.user = update_user;
    return res.redirect('/user/userdetail')
  });
};

exports.updatepsw = function(req, res) {
  var fpassword = req.body.fpsw;
  var password = req.body.psw;
  var update_user = req.session.user;
  var name = update_user.name;
  // console.log("former password " + fpassword);
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    user.comparePassword(fpassword, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        user.updatepsw(password, function(err) {
          if (err) {
            console.log(err);
          }
          update_user.password = user.password;
          User.update({name: name}, update_user, function(err) {
            if (err) {
              console.log(err);
            }
          })
        });
      }
      else {
        console.log('password is not matched!');
        return res.render('error', {message: '原密码错误'});
      }
      delete req.session.user;
      res.redirect('/')
    });
  });
};

exports.loginreq = function(req, res, next) {
  var _user = req.session.user;
  if (!_user) {
    console.log("user does not login")
    return res.render('error', {message: "用户未登录!"});
  }
  next();
}

exports.adminreq = function(req, res, next) {
  var role = req.session.user.role;
  if (role == 0) {
    console.log("user cannot visit");
    return res.render('error', {message: "用户权限过低!"});
  }
  next();
}

exports.list = function(req, res) {
  User.fetch(-1, function(err, userlist) {
    if (err) {
      return res.render('error', {message: err});
    }
    var action = req.query.action;
    var name = req.query.name;
    console.log("action in userlist");
    console.log(action + ' ' + name);
    if (action == 'edituser') {
      User.findOne({name: name}, function(err, edituser) {
        if (err) {
          return res.render('error', {message: err});
        }
        res.render('user/userlistupdate', {
          title: 'UserUpdate',
          edituser: edituser
        });
      })
    }
    else if (action == 'deleteuser') {
      User.remove({name: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }
      });
      console.log('delete user success');
      Lost.remove({username: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }
      });
      console.log('delete user lost message success');
      Found.remove({username: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }        
      })
      console.log('delete user found message success');
      res.redirect('userlist');
    }
    else if (action == 'downuserlevel' || action == 'upuserlevel') {
      User.findOne({name: name}, function(err, user) {
        if (err) {
          return res.render('error', {message: err});
        }
        var role = user.role;
        if (action == 'downuserlevel')
          role = role - 1;
        else
          role = role + 1;
        User.update({name: name}, {$set:{role: role}}, function(err) {
          if (err) {
            return res.render('error', {message: err});
          }
          console.log('update level success');
          res.redirect('userlist');
        });
      });
    }
    else if (action != null) {
      res.render('error', {message: action + ' not fonud'});
    }
    else {
      res.render('user/userlist', {
        title: 'userlist',
        userlist: userlist
      });
    }
  });
}

exports.edituser = function(req, res) {
  var edit = req.body.edit;
  var name = req.query.name;
  console.log('edit user ' + name);
  console.log(edit);
  User.findOne({name: name}, function(err, user) {
    if (err) {
      return res.render('error', {message: err});
    }
    user.email = edit.email;
    user.phone = edit.phone;
    user.QQ = edit.QQ;
    user.college = edit.college;
    user.address = edit.address;    
    User.update({name: name}, user, function(err) {
      if (err) {
        return res.render('error', {message: err});
      }
      console.log('update user ' + name + ' success');
      console.log(user);
      res.redirect('../userlist');
    });
  });
}
