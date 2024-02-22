const restaurantDB = require("../Models/restaurant");
const response = require("../Middlewares/response");

//create new restaurant
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
    response.successResponse(
      res,
      restaurantData,
      "Successfully created restaurant"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//get all restaurants in specified radius
const getAllRestaurants = async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  try {
    function calculateDistance(lat1, lon1, lat2, lon2) { 
      const R = 6371;// Radius of the earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000;// Distance in meters
      return distance;
    }
    const restaurants = await restaurantDB.find({});
    const nearbyRestaurants = restaurants.filter((restaurant) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      );
      return distance <= radius;
    });

    // Sort nearby restaurants by distance
    nearbyRestaurants.sort((a, b) => {
      const distanceA = calculateDistance(
        latitude,
        longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distanceB = calculateDistance(
        latitude,
        longitude,
        b.location.latitude,
        b.location.longitude
      );
      return distanceA - distanceB;
    });
    if (!nearbyRestaurants) {
      return response.notFoundError(res, "Cannot find the restaurant");
    }
    response.successResponse(
      res,
      nearbyRestaurants,
      "Successfully find all restaurant in given redius"
    );
  } catch (error) {
    return response.internalServerError(res, error.message);
  }
};

//get all restaurants in given range
const getAllRestaurantsInRange = async (req, res) => {
  const { latitude, longitude, minimumDistance, maximumDistance } = req.query;
  try {
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000;
      return distance;
    }
    const restaurants = await restaurantDB.find({});
    const nearbyRestaurants = restaurants.filter((restaurant) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      );
      return distance <= maximumDistance && distance >= minimumDistance;
    });

    // Sort nearby restaurants by distance
    nearbyRestaurants.sort((a, b) => {
      const distanceA = calculateDistance(
        latitude,
        longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distanceB = calculateDistance(
        latitude,
        longitude,
        b.location.latitude,
        b.location.longitude
      );
      return distanceA - distanceB;
    });
    if (!nearbyRestaurants) {
      return response.notFoundError(res, "Cannot find the restaurant");
    }
    response.successResponse(
      res,
      nearbyRestaurants,
      "Successfully find all restaurant in given range"
    );
  } catch (error) {
    return response.internalServerError(res, error.message);
  }
};

//update restaurant details
const updateDetails = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, location, averageRating, numOfRatings } = req.body;
  try {
    if (!restaurantId || restaurantId === ":restaurantId") {
      return response.validationError(
        res,
        "Cannot update details without restaurant ID"
      );
    }
    const findRestaurant = await restaurantDB.findById({ _id: restaurantId });
    if (!findRestaurant) {
      return response.notFoundError(res, "Cannot find the specific restaurant");
    }
    const newData = {
      ...(name && { name: name }),
      ...(description && { description: description }),
      ...(location && { location: location }),
      ...(averageRating && { averageRating: averageRating }),
      ...(numOfRatings && { numOfRatings: numOfRatings }),
    };
    const updatedDetails = await restaurantDB.findByIdAndUpdate(
      { _id: restaurantId },
      newData,
      { new: true }
    );
    if (!updatedDetails) {
      return response.internalServerError(
        res,
        "Error updating restaurant details"
      );
    }
    response.successResponse(
      res,
      updatedDetails,
      "Successfully updated restaurant details"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//get specific restaurant details
const singleRestaurantDetails = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    if (!restaurantId || restaurantId === ":restaurantId") {
      return response.validationError(
        res,
        "Cannot get details without restaurant ID"
      );
    }
    const findRestaurant = await restaurantDB.findById({ _id: restaurantId });
    if (!findRestaurant) {
      return response.notFoundError(res, "Cannot find the specific restaurant");
    }
    response.successResponse(
      res,
      findRestaurant,
      "Successfully find restaurant details"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//delete the specific restaurant
const deleteRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    if (!restaurantId || restaurantId === ":restaurantId") {
      return response.validationError(
        res,
        "Cannot delete restaurant without restaurant ID"
      );
    }
    const findRestaurant = await restaurantDB.findById({ _id: restaurantId });
    if (!findRestaurant) {
      return response.notFoundError(res, "Cannot find the specific restaurant");
    }
    const deletedRestaurant = await restaurantDB.findByIdAndDelete({
      _id: restaurantId,
    });
    if (!deletedRestaurant) {
      return response.internalServerError(res, "Error deleteing restaurant");
    }
    response.successResponse(
      res,
      deletedRestaurant,
      "Successfully deleted the specific restaurant"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = {
  create,
  updateDetails,
  singleRestaurantDetails,
  deleteRestaurant,
  getAllRestaurants,
  getAllRestaurantsInRange,
};
