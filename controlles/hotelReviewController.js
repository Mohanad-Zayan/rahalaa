const HotelReview = require("./../models/hotelReviews.model");
const Hotel = require("./../models/Hotel.model");
const catcAsync = require("../util/catcAsync");

exports.createhotelReview = catcAsync(async (req, res) => {
  const { comment, rating, userId } = req.body;
  const hotelId = req.body.hotel;

  console.log(hotelId);
  // Create the review using the Review model
  const review = await HotelReview.create({
    comment,
    rating,
    hotel: hotelId,
    userId,
  });

  if (!review) {
    return res.status(500).json({
      status: "error",
      message: "Failed to create the review",
    });
  }

  // Add the newly created review ID to the hotel's reviews array
  const hotel = await Hotel.findByIdAndUpdate(
    hotelId,
    { $push: { reviews: review._id } },
    { new: true }
  );

  if (!hotel) {
    return res.status(404).json({
      status: "error",
      message: "Hotel not found",
    });
  }

  res.status(201).json({ status: "success", data: { review, hotel } });
});
