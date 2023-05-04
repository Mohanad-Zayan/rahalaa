const express = require('express');
const cityController = require('./../controlles/cityController');


const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(cityController.getAllCityHotels) 
  .post(cityController.createCityHotel);
  
router
  .route('/:id')
  .get(cityController.getCityHotel)
  .patch(cityController.updateCityHotel)
  .delete(cityController.deleteCityHotel);

// router
//   .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
//   .get(cityController.hotelsWithin)

module.exports = router;

