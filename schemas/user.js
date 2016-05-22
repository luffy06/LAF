// 引入mongoose数据库管理，引入bcrypt进行密码加密，设置盐为10
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

// 用户模式定义
var userSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  // 0 normal
  // 1 admin
  // 2 super admin
  role: {
    type: Number,
    default: 0
  },
  password: String,
  college: String,
  email: String,
  phone: String,
  QQ: Number,
  address: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    }, 
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 保存信息前预先处理
userSchema.pre('save', function(next) {
  var user = this;

  // 设置更新时间
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  // 利用bcrypt进行加密
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err)
      return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err)
        return next(err);
      user.password = hash;
      next();
    })
  })
});

// 自定义方法
userSchema.methods = {
  // 比较密码
  comparePassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) 
        return cb(err);
      cb(null, isMatch);
    });
  },
  // 更新密码
  updatepsw: function(password, cb) {
    var user = this;

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err)
        return cb(err);
      bcrypt.hash(password, salt, function(err, hash) {
        if (err)
          return cb(err);
        user.password = hash;
        cb(null);
      });
    })
  }
}

// 静态方法
userSchema.statics = {
  // 根据cmp来获取更新用户并排序
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'role': cmp})
      .exec(cb)
  },
  // 依据用户名查找用户
  findByName: function(name, cb) {
    return this
      .findOne({name: name})
      .exec(cb)
  }
}

module.exports = userSchema;