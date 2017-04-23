const mongoose = require('mongoose');

//Even if we don't have the connection established yet, mongoose will wait it before doing the Queries.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
