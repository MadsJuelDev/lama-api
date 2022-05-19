const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Swagger
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//Welcome Route
app.get("/api/lama", (req, res) => {
  res.status(200).send({ message: "Welcome to LaMa Project API" });
});

//import product routes
const TaskRoutes = require("./routes/Tasks");
const NextWeekRoutes = require("./routes/NextWeek");
const ProjectRoutes = require("./routes/Projects");
const AuthRoutes = require("./routes/Auth");

require("dotenv-flow").config();
const PORT = process.env.PORT || 4001;

// Is Server running?
app.listen(PORT, function () {
  console.log("The Server is running on port: " + PORT);
});

//Parse request as JSON
app.use(express.json());

//routes (get,post,put,delete (CRUD))
//Auth
app.use("/api/User", AuthRoutes);
// Assets
app.use("/api/Tasks", TaskRoutes);
app.use("/api/nextweek", NextWeekRoutes);
app.use("/api/Projects", ProjectRoutes);

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
