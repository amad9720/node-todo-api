const mongoose = require('mongoose');

//Even if we don't have the connection established yet, mongoose will wait it before doing the Queries.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Unlike mongodb,mongoose create a model of data for storing the datas
// NOTE: It's looks like SQL model when you create a table with different columns
// NOTE: var Todo = mongoose.model('modelName', {modelStructure as an Object});
// NOTE: After creating the model, we have to instanciate it

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

//Creating an instance of the model... a document... a row (in sql)
var newTodo = new Todo({
  text : 'Cook dinner'
});

//Saving the record inside the collection (the model). the save call will do the job, it will return a DB.
newTodo.save().then((doc) => {
  console.log('Saved todo : ', JSON.stringify(doc, undefined, 3));
}, (err) => {
  console.log('Unable to save todo : ', err)
});

var newTodo2 = new Todo({
  text : 'Finish Node Tutos',
  completed : false
});

newTodo2.save().then((doc) => {
  console.log('Saved todo : ', JSON.stringify(doc, undefined, 3));
}, (err) => {
  console.log('Unable to save todo : ', err);
});

var User = mongoose.model('User', {
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1
  }
});

var myUser = new User({
  email : 'amly212782@gmail.com'
});

myUser.save().then((doc) => {
  console.log('Saved todo : ', JSON.stringify(doc, undefined, 3));
}, (err) => {
  console.log('Unable to save todo : ', err);
});
