process.env.NODE_ENV = "test";

const hair = require("../../models/hair");
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.use(chaiHttp);

before((done) => {
  hair.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  hair.deleteMany({}, function (err) {});
  done();
});

describe("/Hair Test Collection", () => {
  it("Test default welcome message route", (done) => {
    //actual test in here
    chai
      .request(server)
      .get("/api/welcome")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal("Welcome to the character creator API");
        done();
      });
  });

  it("Verify that there are 0 types of hair assets in the DB", (done) => {
    chai
      .request(server)
      .get("/api/hair")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(0);
        done();
      });
  });
  it("POST valid hair asset to DB", (done) => {
    let hair = {
      name: "Hair asset 1",
      color: "black",
      style: "bun",
      assetLocation: "/assets/",
    };
    chai
      .request(server)
      .post("/api/hair")
      .send(hair)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("Verify that there is 1 hair asset in the DB", (done) => {
    chai
      .request(server)
      .get("/api/hair")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(1);
        done();
      });
  });
});
