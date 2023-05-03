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
    // to be reviewd later //
    activities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Activity",
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
  } , "");

  this.populate({
    path: "hotels",
  });

  this.populate({
    path: "attractions",
  });
  this.populate({
    path: "activities",
  });
  next();
});





const City = mongoose.model('City', CitySchema);
module.exports = City ;


