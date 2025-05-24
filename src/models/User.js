const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    phone:{
        type:String,
        unique:true,
        validator(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("Invalid phone number");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak password");
            }
        }
    },
    isBanned:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },



});


const User = mongoose.model("User", userSchema);
module.exports = User;