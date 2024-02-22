const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      maxLength: [30, "Name cannot exceed 30 charecter"],
      minLength: [2, "Name should have more than 2 charecter"],
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
      minLength: [6, "password should be greater than 6 charecter"],
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("restaurant-user", userSchema);
module.exports = userModel;
