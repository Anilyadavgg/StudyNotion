const User = require("../models/user");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const { response } = require("express");

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
exports.signup = async(req,res)=>{
    // fetch data from req.body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    } = req.body;
    // validate data
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:'All field are required',
        })
    }
    // match password
    if(password !== confirmPassword){
        return res.status(403).json({
            success:false,
            message:'Password and ConfirmPassword value does not match, please try again',
        })
    }
    // check user already present or not
    const exixtingUser = await User.findOne({email});
    if(exixtingUser){
        return res.status(403).json({
            success:false,
            message:'User is already registered',
        })
    }

    // find most recent otp stored for the user
    const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
    console.log(recentOtp);
    // validate otp
    if(recentOtp ,length == 0){
        return res.status(403).json({
            success:false,
            message:'OTP not Found',
        })
    }else if(otp !== recentOtp){
        // invalid otp
        return res.status(403).json({
            success:false,
            message:'Invalid OTP'
        })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password,10);
    // entry create in db

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        accountDetails:
    })

    // return res


}

// login

// changePassword