const {
  create,
  updateDetails,
  singleRestaurantDetails,
  deleteRestaurant,
  getAllRestaurants,
  getAllRestaurantsInRange,
} = require("../Controllers/restaurant");
const isAuthorized = require("../Middlewares/auth");

const router = require("express").Router();

router.post("/create", isAuthorized, create);
router.put("/update/:restaurantId", isAuthorized, updateDetails);
router.get(
  "/singlerestaurant/:restaurantId",
  isAuthorized,
  singleRestaurantDetails
);
router.delete("/delete/:restaurantId", isAuthorized, deleteRestaurant);
router.get("/getall", isAuthorized, getAllRestaurants);
router.get("/getallinrange", isAuthorized, getAllRestaurantsInRange);


module.exports = router;
