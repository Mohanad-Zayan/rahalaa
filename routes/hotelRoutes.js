const express = require('express');
const hotelController = require('./../controlles/hotelController');


const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(hotelController.getAllHotels) 
  .post(hotelController.createHotel);
  
router
  .route('/:id')
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);

router
  .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
  .get(hotelController.hotelsWithin)
  
module.exports = router;

