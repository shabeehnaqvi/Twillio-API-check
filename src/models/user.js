//models

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
  },
  date:{
    type: Date,
    // required: true,
    // unique: true,
  },
  role:{
    type: String,
    // required: true,
    // unique: true,
  },
  password: String,
  image:{
    data:Buffer,
    contentType:String,
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
