const restaurantDB = require("../Models/restaurant");
const response = require("../Middlewares/response");

const create = async (req, res) => {
  const { name, description, location, averageRating, numOfRatings } = req.body;
  try {
    if (!name || !location || !description || !averageRating || !numOfRatings) {
      return response.validationError(
        res,
        "Cannot create a new restaurant without all parameters"
      );
    }
    const restaurantData = await new restaurantDB({
      name: name,
      description: description,
      location: location,
      averageRating: averageRating,
      numOfRatings: numOfRatings,
    }).save();
    if (!restaurantData) {
      return response.internalServerError(res, "Error creating restaurant");
    }
    response.successResponse(res,restaurantData,"Successfully created restaurant")
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};
