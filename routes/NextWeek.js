const router = require("express").Router();
const Tasks = require("../models/Tasks");
const NodeCache = require("node-cache");
const moment = require("moment");
const { equal } = require("joi");

// stdTTL = standard time to live
const cache = new NodeCache({ stdTTL: 600 });

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

// ***** CRUD operations ***** //

//Read all next weeks worth of tasks- get
router.get("/today/:userId/:archived/", (req, res) => {
  Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
    date: { $eq: todayDate },
  })
    .then((data) => {
      console.log("Week 7", data);
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read all next weeks worth of tasks- get
router.get("/nextSeven/:userId/:archived/", (req, res) => {
  Tasks.find({
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
    ],
  })
    .then((data) => {
      console.log("Week 7", data);
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update specific Tasks - put
router.put("/:id", (req, res) => {
  const id = req.params.id;
  Tasks.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot update Tasks with id=" +
            id +
            ". Maybe Tasks was not found?",
        });
      } else {
        res.send({ message: "Tasks was succesfully updated!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating Tasks with id=" + id });
    });
});

// Delete specific Tasks - delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Tasks.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete Task with id=" + id + ". Maybe Task was not found?",
        });
      } else {
        res.send({ message: "Task was succesfully deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error deleting Task with id=" + id });
    });
});

function mapProdArray(obj) {
  let outputArr = obj.map((element) => ({
    id: element._id,
    archived: element.archived,
    projectId: element.projectId,
    task: element.task,
    userId: element.userId,
    uri: `/api/Tasks/${element._id}`,
  }));
  return outputArr;
}

module.exports = router;
