const express  = require("express");

const hotelsRouter  = require("./hotelRoutes");

const restaurantsRouter  = require("./restaurantRoutes");

const attractionsRouter  = require("./attractionRoutes");

// const actvtiesRouter  = require("./actvtiesRouter");

const router = express.Router();





router.use('/:city/hotels', hotelsRouter)
router.use('/:city/restaurants', restaurantsRouter)
router.use('/:city/attractions', attractionsRouter)

// router.use('/actvties', actvtiesRouter)

// router
//   .route('/')
//   .get(cityController.getAllCities)
//   .post(cityController.createCity);

// router
//   .route('/:id')
//   .get(cityController.getCity)
//   .patch(cityController.updateCity)
//   .delete(cityController.deleteCity)
    

module.exports = router;
