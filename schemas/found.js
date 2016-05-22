// 引入mongoose数据库管理，引入用户模式
var mongoose = require('mongoose');
var User = require('./user');

// 拾取信息模式定义
var foundSchema = new mongoose.Schema({
  username: String,
  useremail: String,
  userphone: Number,
  userQQ: Number,
  usercollege: String,
  cardtype: String,
  number: String,
  year: Number,
  month: Number,
  day: Number,
  time: String,
  place: String,
  detail: String,
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
foundSchema.pre('save', function(next) {
  var found = this;

  // 设置更新时间
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next();
});

// 静态方法
foundSchema.statics = {
  // 根据cmp来获取更新拾取信息并排序
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'meta.updateAt': cmp})
      .exec(cb)
  }
}

module.exports = foundSchema;