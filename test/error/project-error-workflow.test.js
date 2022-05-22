process.env.NODE_ENV = "test";

const chai = require("chai");
const user = require("../../models/User");
const projects = require("../../models/Projects");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");
chai.use(chaiHttp);

before((done) => {
  user.deleteMany({}, function (err) {});
  projects.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  user.deleteMany({}, function (err) {});
  projects.deleteMany({}, function (err) {});
  done();
});

describe("Project workflow tests", () => {
  it("should register + login a user, verify 0 projects in DB, create a invalid project and verify 0 in DB", (done) => {
    // 1) Register a new LaMa user
    let user = {
      username: "abc1234",
      email: "abc@1234.dk",
      password: "abc1234",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Attributes a responses should have
        res.should.have.status(200);
        res.body.should.be.a("object");
        expect(res.body.error).to.be.equal(null);

        let newlyCreatedUser = {
          username: "abc1234",
          password: "abc1234",
        };
        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send(newlyCreatedUser)
          .end((err, res) => {
            // Attributes a responses should have
            res.should.have.status(200);
            expect(res.body.error).to.be.equal(null);
            //Setting JWT token for Verification further
            let token = res.body.data.token;

            // 3) Verify No projects in test DB
            chai
              .request(server)
              .get("/api/projects/userId/abc1234")
              .end((err, res) => {
                // Attributes a responses should have
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(0);

                // 4) Create new Project
                let project = {
                  name: "",
                  projectId: "IAmAUniqueId",
                  userId: "abc1234",
                  collabIdOne: "",
                  collabIdTwo: "",
                  collabIdThree: "",
                  collabIdFour: "",
                };

                chai
                  .request(server)
                  .post("/api/projects/")
                  .set({ authtoken: token })
                  .send(project)
                  .end((err, res) => {
                    // Attributes a responses should have
                    expect(res.status).to.be.equal(403);
                    expect(res.body).to.be.a("object");
                    expect(res.body.error).to.be.equal("Project needs a name!");
                    // 5) Verify one project added to the test DB
                    chai
                      .request(server)
                      .get("/api/projects/userId/abc1234")
                      .end((err, res) => {
                        // Attributes a responses should have
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(0);

                        done();
                      });
                  });
              });
          });
      });
  });

  it("should register + login a user, create two projects with the same name", (done) => {
    // 1) Register a new LaMa user
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
        // Attributes a responses should have
        res.should.have.status(200);
        res.body.should.be.a("object");
        expect(res.body.error).to.be.equal(null);

        let newlyCreatedUser = {
          username: "1234abc",
          password: "1234abc",
        };
        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send(newlyCreatedUser)
          .end((err, res) => {
            // Attributes a responses should have
            res.should.have.status(200);
            expect(res.body.error).to.be.equal(null);
            //Setting JWT token for Verification further
            let token = res.body.data.token;

            // 3) Verify No projects in test DB
            chai
              .request(server)
              .get("/api/projects/userId/1234abc")
              .end((err, res) => {
                // Attributes a responses should have
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(0);

                // 4) Create new Project
                let project = {
                  name: "Todo LaMa App 2",
                  projectId: "IAmAUniqueId2",
                  userId: "1234abc",
                  collabIdOne: "",
                  collabIdTwo: "",
                  collabIdThree: "",
                  collabIdFour: "",
                };

                chai
                  .request(server)
                  .post("/api/projects/")
                  .set({ authtoken: token })
                  .send(project)
                  .end((err, res) => {
                    // Attributes a responses should have
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    let savedProject = res.body[0];
                    expect(savedProject.name).to.be.equal(project.name);
                    expect(savedProject.projectId).to.be.equal(
                      project.projectId
                    );
                    expect(savedProject.userId).to.be.equal(project.userId);
                    expect(savedProject.collabIdOne).to.be.equal(
                      project.collabIdOne
                    );
                    expect(savedProject.collabIdTwo).to.be.equal(
                      project.collabIdTwo
                    );
                    expect(savedProject.collabIdThree).to.be.equal(
                      project.collabIdThree
                    );
                    expect(savedProject.collabIdFour).to.be.equal(
                      project.collabIdFour
                    );

                    // 5) Verify one project added to the test DB
                    chai
                      .request(server)
                      .get("/api/projects/userId/1234abc")
                      .end((err, res) => {
                        // Attributes a responses should have
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(1);

                        // 6) Create new Project with the same name
                        let projectTwo = {
                          name: "Todo LaMa App 2",
                          projectId: "IAmAUniqueId2",
                          userId: "1234abc",
                          collabIdOne: "",
                          collabIdTwo: "",
                          collabIdThree: "",
                          collabIdFour: "",
                        };

                        chai
                          .request(server)
                          .post("/api/projects/")
                          .set({ authtoken: token })
                          .send(projectTwo)
                          .end((err, res) => {
                            // Attributes a responses should have
                            expect(res.status).to.be.equal(403);
                            expect(res.body).to.be.a("object");
                            expect(res.body.error).to.be.equal(
                              "Project Name already exists"
                            );

                            // 7) Verify only one project was added to the test DB
                            chai
                              .request(server)
                              .get("/api/projects/userId/1234abc")
                              .end((err, res) => {
                                // Attributes a responses should have
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.a("array");
                                expect(res.body.length).to.be.eql(1);
                                done();
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  // **********----------- Skal måske laves så man ikke kan
  // **********----------- tilføje den samme person flere gange :)))
  // update/add a collaborator to the list
  //   it("should register + login a user, create project and update/add a collaborator", (done) => {
  //     // 1) Register a new LaMa user
  //     let user1 = {
  //       username: "1234abcd",
  //       email: "1234@abcd.dk",
  //       password: "1234abcd",
  //     };
  //     let user2 = {
  //       username: "12345abc",
  //       email: "12345@abc.dk",
  //       password: "12345abc",
  //     };
  //     chai
  //       .request(server)
  //       .post("/api/user/register")
  //       .send(user1, user2)
  //       .end((err, res) => {
  //         // Attributes a responses should have
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         expect(res.body.error).to.be.equal(null);

  //         let newlyCreatedUser = {
  //           username: "1234abcd",
  //           password: "1234abcd",
  //         };
  //         // 2) Login the user
  //         chai
  //           .request(server)
  //           .post("/api/user/login")
  //           .send(newlyCreatedUser)
  //           .end((err, res) => {
  //             // Attributes a responses should have
  //             res.should.have.status(200);
  //             expect(res.body.error).to.be.equal(null);
  //             //Setting JWT token for Verification further
  //             let token = res.body.data.token;

  //             // 3) Verify No projects in test DB
  //             chai
  //               .request(server)
  //               .get("/api/projects/userId/1234abcd")
  //               .end((err, res) => {
  //                 // Attributes a responses should have
  //                 expect(res.status).to.be.equal(200);
  //                 expect(res.body).to.be.a("array");
  //                 expect(res.body.length).to.be.eql(0);

  //                 // 4) Create new Project
  //                 let project = {
  //                   name: "Todo LaMa App 3",
  //                   projectId: "IAmAUniqueId3",
  //                   userId: "1234abcd",
  //                   collabIdOne: "",
  //                   collabIdTwo: "",
  //                   collabIdThree: "",
  //                   collabIdFour: "",
  //                 };

  //                 chai
  //                   .request(server)
  //                   .post("/api/projects/")
  //                   .set({ authtoken: token })
  //                   .send(project)
  //                   .end((err, res) => {
  //                     // Attributes a responses should have
  //                     expect(res.status).to.be.equal(201);
  //                     expect(res.body).to.be.a("array");
  //                     expect(res.body.length).to.be.eql(1);

  //                     let savedProject = res.body[0];
  //                     expect(savedProject.name).to.be.equal(project.name);
  //                     expect(savedProject.projectId).to.be.equal(
  //                       project.projectId
  //                     );
  //                     expect(savedProject.userId).to.be.equal(project.userId);
  //                     expect(savedProject.collabIdOne).to.be.equal(
  //                       project.collabIdOne
  //                     );
  //                     expect(savedProject.collabIdTwo).to.be.equal(
  //                       project.collabIdTwo
  //                     );
  //                     expect(savedProject.collabIdThree).to.be.equal(
  //                       project.collabIdThree
  //                     );
  //                     expect(savedProject.collabIdFour).to.be.equal(
  //                       project.collabIdFour
  //                     );

  //                     // 5) Verify one project added to the test DB
  //                     chai
  //                       .request(server)
  //                       .get("/api/projects/userId/1234abcd")
  //                       .end((err, res) => {
  //                         // Attributes a responses should have
  //                         expect(res.status).to.be.equal(200);
  //                         expect(res.body).to.be.a("array");
  //                         expect(res.body.length).to.be.eql(1);

  //                         // 6) update the project with a collaborator
  //                         let updateProject = {
  //                           name: "Todo LaMa App 3",
  //                           projectId: "IAmAUniqueId3",
  //                           userId: "1234abcd",
  //                           collabIdOne: "12345abc",
  //                           collabIdTwo: "",
  //                           collabIdThree: "",
  //                           collabIdFour: "",
  //                         };
  //                         chai
  //                           .request(server)
  //                           .put("/api/projects/" + savedProject._id)
  //                           .set({
  //                             authtoken: token,
  //                           })
  //                           .send(updateProject)
  //                           .end((err, res) => {
  //                             // Asserts
  //                             expect(res.status).to.be.equal(200);
  //                             const actualVal = res.body.message;
  //                             expect(actualVal).to.be.equal(
  //                               "Project was succesfully updated!"
  //                             );

  //                             // 7) Verify project was updated in test DB
  //                             chai
  //                               .request(server)
  //                               .get("/api/projects/all/12345abc")
  //                               .set({
  //                                 authtoken: token,
  //                               })
  //                               .end((err, res) => {
  //                                 // Attributes a responses should have
  //                                 expect(res.status).to.be.equal(200);
  //                                 expect(res.body).to.be.a("array");
  //                                 expect(res.body.length).to.be.eql(1);
  //                                 done();
  //                               });
  //                           });
  //                       });
  //                   });
  //               });
  //           });
  //       });
  //   });
});
