// NOTE: This file will just be responsible for our ROOT
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todos.js');
var {User} = require('./models/user.js');

var app = express();

//giving a middleware json() form 'body-parser' to express.
app.use(bodyParser.json());

//In the todo App, the user will create then send the data via the POST request.
app.post('/todos', (req,res) => {
  var todo = new Todo(req.body);

  todo.save().then((doc) => {
    res.send(doc);
    console.log(JSON.stringify(doc,undefined,3));
  }, (err) => {
    res.status(400).send(err);
  });

});




app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
}
