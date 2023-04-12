const mongoose = require("mongoose");
const validator = require("validator");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Hotel must have a name"],
      trim: true,
    },
    image: {
      type: String,
    },
    priceLevel: {
      type: String,
      // match : /[$ -]/, 
      default: '$$'
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    hotelClass: {
      type: Number,
      default: 0.0,
      min: [0, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],

    },
    phone: {
      type: String,
      unique: true
    },
      address: {
      type: String,
      trim: true
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      
      coordiantes: [Number],
      address: String,
      // description: String,
    },
    // reviews: [{
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Attraction",
    //   }],

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hotelSchema.index({startLocation : '2dsphere'  });


const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
