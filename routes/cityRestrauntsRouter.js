const express = require('express');
const cityController = require('./../controlles/cityController');


const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(cityController.getAllCityRestaurants) 
  .post(cityController.createCityRestaurant);
  
router
  .route('/:id')
  .get(cityController.getCityRestaurant)
  .patch(cityController.updateCityRestaurant)
  .delete(cityController.deleteCityRestaurant);

// router
//   .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
//   .get(cityController.hotelsWithin)

module.exports = router;

