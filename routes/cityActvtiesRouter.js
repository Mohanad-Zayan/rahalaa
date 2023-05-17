


const express = require('express');
const cityController = require('./../controlles/cityController');


const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(cityController.getAllActivities) ; 

router
  .route('/city/:city/attractions')
  .get(cityController.getAllCityActivities) ; 

router
  .route('/city/:city/:activity/attractions')
  .get(cityController.getAllCityActivitiesAttractions)
  


// router
//   .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
//   .get(cityController.hotelsWithin)

module.exports = router;

