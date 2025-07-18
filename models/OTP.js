const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:String,
        default:Date,
        exists:5*60,
    },
})



// a function to send email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification email from StydyNotion",otp);
        console.log("Mail send Successfully",mailResponse);

    }
    catch(error){
        console.log("Error occured while sending email",error);
        throw error;
    }
}

OTPSchema.pre("save",async function (next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})
  
module.exports = mongoose.model("OTP",OTPSchema)
