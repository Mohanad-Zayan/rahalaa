const express  = require("express");

const hotelsRouter  = require("./hotelRoutes");

const restaurantsRouter  = require("./restaurantRoutes");

const attractionsRouter  = require("./attractionRoutes");

const actvtiesRouter  = require("./actvtiesRouter");

const router = express.Router();





router.use('/hotels', hotelsRouter)
router.use('/restraunts', restaurantsRouter)
router.use('/attractions', attractionsRouter)
router.use('/actvties', actvtiesRouter)


