const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const multer = require('multer');

const app = express();

// const db = require('./APP_API/models/db');
const apiroute = require('./APP_API/routes/index');
const usersroute = require('./APP_API/routes/users');

mongoose
  .connect(
    "mongodb+srv://chan:chan1234@cluster0-uqtcp.mongodb.net/Books?retryWrites=true&w=majority",{
        useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false 
    }
  )
  .then(() => {
    console.log("Connection Established..!");
  })
  .catch(() => {
    console.log("Connection Not Established..!");
  });

app.use(bodyParser.json());
app.use("/uploads",express.static(path.join("backend/uploads")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use('/api/Books', apiroute);
app.use("/api/user", usersroute);

module.exports = app;
