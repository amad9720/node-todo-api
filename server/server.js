// NOTE: This file will just be responsible for our ROOT
require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todos.js');
const {User} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

//giving a middleware json() form 'body-parser' to express.
app.use(bodyParser.json());

//In the todo App, the user will create then send the data via the POST request.
app.post('/todos', (req,res) => {
  var todo = new Todo(req.body);

  todo.save().then((doc) => {
    res.send(doc);
    //console.log(JSON.stringify(doc,undefined,3));
  }, (err) => {
    res.status(400).send(err);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ //we had to pass just the todos array but passing it to an object and passing this object to send is more flexible because we can add extra properties on it
      todos //ES6 syntax : same as "todos : todos"
    })
  }, (e) => {
    res.status(400).send(e);
  });
});

//What is fantastique with requests in Express is that you can pass variables to you URL . the pattern to do so is : inside of the string URL (first parameter for the app.get method), you pass the "/root/:variable" this will create a variable named variable inside the request (req) object so we can access it
app.get('/todos/:id', (req,res) => {
  //req.params is an object that have as it's key/vules paires the variables send in the URL and their values. {id : id_value};
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    console.log("Id not Valid");
    res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo)
      res.status(404).send("error todo undefined");

    res.send({todo}); //better to wrap the result in an object so you can add things to it andbe more flexible

  }).catch((e) => { //
    res.status(400).send("error with the then");
  });
//the catch above is used because of this error :
// UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Can't set headers after they are sent.
// (node:65376) DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.


});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = nulll;
  }

  Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/user', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken(); //this function return a promise and the value token as argument (see the user.js file).
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    console.log("-------Problem--------");
    if (err.code === 11000)
      console.log(`Please use another email this one is already used`);

    if (err.errors.email.properties.message == "{VALUE} is not a valid email")
      console.log(`${err.errors.email.properties.value} is not a valid email, please provide a valide email as example@domaine.com`);

    res.status(400).send(err);
  });
});

//+++++++++++++++++ the authentificate function is a middleware used by the GET /user/me route ++++++++++++++++++
//to unnderstand the link between these two see the video 5.Private Routes and Auth Middleware.mp4 at the 13th minute

//@ this function is in the file authentificate.js

// var authentificate = (req, res, next) => {
//   var token = req.header('x-auth');
//
//   //the model method to find a user by the token we get
//   User.findByToken(token).then((user) => {
//     if (!user) {
//       return Promise.reject(); //will be catch and handled with the catch block below just as we did it inside the try_catch inside user.js
//     }
//
//     req.user = user;
//     req.token = token;
//     next();
//
//   }).catch((err) => {
//     res.status(401).send("401 unhotorized authentification failed"); //authentification required
//   });
//
// }


app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};
