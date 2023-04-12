const express = require('express');
const restaurantController= require('../controlles/restaurantController');


const router = express.Router();


router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.createRestaurant);
router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(restaurantController.updateRestaurant)
  .delete(restaurantController.deleteRestaurant);


router
  .route('/restaurants-within/distance/:distance/center/:latlng/unit/:unit')
  .get(restaurantController.restaurantsWithin)

module.exports = router;

