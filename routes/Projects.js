const router = require("express").Router();
const Projects = require("../models/Projects");
const NodeCache = require("node-cache");
const { validateToken } = require("../validation");

// stdTTL = standard time to live
const cache = new NodeCache({ stdTTL: 600 });

// ***** CRUD operations ***** //

// Create Projects - post
router.post("/", async (req, res) => {
  const projectExist = await Projects.findOne({ name: req.body.name });
  if (projectExist) {
    return res.status(400).json({ error: "Project Name already exists" });
  }

  data = req.body;
  Projects.insertMany(data)
    .then((data) => {
      cache.flushAll();
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read all Collab Projects colors - get
router.get("/collab/:collabId", async (req, res) => {
  await Projects.find({
    $or: [
      { collabIdOne: req.params.collabId },
      { collabIdTwo: req.params.collabId },
      { collabIdThree: req.params.collabId },
      { collabIdFour: req.params.collabId },
    ],
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read all Collab & user created Projects colors - get
router.get("/all/:collabId", async (req, res) => {
  await Projects.find({
    $or: [
      { userId: req.params.collabId },
      { collabIdOne: req.params.collabId },
      { collabIdTwo: req.params.collabId },
      { collabIdThree: req.params.collabId },
      { collabIdFour: req.params.collabId },
    ],
  })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read all user created Projects  - get
router.get("/userId/:userId", async (req, res) => {
  await Projects.find({ userId: req.params.userId })
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read specific Projects - get
router.get("/:id", (req, res) => {
  Projects.findById(req.params.projectId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update specific Projects - put
router.put("/:id", (req, res) => {
  const id = req.params.id;
  Projects.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot update Projects with id=" +
            id +
            ". Maybe Projects was not found?",
        });
      } else {
        cache.flushAll();
        res.send({ message: "Projects was succesfully updated!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Projects with id=" + id });
    });
});

// Delete specific Projects - delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Projects.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete Projects with id=" +
            id +
            ". Maybe Projects was not found?",
        });
      } else {
        cache.flushAll();
        res.send({ message: "Projects was succesfully deleted!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting Projects with id=" + id });
    });
});

function mapProdArray(obj) {
  let outputArr = obj.map((element) => ({
    id: element._id,
    name: element.name,
    projectId: element.projectId,
    userId: element.userId,
    collabIdOne: element.collabIdOne,
    collabIdTwo: element.collabIdTwo,
    collabIdThree: element.collabIdThree,
    collabIdFour: element.collabIdFour,
    uri: `/api/Projects/${element._id}`,
  }));
  return outputArr;
}

module.exports = router;
