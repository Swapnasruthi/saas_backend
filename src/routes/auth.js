const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {UserAuth} = require("../middlewares/auth");
const Admin = require('../models/Admin');
require("dotenv").config();

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(express.json());


router.post("/signup", async (req, res) => {
        try{

            const {fullName, email, password} = req.body;
            
            let user = await User.findOne({ email:email});
            if(user){
                return res.status(400).json({
                    susscess:false,
                    message:"user already exists",
                    
                })
            }

            const passwordHash = await bcrypt.hash(password, 10);
            
            const newUser = await User({
                fullName,
                email,
                password: passwordHash
            });
            
            await newUser.save();
            res.status(201).json({
                success:true,
                data:newUser,
                message:"user Created Successfuly"
            });

        }catch(err){
            res.status(500).json({
                message:err.message,
                success:false
            })
        }
});

router.post("/login", async (req, res) => {
        try{

            const {email, password} = req.body;
            const user = await User.findOne({email:email});
            if(!user){
                throw new Error("user not found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid){
                //creating a token
                const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});

                res.cookie("token", token);
                res.status(200).json({
                    success:true,
                    message:"Login Successful",
                    data:user,
                })
            }
            else{
                res.status(400).json({
                    success:false,
                    message:"Invalid credentials"
                })
            }

        }catch(err){
            res.status(500).json({
                success:false,
                message:err.message
            })
        }
})

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
        success:true,
        message:"Login Successful",
        data:admin,
        token
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/me', UserAuth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
  
});

module.exports = router;