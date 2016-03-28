var mongoose = require('mongoose');
var User = require('./user');

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

foundSchema.pre('save', function(next) {
  var found = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next();
});

foundSchema.statics = {
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'meta.updateAt': cmp})
      .exec(cb)
  }
}

module.exports = foundSchema;