const express = require('express');
const cityController = require('./../controlles/cityController');


const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(cityController.getAllCityAttractions) 
  .post(cityController.createCityAttraction);
  
router
  .route('/:id')
  .get(cityController.getCityAttraction)
  .patch(cityController.updateCityAttraction)
  .delete(cityController.deleteCityAttraction);

// router
//   .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
//   .get(cityController.hotelsWithin)

module.exports = router;

