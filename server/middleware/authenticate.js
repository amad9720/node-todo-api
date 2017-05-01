var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  //the model method to find a user by the token we get
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject(); //will be catch and handled with the catch block below just as we did it inside the try_catch inside user.js
    }

    req.user = user;
    req.token = token;
    next();

  }).catch((err) => {
    res.status(401).send("401 unhotorized authentification failed"); //authentification required
  });

}

module.exports = {
  authenticate
};
