const router = require("express").Router();
const Tasks = require("../models/Tasks");
const NodeCache = require("node-cache");
const moment = require("moment");

// stdTTL = standard time to live
const cache = new NodeCache({ stdTTL: 600 });

// ***** CRUD operations ***** //

// Create Tasks - post
router.post("/", (req, res) => {
  data = req.body;
  Tasks.insertMany(data)
    .then((data) => {
      cache.flushAll();
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read ALL Tasks types - get
// router.get("/", async (req, res) => {
//   try {
//     // try to get data from the cache
//     let TasksCache = cache.get("allTasks");

//     if (!TasksCache) {
//       let data = await Tasks.find();
//       const timeToLiveSec = 30;
//       cache.set("allTasks", data, timeToLiveSec);
//       res.send(mapProdArray(data));
//     } else {
//       res.send(mapProdArray(TasksCache));
//     }
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });
// const dateNow = moment().format("DD/MM/YYYY");
// dateNow.diff(dateWeek);
// console.log();

//Read all Tasks from specific project
router.get("/:userId/:archived/:projectId", async (req, res) => {
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

//Read all next weeks worth of tasks- get
// router.get("/:userId/:archived/:date", async (req, res) => {
//   await Tasks.find({
//     userId: req.params.userId,
//     archived: req.params.archived,
//     date: { $lte: moment(req.params.date, "DD-MM-YYYY").add(8, "days") },
//   })
//     .then((data) => {
//       console.log("Week 7", data);
//       res.send(mapProdArray(data));
//     })
//     .catch((err) => {
//       res.status(500).send({ message: err.message });
//     });
// });

// // Read all Tasks fomr user - get
// router.get("/userId/:userId", (req, res) => {
//   Tasks.find({ color: req.params.color })
//     .then((data) => {
//       res.send(mapProdArray(data));
//     })
//     .catch((err) => {
//       res.status(500).send({ message: err.message });
//     });
// });

//Read all Tasks - get
router.get("/:userId/:archived/", async (req, res) => {
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

// // Get Tasks based on user and not archived
// router.get("/", async (req, res) => {
//   try {
//     // try to get data from the cache
//     let TasksCache = cache.get("allTasks");

//     if (!TasksCache) {
//       let data = await Tasks.find();
//       const timeToLiveSec = 30;
//       cache.set("allTasks", data, timeToLiveSec);
//       res.send(mapProdArray(data));
//     } else {
//       res.send(mapProdArray(TasksCache));
//     }
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// // Read specific Tasks - get
// router.get("/:id", (req, res) => {
//   Tasks.findById(req.params.id)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({ message: err.message });
//     });
// });

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
    date: element.date,
    projectId: element.projectId,
    task: element.task,
    userId: element.userId,
    uri: `/api/Tasks/${element._id}`,
  }));
  return outputArr;
}

module.exports = router;
