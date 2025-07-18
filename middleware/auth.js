const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/user");
const { startSucceeded } = require('init');


// auth 
exports.auth = async(req,res,next) =>{
    try{
        // extract token
        const token = req.cookies.token
                         ||req.body.token 
                         || req.header("Authorisation").replace("Bearer ","");
        // token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }
        // verify the token 
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            return res.status(4001).json({
                success:false,
                message:'token is invalid',
            });

        }
        next();
    }
    catch(error){
        return res.status(4001).json({
            success:false,
            message:'Something went wrong while  validating the token',
        });
    }
}

// isStudent
exports.isStudent = async(req,res,next) =>{
    
}

// isInstructor

// isAdmin

