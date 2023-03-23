const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A city Requires Names"],
    },
    restaurants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant",
      },
    ],
    hotels: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
      },
    ],
    attractions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Attraction",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// populate refernced data when reterived 
CitySchema.pre(/^find/, function(next) {
  this.populate({
    path: "restaurants",
  });

  this.populate({
    path: "hotels",
  });

  this.populate({
    path: "attractions",
  });
  next();
});





const City = mongoose.model('City', CitySchema);
module.exports = City ;
