process.env.NODE_ENV = "test";

const chai = require("chai");
const user = require("../../models/User");
const projects = require("../../models/Projects");
const tasks = require("../../models/Tasks");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server");
const moment = require("moment");

// Elequent Date hack
let todayDate = moment().format("DD/MM/YYYY");
let one = moment(todayDate, "DD/MM/YYYY").add(1, "days");
let dateOne = moment(one).format("DD/MM/YYYY");
let two = moment(todayDate, "DD/MM/YYYY").add(2, "days");
let dateTwo = moment(two).format("DD/MM/YYYY");
let three = moment(todayDate, "DD/MM/YYYY").add(3, "days");
let dateThree = moment(three).format("DD/MM/YYYY");
let four = moment(todayDate, "DD/MM/YYYY").add(4, "days");
let dateFour = moment(four).format("DD/MM/YYYY");
let five = moment(todayDate, "DD/MM/YYYY").add(5, "days");
let dateFive = moment(five).format("DD/MM/YYYY");
let six = moment(todayDate, "DD/MM/YYYY").add(6, "days");
let dateSix = moment(six).format("DD/MM/YYYY");
let seven = moment(todayDate, "DD/MM/YYYY").add(7, "days");
let dateSeven = moment(seven).format("DD/MM/YYYY");

chai.use(chaiHttp);

before((done) => {
  user.deleteMany({}, function (err) {});
  projects.deleteMany({}, function (err) {});
  tasks.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  user.deleteMany({}, function (err) {});
  projects.deleteMany({}, function (err) {});
  tasks.deleteMany({}, function (err) {});
  done();
});

describe("Task error workflow tests", () => {
  it("should register + login a user, verify 0 projects in DB, create a project and verify 1 in DB, verify 0 tasks in db, attempt to create a task with no name in the db under the project and verify 0 task in db", (done) => {
    // 1) Register a new LaMa user
    let user = {
      username: "bbbbbb",
      email: "bbb@bbb.dk",
      password: "bbbbbb",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        res.should.have.status(200);
        res.body.should.be.a("object");
        expect(res.body.error).to.be.equal(null);

        let newlyCreatedUser = {
          username: "bbbbbb",
          password: "bbbbbb",
        };
        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send(newlyCreatedUser)
          .end((err, res) => {
            // Assert
            res.should.have.status(200);
            expect(res.body.error).to.be.equal(null);
            //Setting JWT token for Verification further
            let token = res.body.data.token;

            // 3) Verify no projects in test DB
            chai
              .request(server)
              .get("/api/projects/userId/bbbbbb")
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(0);

                // 4) Create new Project
                let project = {
                  name: "Todo LaMa App",
                  projectId: "IAmAUniqueId",
                  userId: "bbbbbb",
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
                    // Asserts
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
                      .get("/api/projects/userId/bbbbbb")
                      .set({ authtoken: token })
                      .end((err, res) => {
                        // Asserts
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(1);

                        // 6) Verify No tasks in test DB
                        chai
                          .request(server)
                          .get("/api/tasks/bbbbbb/false")
                          .set({ authtoken: token })
                          .end((err, res) => {
                            // Asserts
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.be.eql(0);

                            // 7) Attempt to create a task without the required name and expect an error 500
                            let task = {
                              archived: false,
                              isCollapsed: true,
                              date: "",
                              description: "",
                              urgency: "",
                              status: "To Do",
                              projectId: "IAmAUniqueId",
                              task: "",
                              userId: "bbbbbb",
                            };

                            chai
                              .request(server)
                              .post("/api/tasks/")
                              .set({ authtoken: token })
                              .send(task)
                              .end((err, res) => {
                                //  Asserts
                                expect(res.status).to.be.equal(500);
                                res.body.should.be.a("object");
                                expect(res.body.message).to.not.equal(null);

                                // 8) Verify no task in the test DB
                                chai
                                  .request(server)
                                  .get("/api/tasks/bbbbbb/false")
                                  .set({ authtoken: token })
                                  .end((err, res) => {
                                    // Assert
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
          });
      });
  });
  it("login the user, verify 1 projects in DB, verify 1 tasks in db, create a task in the db under the project, fail to update it, and verify 1 task in db", (done) => {
    let newlyCreatedUser = {
      username: "bbbbbb",
      password: "bbbbbb",
    };
    // 1) Login the user
    chai
      .request(server)
      .post("/api/user/login")
      .send(newlyCreatedUser)
      .end((err, res) => {
        // Assert
        res.should.have.status(200);
        expect(res.body.error).to.be.equal(null);
        //Setting JWT token for Verification further
        let token = res.body.data.token;

        // 2) Verify one existing projects in test DB
        chai
          .request(server)
          .get("/api/projects/userId/bbbbbb")
          .end((err, res) => {
            // Assert
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.eql(1);

            // 3) Verify no existing task in test DB
            chai
              .request(server)
              .get("/api/tasks/bbbbbb/false")
              .set({ authtoken: token })
              .end((err, res) => {
                // Assert
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(0);

                // 4) Create a task
                let task2 = {
                  archived: false,
                  isCollapsed: true,
                  date: "",
                  description: "",
                  urgency: "",
                  status: "To Do",
                  projectId: "IAmAUniqueId2",
                  task: "test2",
                  userId: "bbbbbb",
                };

                chai
                  .request(server)
                  .post("/api/tasks/")
                  .set({ authtoken: token })
                  .send(task2)
                  .end((err, res) => {
                    // Assert
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    let createdTask = res.body[0];
                    expect(createdTask.archived).to.be.equal(task2.archived);
                    expect(createdTask.isCollapsed).to.be.equal(
                      task2.isCollapsed
                    );
                    expect(createdTask.date).to.be.equal(task2.date);
                    expect(createdTask.description).to.be.equal(
                      task2.description
                    );
                    expect(createdTask.urgency).to.be.equal(task2.urgency);
                    expect(createdTask.status).to.be.equal(task2.status);
                    expect(createdTask.projectId).to.be.equal(task2.projectId);
                    expect(createdTask.task).to.be.equal(task2.task);
                    expect(createdTask.userId).to.be.equal(task2.userId);

                    // 5) Verify one existing task in test DB
                    chai
                      .request(server)
                      .get("/api/tasks/bbbbbb/false")
                      .set({ authtoken: token })
                      .end((err, res) => {
                        // Assert
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(1);

                        // 6) Attempt to update the task with no task name
                        let updateTask2 = {
                          isCollapsed: true,
                          description: "",
                          urgency: "medium",
                          status: "Doing",
                          task: "",
                        };

                        chai
                          .request(server)
                          .put("/api/tasks/" + createdTask._id)
                          .set({ authtoken: token })
                          .send(updateTask2)
                          .end((err, res) => {
                            // Assert
                            expect(res.status).to.be.equal(400);
                            const actualVal = res.body.message;
                            expect(actualVal).to.be.equal(
                              "Failed to validate request"
                            );

                            // 7) Verify only one task is in the test DB
                            chai
                              .request(server)
                              .get("/api/tasks/bbbbbb/false")
                              .set({ authtoken: token })
                              .end((err, res) => {
                                // Assert
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
});
