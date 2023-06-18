const mongoose = require('mongoose')
const AttractionReviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        place: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attraction',
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
const AttractionReview = mongoose.model('AttractionReview', AttractionReviewSchema);
module.exports = AttractionReview;