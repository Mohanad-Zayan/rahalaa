const mongoose =require('mongoose')
const restReviewSchema = new mongoose.Schema(
    {
        comment:{
            type:String,
        },
        rating:{
            type:Number,
            min:1,
            max:5
        },
        createdAt:{
            type: Date,
            default:Date.now
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true
          },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
);
const RestReview = mongoose.model('RestReview',restReviewSchema);
module.exports = RestReview;