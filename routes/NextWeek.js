const router = require("express").Router();
const Tasks = require("../models/Tasks");
const moment = require("moment");
const { validateToken } = require("../validation");

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

// ***** CRUD operations ***** //

//Read tasks for Today - get
router.get("/today/:userId/:archived/", validateToken, async (req, res) => {
  await Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
    date: { $eq: todayDate },
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read all next weeks worth of tasks - get
router.get("/nextSeven/:userId/:archived/", validateToken, async (req, res) => {
  await Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
    $or: [
      { date: { $eq: todayDate } },
      { date: { $eq: dateOne } },
      { date: { $eq: dateTwo } },
      { date: { $eq: dateThree } },
      { date: { $eq: dateFour } },
      { date: { $eq: dateFive } },
      { date: { $eq: dateSix } },
      { date: { $eq: dateSeven } },
    ],
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

function mapProdArray(obj) {
  let outputArr = obj.map((element) => ({
    id: element._id,
    archived: element.archived,
    isCollapsed: element.isCollapsed,
    date: element.date,
    description: element.description,
    urgency: element.urgency,
    status: element.status,
    projectId: element.projectId,
    task: element.task,
    userId: element.userId,
    uri: `/api/Tasks/${element._id}`,
  }));
  return outputArr;
}

module.exports = router;
