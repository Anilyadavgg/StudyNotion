const mongoose = require("mongoose");
const courseProgress = new mongoose.model({
    courseId:[ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    completedVideo:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ],

});
module.exports = mongoose.model("CourseProgress",courseProgress);
