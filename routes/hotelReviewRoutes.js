const hotelReviewController = require('./../controlles/hotelReviewController')
const express = require('express')
const authController = require('./../controlles/authController')
const router = express.Router({ mergeParams: true });


router.route('/')
// .get(
//     authController.protect, // Protect the route, user must be logged in
//     authController.restrictTo('admin', 'business_owner'), // Restrict access to admin and business_owner roles
//     hotelReviewController.getHotelReviews)
//.get(hotelReviewController.getAllReviews)
.post(hotelReviewController.createhotelReview);

module.exports = router; 
//module.exports = router;