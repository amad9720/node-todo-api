const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDB server : ', err );
  console.log('connected to MongoDB server');

  //the find method without arg is for fetching all documents : return a mongodb cursor (a pointer to the documents ) in the collection
  // NOTE: the find methd can also take a query object. this object is like a filter for the records you want to find
  // NOTE: this cursor object has methods on it that we are going to use
  // NOTE: toArray() return the documents. It's also a promise sO WE CAN HANDLE SUCCESS and failure cases.
  db.collection('Todos').find({
    _id : new ObjectID('58fbe3d24807b9ee4acdc316')
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 3));
  }, (err) => {
    console.log('Unable to fetch todos :', err);
  });

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count : ${count}`);
  }, (err) => {
    console.log('Unable to Count Todos :', err);
  });

  //at the end we have to close the connection to the db
  db.close();
});
