const mongoose = require("mongoose");
const ratingAndReviewsSchema = new mongoose.Schema({
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    }],
    rating:{
        type:Number,
        require:true,
    },
    review:{
        type:String,
        required:true,
    },
});
module.exports = mongoose.model("RatingAndReviews",ratingAndReviewsSchema);