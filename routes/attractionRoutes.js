const express = require("express");
const attractionController = require("../controlles/attractionController");

const router = express.Router({ mergeParams: true });

router.route("/Reviews").post(attractionController.createAttractionReview);
router.route("/Reviews/:id").get(attractionController.getAttractionReviews);

router
  .route("/")
  .get(attractionController.getAllAttractions)
  .post(attractionController.createAttraction);
router
  .route("/:id")
  .get(attractionController.getAttraction)
  .patch(attractionController.updateAttraction)
  .delete(attractionController.deleteAttraction);

router
  .route("/attractions-within/distance/:distance/center/:latlng/unit/:unit")
  .get(attractionController.attractionsWithin);

module.exports = router;
