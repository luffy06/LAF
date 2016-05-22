// 引入mongoose数据库管理，引入用户、丢失和拾取schema，并利用用户、丢失和拾取schema建立model
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var FoundSchema = require('../schemas/found');
var Found = mongoose.model('found', FoundSchema);
var LostSchema = require('../schemas/lost');
var Lost = mongoose.model('lost', LostSchema);

// 注册
exports.register = function(req, res) {
  // 获取用户信息
  var _user = req.body.user;
  // 获取用户名
  var name = _user.name;
  // 测试输出
  console.log("use register: " + _user);

  // 依据用户名判重
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('error', {
        message: err
      });
    }
    // 用户存在
    if (user) {
      console.log("user exist!");
      return res.render('error', {
        message: "用户存在啦!"
      });
    }
    // 用户不存在
    else {
      // 创建用户
      user = new User(_user);
      // 设置session
      req.session.user = user;
      // 存入数据库
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    }
  });
};

// 登录
exports.login = function(req, res) {
  // 获取用户信息
  var _user = req.body.user;
  // 获取用户名及密码
  var name = _user.name;
  var password = _user.password;

  // 查找用户
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('error', {
        message: err
      });
    }

    // 用户不存在
    if (!user) {
      console.log("User doesn't exist!");
      return res.render('error', {
        message: "用户不存在!"
      });
    }
    // 用户存在，比较密码
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
        return res.render('error', {
          message: err
        });
      }
      // 密码匹配
      if (isMatch) {
        // 设置session
        req.session.user = user;
        console.log("User login success!");
      }
      // 密码不匹配
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

// 更新个人信息
exports.updatedetail = function(req, res) {
  // 获取当前登录用户
  var local_user = req.session.user;
  // 获取更新信息
  var _user = req.body.user;
  // 创建更新用户
  var update_user = new User(local_user);
  // 获取更新用户名字
  var name = update_user.name;
  // 设置更新用户信息
  update_user["email"] = _user.email;
  update_user["phone"] = _user.phone;
  update_user["QQ"] = _user.QQ;
  update_user["address"] = _user.adr;
  update_user["college"] = _user.college;
  
  // 更新数据库
  User.update({name: name}, update_user, function(err) {
    if (err) {
      console.log(err);
    }
    // 重新设置session
    req.session.user = update_user;
    return res.redirect('/user/userdetail')
  });
};

// 更新密码
exports.updatepsw = function(req, res) {
  // 获取原密码，新密码
  var fpassword = req.body.fpsw;
  var password = req.body.psw;
  // 获取session用户
  var update_user = req.session.user;
  // 获取更新用户名字
  var name = update_user.name;
  // 测试输出
  console.log("former password " + fpassword);
  console.log("new password " + password);
  // 查找用户
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    // 比较原密码
    user.comparePassword(fpassword, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      // 原密码匹配
      if (isMatch) {
        // 加密密码
        user.updatepsw(password, function(err) {
          if (err) {
            console.log(err);
          }
          update_user.password = user.password;
          // 更新密码
          User.update({name: name}, update_user, function(err) {
            if (err) {
              console.log(err);
            }
          })
        });
      }
      // 原密码错误
      else {
        console.log('password is not matched!');
        return res.render('error', {message: '原密码错误'});
      }
      // 注销用户
      delete req.session.user;
      res.redirect('/')
    });
  });
};

// 登录要求
exports.loginreq = function(req, res, next) {
  // 获取session用户
  var _user = req.session.user;
  // 用户未登录
  if (!_user) {
    console.log("user does not login")
    return res.render('error', {message: "用户未登录!"});
  }
  next();
}

// 管理员要求
exports.adminreq = function(req, res, next) {
  // 获取登录用户权限
  var role = req.session.user.role;
  // 该用户为普通用户
  if (role == 0) {
    console.log("user cannot visit");
    return res.render('error', {message: "用户权限过低!"});
  }
  next();
}

// 获取用户列表
exports.list = function(req, res) {
  // 获取所有用户
  User.fetch(-1, function(err, userlist) {
    if (err) {
      return res.render('error', {message: err});
    }
    // 获取动作及被操作用户的名字
    var action = req.query.action;
    var name = req.query.name;
    // 测试输出
    console.log("action in userlist");
    console.log(action + ' ' + name);
    // 编辑用户个人信息
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
    // 删除用户
    else if (action == 'deleteuser') {
      // 删除用户
      User.remove({name: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }
      });
      console.log('delete user success');
      // 删除用户发布的丢失信息
      Lost.remove({username: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }
      });
      console.log('delete user lost message success');
      // 删除用户发布的拾取信息
      Found.remove({username: name}, function(err) {
        if (err) {
          return res.render('error', {message: err});
        }        
      })
      console.log('delete user found message success');
      res.redirect('userlist');
    }
    // 更新用户权限
    else if (action == 'downuserlevel' || action == 'upuserlevel') {
      User.findOne({name: name}, function(err, user) {
        if (err) {
          return res.render('error', {message: err});
        }
        // 获取被更新用户权限
        var role = user.role;
        // 更新
        if (action == 'downuserlevel')
          role = role - 1;
        else
          role = role + 1;
        // 更新数据库
        User.update({name: name}, {$set:{role: role}}, function(err) {
          if (err) {
            return res.render('error', {message: err});
          }
          console.log('update level success');
          res.redirect('userlist');
        });
      });
    }
    // 动作未知
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

// 更新某个用户
exports.edituser = function(req, res) {
  // 获取被更新用户及名字
  var edit = req.body.edit;
  var name = req.query.name;
  // 测试输出
  console.log('edit user ' + name);
  console.log(edit);
  User.findOne({name: name}, function(err, user) {
    if (err) {
      return res.render('error', {message: err});
    }
    // 更新信息
    user.email = edit.email;
    user.phone = edit.phone;
    user.QQ = edit.QQ;
    user.college = edit.college;
    user.address = edit.address;
    // 更新数据库
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
