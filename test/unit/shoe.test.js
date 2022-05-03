process.env.NODE_ENV = "test";

const shoe = require("../../models/shoe");
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.use(chaiHttp);

before((done) => {
  shoe.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  shoe.deleteMany({}, function (err) {});
  done();
});

describe("/Shoe Test Collection", () => {
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

  it("Verify that there are 0 types of shoe assets in the DB", (done) => {
    chai
      .request(server)
      .get("/api/shoe")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(0);
        done();
      });
  });
  it("POST valid shoe asset to DB", (done) => {
    let shoe = {
      name: "Shoe asset 1",
      color: "blue",
      style: "skirt",
      assetLocation: "/assets/",
    };
    chai
      .request(server)
      .post("/api/shoe")
      .send(shoe)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("Verify that there is 1 shoe asset in the DB", (done) => {
    chai
      .request(server)
      .get("/api/shoe")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.equal(1);
        done();
      });
  });
});
