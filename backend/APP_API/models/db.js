const mongoose = require('mongoose');

const mong = mongoose.connect(
    "mongodb+srv://chan:chan1234@cluster0-uqtcp.mongodb.net/Travel?retryWrites=true&w=majority",{
        useNewUrlParser: true, useUnifiedTopology: true
    }
  ).then(() => {
    console.log("Connection Established..!");
  })
  .catch(() => {
    console.log("Connection Not Established..!");
  });

  module.exports = mong;