const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const {UserAuth} = require("../middlewares/auth");
// const Admin = require('../models/Admin');
const {adminAuth} = require('../middlewares/adminAuth');
const Product = require('../models/Product');
const Plan = require("../models/Plan");
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());



router.post('/products', adminAuth, async (req, res) => {
    try{
          const { name, price, category } = req.body;

            if (!name || !price || !category) {
                return res.status(400).json({
                    success: false,
                    message: "Product name, price, and category are required",
                });
            }
          const product = new Product(req.body);
            if (!["Basic", "Advanced", "Premium"].includes(req.body.category)) {
                return res.status(400).json({ message: "Invalid product category" });
            }
            await product.save();
            res.status(201).json({
                success:true,
                data:product,
                message:"successful"
            });


    }catch(err){
        res.status(500).json({
            success:false,
            message:" unsuccessfull operation!"
        })
    }

});

router.get('/products', async (req, res) => {

    try{
        const products = await Product.find();
        res.status(200).json({
            success:true,
            data:products,
            message:"successfully fetched!"
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"falied at fetching the products"
        })
    }
  
});

//get product by id
router.get('/products/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
         res.status(200).json({
            success:true,
            data:product,
            message:"successfully fetched!"
        })   

    }catch(err){
        res.status(500).json({
            success:false,
            message:"falied at fetching the products"
        })
    }
  
});


//updating product by id
router.put('/products/:id', adminAuth, async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        Object.keys(req.body).forEach((key) => (product[key] = req.body[key]));
        await product.save();
         res.status(200).json({
            success:true,
            data:product,
            message:"successfully updated!"
        }) 

    }catch(err){
        res.status(500).json({
            success:false,
            message:"falied at updating the products"
        })
    }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {

    try{
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(201).json({
            success:true,
            message:"Deleted!"
        }) 


    }catch(err){
         res.status(500).json({
            success:false,
            message:"falied at deleting the products"
        })
  
    }
});

// Add plan to product
router.post('/plans', adminAuth, async (req, res) => {
    try{
        const plan = new Plan(req.body);
        console.log(req.body);
        if (!["Basic", "Advanced", "Premium"].includes(req.body.name)) {
            return res.status(400).json({ message: "Invalid plan name" });
        }
         // 2. Check for duplicate plan name
        const existingPlan = await Plan.findOne(req.body.name);
        if (existingPlan) {
            return res.status(409).json({ success: false, message: "Plan with this name already exists" });
        }

        await plan.save();
        res.status(201).json(plan);

    }catch(err){
        console.log("error while adding the plans",err);
         res.status(500).json({
            success:false,
            message:"falied at adding the plan"+err.name
        })
    }
  
});

// Get plans for a product
router.get('/plans/:productId', async (req, res) => {

    try{
        const plans = await Plan.find({ productId: req.params.productId });
        res.json(plans);

    }catch(err){
        res.status(500).json({
            success:false,
            message:"falied at fetching the plan"
        })
    }
  
});


module.exports = router;




