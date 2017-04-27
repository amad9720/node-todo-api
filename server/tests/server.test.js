const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {ObjectID} = require('mongodb');

const todos = [
  {
    _id : new ObjectID(),
    text : "First test todo"
  }, {
    _id : new ObjectID(),
    text : "Second test todo"
  }
];

// NOTE:  beforeEach : run code before any single test code (meanning before any it(...))
beforeEach(function (done) {
  // empty the Todos Collection in the db
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /Todo',  () => {
  it('should Create a new todo', function (done) {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200) //for the status code
      .expect((res) => {
        expect(res.body.text).toBe(text);

      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.find({text}).then((todos) => { //the todos parameter here is what was returned by the promise (find)
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalide data', function (done) {
    request(app)
      .post('/todos')
      .send({}) //bad data given... Because we configured the models of the Todo Collection with required text attribute.
      .expect(400) //codeStatus 400 : bad request
      .expect((res) => {

      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          // expect(todos[0]).toBe(); //the array is empty ... when the toBe function is without parameter it's mean undefined
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /Todo',  () => {
  it('should Get all todos', function (done) {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).end(done); // no need to pass a function here as in the post test because we are doing anything async here
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString(); //convert the generated new object id to a string.

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
