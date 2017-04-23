const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDB server : ', err );
  console.log('connected to MongoDB server');

  //the find method without arg is for fetching all documents : return a mongodb cursor (a pointer to the documents ) in the collection
  // NOTE:
  // NOTE:
  // NOTE:

  //deleteMany
    // db.collection('Todos').deleteMany({text : 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

  //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

  //findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed : false}).then((result) => {
      console.log(result);
    });

    db.collection('Todos').findOneAndDelete({_id : new ObjectID('58fc793bf64f64224424a4c8')}).then((result) => {
      console.log(result);
    });

  //at the end we have to close the connection to the db
  //db.close();
});
