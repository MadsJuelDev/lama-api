process.env.NODE_ENV = "test";

const chai = require("chai");
const user = require("../models/User");
const projects = require("../models/Projects");
const tasks = require("../models/Tasks");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
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

describe("Full workflow test", () => {
  it("Full test for a user workflow", (done) => {
    // 1) Register a new LaMa user
    let user = {
      username: "eeeeee",
      email: "abc@1234.dk",
      password: "eeeeee",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Assert
        res.should.have.status(200);
        res.body.should.be.a("object");
        expect(res.body.error).to.be.equal(null);

        let newlyCreatedUser = {
          username: "eeeeee",
          password: "eeeeee",
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

            // 3) Verify No projects in test DB
            chai
              .request(server)
              .get("/api/projects/userId/eeeeee")
              .end((err, res) => {
                // Assert
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(0);

                // 4) Create new Project
                let project = {
                  name: "Todo LaMa App",
                  projectId: "IAmAUniqueId",
                  userId: "eeeeee",
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
                    // Assert
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
                      .get("/api/projects/userId/eeeeee")
                      .set({ authtoken: token })
                      .end((err, res) => {
                        // Assert
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(1);

                        // 6) Verify No tasks in test DB
                        chai
                          .request(server)
                          .get("/api/tasks/eeeeee/false")
                          .set({ authtoken: token })
                          .end((err, res) => {
                            // Assert
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.be.eql(0);

                            // 7) Create a task
                            let task = {
                              archived: false,
                              isCollapsed: true,
                              date: `${dateSeven}`,
                              description: "",
                              urgency: "",
                              status: "To Do",
                              projectId: "IAmAUniqueId",
                              task: "test",
                              userId: "eeeeee",
                            };

                            chai
                              .request(server)
                              .post("/api/tasks/")
                              .set({ authtoken: token })
                              .send(task)
                              .end((err, res) => {
                                // Assert
                                expect(res.status).to.be.equal(201);
                                expect(res.body).to.be.a("array");
                                expect(res.body.length).to.be.eql(1);

                                let createdTask = res.body[0];
                                expect(createdTask.archived).to.be.equal(
                                  task.archived
                                );
                                expect(createdTask.isCollapsed).to.be.equal(
                                  task.isCollapsed
                                );
                                expect(createdTask.date).to.be.equal(task.date);
                                expect(createdTask.description).to.be.equal(
                                  task.description
                                );
                                expect(createdTask.urgency).to.be.equal(
                                  task.urgency
                                );
                                expect(createdTask.status).to.be.equal(
                                  task.status
                                );
                                expect(createdTask.projectId).to.be.equal(
                                  task.projectId
                                );
                                expect(createdTask.task).to.be.equal(task.task);
                                expect(createdTask.userId).to.be.equal(
                                  task.userId
                                );
                                // 8) Verify one task added to the test DB
                                chai
                                  .request(server)
                                  .get("/api/tasks/eeeeee/false")
                                  .set({ authtoken: token })
                                  .end((err, res) => {
                                    // Assert
                                    expect(res.status).to.be.equal(200);
                                    expect(res.body).to.be.a("array");
                                    expect(res.body.length).to.be.eql(1);

                                    // 9) update the task status
                                    let updateTask2 = {
                                      status: "Doing",
                                    };

                                    chai
                                      .request(server)
                                      .put("/api/tasks/move/" + createdTask._id)
                                      .set({ authtoken: token })
                                      .send(updateTask2)
                                      .end((err, res) => {
                                        // Assert
                                        expect(res.status).to.be.equal(200);
                                        const actualVal = res.body.message;
                                        expect(actualVal).to.be.equal(
                                          "Tasks was succesfully updated!"
                                        );

                                        // 10) Verify only one task in the test DB
                                        chai
                                          .request(server)
                                          .get("/api/tasks/eeeeee/false")
                                          .set({ authtoken: token })
                                          .end((err, res) => {
                                            // Assert
                                            expect(res.status).to.be.equal(200);
                                            expect(res.body).to.be.a("array");
                                            expect(res.body.length).to.be.eql(
                                              1
                                            );

                                            // 11) Create another task under next_7 with 4 days remaining
                                            let task2 = {
                                              archived: false,
                                              isCollapsed: true,
                                              date: `${dateFour}`,
                                              description: "",
                                              urgency: "",
                                              status: "To Do",
                                              projectId: "NEXT_7",
                                              task: "test3",
                                              userId: "eeeeee",
                                            };

                                            chai
                                              .request(server)
                                              .post("/api/tasks/")
                                              .set({ authtoken: token })
                                              .send(task2)
                                              .end((err, res) => {
                                                // Assert
                                                expect(res.status).to.be.equal(
                                                  201
                                                );
                                                expect(res.body).to.be.a(
                                                  "array"
                                                );
                                                expect(
                                                  res.body.length
                                                ).to.be.eql(1);

                                                let createdTask = res.body[0];
                                                expect(
                                                  createdTask.archived
                                                ).to.be.equal(task2.archived);
                                                expect(
                                                  createdTask.isCollapsed
                                                ).to.be.equal(
                                                  task2.isCollapsed
                                                );
                                                expect(
                                                  createdTask.date
                                                ).to.be.equal(task2.date);
                                                expect(
                                                  createdTask.description
                                                ).to.be.equal(
                                                  task2.description
                                                );
                                                expect(
                                                  createdTask.urgency
                                                ).to.be.equal(task2.urgency);
                                                expect(
                                                  createdTask.status
                                                ).to.be.equal(task2.status);
                                                expect(
                                                  createdTask.projectId
                                                ).to.be.equal(task2.projectId);
                                                expect(
                                                  createdTask.task
                                                ).to.be.equal(task2.task);
                                                expect(
                                                  createdTask.userId
                                                ).to.be.equal(task2.userId);

                                                // 12) Verify one tasks in test DB for next week

                                                chai
                                                  .request(server)
                                                  .get(
                                                    "/api/nextweek/nextSeven/eeeeee/false"
                                                  )
                                                  .set({ authtoken: token })
                                                  .end((err, res) => {
                                                    // Assert
                                                    expect(
                                                      res.status
                                                    ).to.be.equal(200);
                                                    expect(res.body).to.be.a(
                                                      "array"
                                                    );
                                                    expect(
                                                      res.body.length
                                                    ).to.be.eql(1);

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
              });
          });
      });
  });
});
