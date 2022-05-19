const router = require("express").Router();
const Tasks = require("../models/Tasks");
const { validateToken } = require("../validation");

// ***** CRUD operations ***** //
// Create Tasks
router.post("/", validateToken, (req, res) => {
  data = req.body;
  Tasks.insertMany(data)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read all Tasks from specific project
router.get("/:userId/:archived/:projectId", validateToken, async (req, res) => {
  await Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
    projectId: req.params.projectId,
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read all Tasks - get
router.get("/:userId/:archived/", validateToken, async (req, res) => {
  await Tasks.find({
    userId: req.params.userId,
    archived: req.params.archived,
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update specific Tasks - put
router.put("/:id", validateToken, (req, res) => {
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
