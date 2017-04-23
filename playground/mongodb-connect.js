//setting the mongoClient : the mongoClient allows you to connect to a mongo serveur and issue command to manipulate the DB.

//the 3 const declaration below are identical
  //const MongoClient = require('mongodb').MongoClient; //default call

  // const mongodb = require('mongodb'); //call with destructuring
  // const {MongoClient} = mongodb;

const {MongoClient, ObjectID} = require('mongodb');

//This is a way to generate ids using mongodb... cool right
  // var obj = new ObjectID();
  // console.log(obj);

// console.log(require('mongodb'));

//object destructuring is a feature in ES6 that allow s us to segment an object and pull it's properties into variables
/*
    //we create the object
      var object = {
        name : "Amadou",
        age : 27,
        location : 'Bussy saint georges'
      };

    //we destructure it (segment it into variables)
      var {name} = object;
      var {age} = object;
      var {location} = object;

      //same as
      var {name,age,location} = object;

    console.log(name,age,location);
      //outputs : Amadou 27 Bussy saint georges
*/


//the connect method of the MongoClient object is used to connect to a database
  // NOTE:first argument :  The url is the serveur where the DB sit. Because you are connecting to mongodb, you have to use the mongodb protocole : mongodb://address:port:databaseName
  // NOTE: second argument : The callback function executed when the connection is completed. The callback function have two arguments. an error object and a db object which is the database

MongoClient.connect('mongodb://localhost:27017/Todo', (err, db) => {
  if (err) return console.log('Unable to connect to MongoDB server : ', err );

  console.log('connected to MongoDB server');

  //create a collection (the collection will be created in the fly just as the database was... there is no need for a command to do it like in SQL)
  db.collection('Todos').insertOne({
    text : 'Work for Soficom to do',
    completed : false
  }, (err,result) => { //err for the feedback in case of the query fail and result in case of success
    if (err) {
      return console.log('Unable to insert into Todo :', err);
    }

    //the ops property stores all of the doc that was inserted in the collection
    console.log(JSON.stringify(result.ops, undefined, 3));
    //console.log(result);
  });

  db.collection('Users').insertOne({
    name : 'Ismael',
    age : 21,
    email : 'isma212782@gmail.com',
    location : 'Bourg en province  '
  }, (err, result) => {
    if (err) return console.log('Unable to create the document inside Users : ', err);
    console.log(JSON.stringify(result.ops, undefined, 3));

    //result.ops._id : it's an object an we can access ll the elements
    console.log(result.ops[0]._id.getTimestamp());
  });

  //at the end we have to close the connection to the db
  db.close();
});
