const mongoose = require("mongoose"); 
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        userNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB CONNECTION SUCCESSFULL"))
    .catch((error)=>{
        console.log("DB CONNECTION FAILED");
        console.error(error);
        process.exit(1);
    })
};