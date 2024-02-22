const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const userAuthRoutes = require("./Routes/userAuth");
const restaurantRoutes = require("./Routes/restaurant");
app.use("/api/userauth", userAuthRoutes);
app.use("/api/restaurant", restaurantRoutes);
module.exports = app;
