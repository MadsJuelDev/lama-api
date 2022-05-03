process.env.NODE_ENV = "test";

const chai = require("chai");
const user = require("../../models/user");
const bBottom = require("../../models/bodyBottom");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../../server");
chai.use(chaiHttp);

before((done) => {
  user.deleteMany({}, function (err) {});
  bBottom.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  user.deleteMany({}, function (err) {});
  bBottom.deleteMany({}, function (err) {});
  done();
});

describe("User workflow tests", () => {
  it("should register + login a user, create product and verify 1 in DB", (done) => {
    // 1) Register new user
    let user = {
      name: "Mads Larsen",
      email: "mads@larsen.dk",
      password: "123456",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send({
            email: "mads@larsen.dk",
            password: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new Hair Asset
            let hair = {
              name: "Hair asset 2",
              color: "Green",
              style: "bun",
              assetLocation: "/assets/",
            };

            chai
              .request(server)
              .post("/api/hair")
              .set({ "auth-token": token })
              .send(hair)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedHair = res.body[0];
                expect(savedHair.name).to.be.equal(hair.name);
                expect(savedHair.color).to.be.equal(hair.color);
                expect(savedHair.style).to.be.equal(hair.style);
                expect(savedHair.assetLocation).to.be.equal(hair.assetLocation);

                // 4) Verify one product in test DB
                chai
                  .request(server)
                  .get("/api/hair")
                  .end((err, res) => {
                    // Assets
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    done();
                  });
              });
          });
      });
  });

  it("should register + login a user, create product and delete it from DB", (done) => {
    // 1) Register new user
    let user = {
      name: "Lars Madsen",
      email: "lars@madsen.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send({
            email: "lars@madsen.com",
            password: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new asset
            let bodyBottom = {
              name: "Skirt 1",
              color: "Green",
              style: "skrit",
              assetLocation: "hello.dk/whatup.png",
            };

            chai
              .request(server)
              .post("/api/bodyBottom")
              .set({ "auth-token": token })
              .send(bodyBottom)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedAsset = res.body[0];
                expect(savedAsset.name).to.be.equal(bodyBottom.name);
                expect(savedAsset.color).to.be.equal(bodyBottom.color);
                expect(savedAsset.style).to.be.equal(bodyBottom.style);
                expect(savedAsset.assetLocation).to.be.equal(
                  bodyBottom.assetLocation
                );

                // 4) Delete product
                chai
                  .request(server)
                  .delete("/api/bodyBottom/" + savedAsset._id)
                  .set({ "auth-token": token })
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    const actualVal = res.body.message;
                    expect(actualVal).to.be.equal(
                      "bodyBottom was succesfully deleted!"
                    );
                    done();
                  });
              });
          });
      });
  });

  it("should register user with invalid input", (done) => {
    // 1) Register new user with invalid inputs
    let user = {
      name: "Peter Petersen",
      email: "mail@petersen.com",
      password: "123", //Faulty password - Joi/validation should catch this...
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400); //normal expect with no custom output message
        //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail

        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(
          '"password" length must be at least 6 characters long'
        );
        done();
      });
  });
});
