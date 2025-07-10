const mongoose = require("mongoose");
const sectionSchema = new mongoose.model({
    sectionName:{
        type:String,
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"SubSection",
        }
    ],
});
module.export = mongoose.model("Section",sectionSchema);