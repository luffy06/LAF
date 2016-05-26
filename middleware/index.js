var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.init = function(req, res) {
  var user = new User();
  user.name = "admin";
  user.password = "123456";
  user.QQ = "534427411";
  User.findOne({name: user.name}, function(err, _user) {
    if (err) {
      console.log(err);
      return res.render('error', {
        message: err
      });
    }
    console.log("In index init!")
    if (!user) {
      console.log("admin not exist!")
      user.save(function(err, res_user) {
        if (err) {
          console.log(err);
          return res.render('error', {
            message: err
          });          
        }
      })
    }
    res.render('index', {title: 'Index'});
  });
}