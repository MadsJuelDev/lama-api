process.env.NODE_ENV = "test";

const user = require("../../models/User");
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.use(chaiHttp);

//Delete before and after this file is tested!
before((done) => {
  user.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  user.deleteMany({}, function (err) {});
  done();
});

describe("User Register & Login Error Unit Test Collection", () => {
  it("should try to register a user with invalid input and return a password error", (done) => {
    let user = {
      username: "1234abc",
      email: "1234@abc.dk",
      password: "1234a", //Faulty password - Joi/validation should catch this...
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400);

        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(
          '"password" length must be at least 6 characters long'
        );
        done();
      });
  });
  it("should try to register a user with invalid input and return a username error", (done) => {
    let user = {
      username: "1234a", //Faulty username - Joi/validation should catch this...
      email: "1234@abc.dk",
      password: "1234abc",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400);

        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(
          '"username" length must be at least 6 characters long'
        );
        done();
      });
  });
  it("should try to register a user with invalid input and return a email error", (done) => {
    let user = {
      username: "1234abc",
      email: "1234abc.dk", //Faulty email - Joi/validation should catch this...
      password: "1234abc",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400);

        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal('"email" must be a valid email');
        done();
      });
  });

  // This is needed for Login Routes
  it("Register succesfully for login unit test", (done) => {
    let user = {
      username: "1234abc",
      email: "1234@abc.dk",
      password: "1234abc",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });

  it("should try to login a user with invalid input and return a username error", (done) => {
    let user = {
      username: "1234ab", //Faulty username - Username does not exist
      password: "1234abc",
    };
    chai
      .request(server)
      .post("/api/user/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.error).to.be.equal("User does not exist");
        done();
      });
  });
  it("should try to login a user with invalid input and return a password error", (done) => {
    let user = {
      username: "1234abc",
      password: "1234ab", //Faulty password - password does not match (bcrypt)
    };
    chai
      .request(server)
      .post("/api/user/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.error).to.be.equal("Password is wrong");
        done();
      });
  });
});
