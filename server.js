const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Croos-origin resource sharing. Sets browser security to allow sharing via http.
const cors = require("cors");
app.use(cors());

//Swagger
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//Welcome Route
app.get("/api/lama", (req, res) => {
  res.status(200).send({ message: "Welcome to LaMa Project API" });
});

//import Lama Api routes
const TaskRoutes = require("./routes/Tasks");
const NextWeekRoutes = require("./routes/NextWeek");
const ProjectRoutes = require("./routes/Projects");
const AuthRoutes = require("./routes/Auth");
const AssetsRoutes = require("./routes/Assets");

// Sets up port from .env files or defaults to local
require("dotenv-flow").config();
const PORT = process.env.PORT || 4001;

// Is the Server running?
app.listen(PORT, function () {
  console.log("The Server is running on port: " + PORT);
});

//Parse request as JSON
app.use(express.json());

//routes (get,post,put,delete (CRUD))
app.use("/api/User", AuthRoutes);
app.use("/api/Tasks", TaskRoutes);
app.use("/api/nextweek", NextWeekRoutes);
app.use("/api/Projects", ProjectRoutes);
app.use("/api/Assets", AssetsRoutes);

// connection to mongodb atlas.
mongoose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error connecting to MongoDB:" + error));

mongoose.connection.once("open", () =>
  console.log("Connected succesfully to MongoDB")
);

module.exports = app;
