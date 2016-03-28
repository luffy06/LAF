var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

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

userSchema.pre('save', function(next) {
  var user = this;

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
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

userSchema.methods = {
  comparePassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) 
        return cb(err);
      cb(null, isMatch);
    });
  },
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

userSchema.statics = {
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'role': cmp})
      .exec(cb)
  },
  findByName: function(name, cb) {
    return this
      .findOne({name: name})
      .exec(cb)
  }
}

module.exports = userSchema;