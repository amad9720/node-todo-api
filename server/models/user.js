const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1,
    unique : true, //Avoid having duplicates email.
    validate : {
      validator : (value) => {
        return validator.isEmail(value);
      }, //this is same as validator : validator.isEmail because when we pass a function to validator, it argument will be defaulted to the value that we are validating... here the mail.
      message : '{VALUE} is not a valid email'
    }
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]

});

//there we define the instance functions... to be called with an instance of a model (STORED in the {methods} object)
userSchema.methods.toJSON = function () { //this is a predefined function of mongoose that we are overwriting... it is the function mongoose use to return the data to the client.
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() { //here we don't use arrow function because they dont bind a this keyword here and we need to bind a 'this' here
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(), access : access}, '123abc').toString();

  user.tokens.push({access, token});

  return user.save().then(() => { //here it's like we return a promise and the argument it will take to be tokens (see the comment below (**) )
    return token;
  }); // (**) :here we want to return a promise in wich we want to chain another then when called in server.js but instead of returning a promise we can just return the value wich would be passend to the then and it will still work
}; //on the methods object we can add all the methods we want to manage the Schema.

//there we define the model functions... to be called with the model itself (STORED in the {statics} object)
userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, '123abc'); //return the decoded object
  } catch (e) {
    // return new new Promise((resolve, reject) => {
    //   reject();
    // }); same as the code below but longer
    return Promise.reject();
  }

  //using the mongoose middleware : we are checking is the password is modified to hash it again and updating the hash before saving it.
  userSchema.pre('save', function() {
    var user = this;

    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }

  });

  return User.findOne({  // here we are using {'...'}  because of the nested properties we want to access, 'tokens.access' and 'tokens.token' (see the user schema) ..
    '_id' : decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  var user = this;

  user.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve,reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            resolve(user);
        }else {
          reject();
        }
      });
    });
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

var User = mongoose.model('User', userSchema);


module.exports = {
  User
};
