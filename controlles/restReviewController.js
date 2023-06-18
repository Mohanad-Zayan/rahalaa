const RestReview = require('./../models/restReviews.model');
const Restaurant = require('./../models/Restaurant.model');
const catcAsync = require('../util/catcAsync');


exports.createRestReview = catcAsync(async (req, res) => {
  const { comment, rating, userId } = req.body;
  const restaurantId = req.body.restaurant;

  // Create the review using the Review model
  const review = await RestReview.create({
    comment,
    rating,
    restaurant: restaurantId,
    userId,
  });
  if (!review) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create the review',
    });
  }
  // Add the newly created review to the restaurant's reviews array
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $push: { reviews: review._id } },
    { new: true }
  );

  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: 'restaurant not found'
    });
  }

  res.status(201).json({ status: 'success', data: { review, restaurant } });
});