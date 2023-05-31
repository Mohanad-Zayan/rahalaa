const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { 
        type: String , 
        required: [true, "A Plan must have a name " ]
    },
  image: { 
        type: String , 
        required: [true, "A Plan must have an image " ]
    },
  hotels: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Hotel"
    }],
  restaurants: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Restaurant"
    }],
  attractions: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Attraction"
    }],
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
