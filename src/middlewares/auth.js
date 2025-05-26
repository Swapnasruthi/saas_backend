
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const UserAuth = async (req, res, next) => {
         try{
                const {token} = req.cookies;
                //check if token is present
                if(!token){
                    return res.status(401).send("unAuthorized");
                }

                //decoding the token to get the user id

                const decodedId = await jwt.verify(token, process.env.JWT_SECRET);
                console.log(decodedId);
                
                const {_id} = decodedId;
                const user = await User.findById(decodedId._id);


                //verifying the user

                if(!user){
                    throw new Error("User not found");
                }
                
                //sending the user directly to the next function
                req.User = user;

                //calling the next function to execute.
                next();
                
         } catch(err){
            console.log("There is an error in the auth middleware",err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: err.message
            });
         }      


}

module.exports = {UserAuth};