

const mongoose = require("mongoose");



const ActivitySchema = new mongoose.Schema(
  {
    type: { 
      type: String,
      required: [true, "A city Requires An Activity"],
    },
    
    city: {
      type: String,
      required: [true, "activity should belong to a city"],
    },

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

ActivitySchema.pre(/^find/, function(next) {

    this.populate({
      path: "attractions",
    });

    next();
  });
  

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity ;
