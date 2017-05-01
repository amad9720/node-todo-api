const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');



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

var User = mongoose.model('User', userSchema);


module.exports = {
  User
};
