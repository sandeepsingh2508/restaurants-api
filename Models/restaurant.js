const mongoose = require("mongoose");
const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: [30, "Name cannot exceed 30 charecter"],
    minLength: [2, "Name should have more than 2 charecter"],
  },
  description: {
    type: String,
    maxLength: [100, "Name cannot exceed 30 charecter"],
    minLength: [2, "Name should have more than 2 charecter"],
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfRatings: {
    type: Number,
    default: 0,
  },
});
const restaurantModel = mongoose.model("restaurant", restaurantSchema);
module.exports = restaurantModel;
