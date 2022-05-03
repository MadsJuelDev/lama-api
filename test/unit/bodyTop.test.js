process.env.NODE_ENV = "test";

const bodyTop = require("../../models/bodyTop");
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.use(chaiHttp);

before((done) => {
  bodyTop.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  bodyTop.deleteMany({}, function (err) {});
  done();
});

describe("/BodyTop Test Collection", () => {
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

  it("Verify that there are 0 types of bodyTop assets in the DB", (done) => {
    chai
      .request(server)
      .get("/api/bodyTop")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(0);
        done();
      });
  });
  it("POST valid bodyTop asset to DB", (done) => {
    let bodyTop = {
      name: "Top asset 1",
      color: "blue",
      style: "skirt",
      assetLocation: "/assets/",
    };
    chai
      .request(server)
      .post("/api/bodyTop")
      .send(bodyTop)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("Verify that there is 1 bodyTop asset in the DB", (done) => {
    chai
      .request(server)
      .get("/api/bodyTop")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(1);
        done();
      });
  });
});
