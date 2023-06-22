const express = require("express");
const hotelController = require("./../controlles/hotelController");
const authController = require("./../controlles/authController");

const router = express.Router({ mergeParams: true });



router.get(
  "/InActiveHotels",
  // authController.protect,
  hotelController.getInactiveHotels
);

router
  .route("/")
  .get( authController.protect , hotelController.getAllHotels)
  .post( authController.protect , hotelController.createHotel);

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);

router.patch(
  "/acceptRequest/:id",
  // authController.protect,
  hotelController.acceptHotelReq
);


router
  .route("/hotels-within/distance/:distance/center/:latlng/unit/:unit")
  .get(hotelController.hotelsWithin);

module.exports = router;
