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

// Unit test collection for User
// unit test #1(the "it" argument) is for Register
// unit test #2(the "it" argument) is for Login

//        Possible unit tests to consider for future:
//        Profile Character Get Route.

describe("/User Register & Login Test Collection", () => {
  it("Register User unit test", (done) => {
    //define User frontend input
    let user = {
      username: "abc1234",
      email: "abc@1234.dk",
      password: "abc1234",
    };
    // Chai test goes here
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        expect(res.body.error).to.be.equal(null);
        done();
      });
  });
  it("Login User unit test", (done) => {
    let user = {
      username: "abc1234",
      password: "abc1234",
    };
    chai
      .request(server)
      .post("/api/user/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.error).to.be.equal(null);
        let token = res.body.data.token;
        console.log("Your token is: ", token);
        done();
      });
  });
});
