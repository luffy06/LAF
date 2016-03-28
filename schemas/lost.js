var mongoose = require('mongoose');
var User = require('./user');

var lostSchema = new mongoose.Schema({
  username: String,
  useremail: String,
  userphone: String,
  usercollege: String,
  userQQ: Number,
  cardtype: String,
  number: String,
  year: Number,
  month: Number,
  time: String,
  day: Number,
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

lostSchema.pre('save', function(next) {
  var lost = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next();
});

lostSchema.statics = {
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'meta.updateAt': cmp})
      .exec(cb)
  }
}

module.exports = lostSchema;