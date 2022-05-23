const router = require("express").Router();
const Assets = require("../models/Assets");

// ***** CRUD operations ***** //

// Read all assets - get
router.get("/", async (req, res) => {
  await Assets.find()
    .then((data) => {
      res.send(mapProdArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Read assets by type - get
router.get("/:type", async (req, res) => {
  await Assets.find({ type: req.params.type })
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
    name: element.name,
    number: element.number,
    type: element.type,
    color: element.color,
    style: element.style,
    assetUrl: element.assetUrl,
    uri: `/api/Assets/${element._id}`,
  }));
  return outputArr;
}

module.exports = router;
