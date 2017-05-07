//================ hashing and salting automatically using bcryptjs =======================//
const bcrypt = require('bcryptjs');

var password = "Malanius";

bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (error, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$7AJzzbYKHcUgFZDYYjJG6.9d2TLTfSmtusbvVSUmccOVgFlu80JBK';

//compare the value to see if it match the hashed value
bcrypt.compare(password, hashedPassword, (err, res) => { //result is true or false.
  console.log(res);
});

//================ hashing manually using crypto-js =======================//

// const {SHA256} = require('crypto-js');// const {SHA256} = require('crypto-js');

// var message = "I am User number 3";
// var hash = SHA256(message).toString();
// var salt = 'somesecret'; //some secret is the salt here.
//
// console.log(`message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id : 4
// };
//
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + salt).toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();
//
// if (resultHash === token.hash) {
//   console.log('Data no manipulated you can trust');
// } else {
//   console.log('Data have been manipulated don\'t trust');
// }

//the exemple above are actually part of a convention named JSON Web Tokens (JWT)
//So because of that there is a library that handles all matters about JWTs. We dont have to handle it ourselves like above, we can just install the library.

//=============== Hashing using JWTs ===================//
//
// const jwt = require('jsonwebtoken');
//
// //we will use these two methods
// // jwt.sign //take the object (data object with the user id, and the salt as 2nd param) and signs it... create the hash and return the token value
// // jwt.verify // does the opposite take the data and the salt to make sure that the data was not manipulated.
//
//
// var data = {
//   id : 4
// };
//
// var token = jwt.sign(data, '123abc');
// console.log('token : ', token);
//
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded : ', decoded);
