const User = require("../models/user");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

// send otp
exports.sendOTP = async (req,res) =>{
    try{
        // fach email from request kiu body
        const {email} = req.body;

        // check if user is already registered
        const checkUserPresent = await User.findOne({email});

        // if user is already present then return a response

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User is already registered",
            })
        }
        // generate otp
        let otp = otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTO generated: ", otp);
        // check unique otp or not
        const result = await OTP.findOne({otp: otp});
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPaytload = ({email,otp});
        // create an entry an for OTP
        const otpBody = await OTP.create(otpPaytload);
        console.log(otpBody);

        // return response successfully
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }


};

// signup

// login

// changePassword