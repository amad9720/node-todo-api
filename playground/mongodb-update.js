const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDB server : ', err );
  console.log('connected to MongoDB server');

  //the find method without arg is for fetching all documents : return a mongodb cursor (a pointer to the documents ) in the collection
  // NOTE:
  // NOTE:
  // NOTE:

  db.collection('Todos').findOneAndUpdate({
    _id : new ObjectID('58fc793bf64f64224424a4c8')
  },{
    $set : {
      completed : false
    }
  },{
    returnOriginal : false
  })
  .then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
    age : {$lt : 10}
  },{
    $set : {
      name : "Kema",
      location : "Lille France"
    },
    $inc : {age : +1}
  },{
    returnOriginal : false
  }).then((result) => {
    console.log(result);
  });

  //at the end we have to close the connection to the db
  //db.close();
});
