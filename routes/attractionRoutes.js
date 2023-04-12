const express = require('express');
const attractionController = require('../controlles/attractionController');


const router = express.Router();


router
  .route('/')
  .get(attractionController.getAllAttractions)
  .post(attractionController.createAttraction);
router
  .route('/:id')
  .get(attractionController.getAttraction)
  .patch(attractionController.updateAttraction)
  .delete(attractionController.deleteAttraction);

router
  .route('/attractions-within/distance/:distance/center/:latlng/unit/:unit')
  .get(attractionController.attractionsWithin)


module.exports = router;

