const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Hotel must have a name"],
      trim: true,
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    num_reviews: {
      type: Number,
      default: 0,
    },
    
    description : {
      type: String
    } ,
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
      
    activityDesctiptor :[{
      type  : String 
    }]   
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


attractionSchema.index({startLocation : '2dsphere'  });


const Attraction = mongoose.model("Attraction", attractionSchema);
module.exports = Attraction;
