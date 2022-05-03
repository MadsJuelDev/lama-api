const router = require("express").Router();
const Tasks = require("../models/Tasks");
const NodeCache = require("node-cache");
const moment = require("moment");

// stdTTL = standard time to live
const cache = new NodeCache({ stdTTL: 600 });

// ***** CRUD operations ***** //

// Create Tasks - post

//Read all next weeks worth of tasks- get
router.get("/:userId/:archived/:date", (req, res) => {
  Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
    date: { $lte: req.params.date },
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
