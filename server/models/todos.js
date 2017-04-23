var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text :{
    type : String,
    required : true, //this attribute has to be provided
    minlength : 1,    //the attribute can't be empty      ---> these are properties for validation
    trim : true // remode the white space
  },
  completed : {
    type : Boolean,
    default : false
  },
  completedAt : {
    type : Number,
    default : null
  }
});

module.exports = {
  Todo
};
