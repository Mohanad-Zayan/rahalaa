const express  = require("express");
const cityHotelsRoutes= require('./cityHotelsRouter');
const cityRestrauntsRoutes= require('./cityRestrauntsRouter');
const cityAttractionsRoutes = require('./cityAttractionRouter');
const plansRoutes  = require('./plansRouter');
const cityActvtiesRoutes = require('./cityActvtiesRouter');
const cityController = require('../controlles/cityController');
// const actvtiesRouter  = require("./actvtiesRouter");

const router = express.Router({mergeParams : true});



router.use('/plans', plansRoutes)
router.use('/city/:city/hotels', cityHotelsRoutes)
router.use('/city/:city/restaurants',cityRestrauntsRoutes )
router.use('/city/:city/att ractions', cityAttractionsRoutes)
router.use('/activties', cityActvtiesRoutes)


router
  .route('/')
  .get(cityController.getAllCities)
  router
  .route('/city/:city')
  .get(cityController.getOneCity)

router
    .route('/search')
    .get(cityController.searchInResources)

router
    .route('/city/:city/search')
    .get(cityController.searchInResources)
  
//   .post(cityController.createCity);


// router
//   .route('/:id')
//   .get(cityController.getCity)
//   .patch(cityController.updateCity)
//   .delete(cityController.deleteCity)
    

module.exports = router;
