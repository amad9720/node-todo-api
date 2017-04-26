const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {ObjectID} = require('mongodb');
const {User} = require('./../server/models/user');

var id = '59001be680adc567d601f57b'; //if the id is a valid objectid it's ok but if it's not you have to validate it by using a catch function or yu can also use the ObjectID object from the mondodb library
var id_challenge = '58fd08563d5ecb0f928b289b';

if (!ObjectID.isValid(id)) {
  console.log("Id not Valid");
}


//return all the set of matched element

Todo.find({
  _id : id
}).then((todos) => {
  console.log('   ---Test for find()--- \n');
  console.log('Todos-findAllMatched :', JSON.stringify(todos,undefined,2));
})

//return only the first matched query from the set

Todo.findOne({
  _id : id
}).then((todo) => {
  console.log('   ---Test for findOne()--- \n');
  console.log('Todo-findOneMatched : ', JSON.stringify(todo,undefined,2));
});

//return element by id

Todo.findById(id).then((todo) => {
  console.log('   ---Test for findById()--- \n');
  if(!todo) return console.log('Id not found');
  console.log('Todo-byId : ', JSON.stringify(todo,undefined,2));
});//.catch((e) => console.log(e)); solution 1


User.findById(id_challenge).then((user) => {
  console.log('  ---CHALLENGE---\n');
  if (!user) return console.log('Unable to find user');
  console.log('User-byId : ', JSON.stringify(user,undefined,2));
}, (e) => {
  console.log(e);
});
