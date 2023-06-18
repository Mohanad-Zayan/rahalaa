const mongoose = require('mongoose');

const hotelReviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
const HotelReview = mongoose.model('HotelReview', hotelReviewSchema);

module.exports = HotelReview;