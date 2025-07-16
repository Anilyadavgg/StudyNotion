const mongoose = require("mongoose");
const tagsSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    
});
module.exports = mongoose.model("Tag",tagsSchema);