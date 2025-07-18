const User = require("../models/user");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const { response } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    try{
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
            accountDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // return res
        return res.status(200).json({
            success:true,
            message:'User is registered successfully',
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).jsom({
            success:false,
            message:'User cannot be regisred. Please try again',
        })
    }


}

// login
exports.login = async (req, res)=>{
    try{
        // get data from req body
        const {email,password} = req.body;
         // validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required , please try again',
            });
        }

        // user check exist or not
        const user = await User.findOne({email}).populate("aditionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered , please try again',
            });
        }

        // generate JWT token, after password match
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                role:user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;
        

            // create cookie and send response
            const options = {
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:false,
                token,
                user,
                message:'Logged in successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is  Incorrect',
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        }) ;
    }
};



// changePassword
// TODO :HomeWork
exports.changePassword = async(req,res)=>{
    try{
        // get data from req body

        // get old password , new password , confirm new password
        
        // validation

        // update pwd in db

        // send mail - password updated

        // return response

    }
    catch(error){

    }
}