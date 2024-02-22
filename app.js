const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const userAuthRoutes=require("./Routes/userAuth")
app.use("/api/userauth",userAuthRoutes);
// app.use("/api/restaurant");
module.exports = app;
