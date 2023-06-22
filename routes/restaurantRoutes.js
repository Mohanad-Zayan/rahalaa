const express = require('express');
const restaurantController= require('../controlles/restaurantController');
const authController = require('../controlles/authController');


const router = express.Router({ mergeParams: true });

router.get('/inactiveRest',
  restaurantController.getInactiveRestaurants);


router
  .route('/')
  .get( authController.protect, restaurantController.getAllRestaurants)
  .post(authController.protect ,  restaurantController.createRestaurant);

router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(restaurantController.updateRestaurant)
  .delete(restaurantController.deleteRestaurant);


router
  .route('/restaurants-within/distance/:distance/center/:latlng/unit/:unit')
  .get(restaurantController.restaurantsWithin)

module.exports = router;

