const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todos');

// NOTE:  beforeEach : run code before any single test code (meanning before any it(...))
beforeEach(function (done) {
  // empty the Todos Collection in the db
  Todo.remove({}).then(() => done());
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

        Todo.find().then((todos) => { //the todos parameter here is what was returned by the promise (find)
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
          expect(todos.length).toBe(0);
          expect(todos[0]).toBe(); //the array is empty ... when the toBe function is without parameter it's mean undefined
          done();
        }).catch((e) => done(e));
      })
  });
});
