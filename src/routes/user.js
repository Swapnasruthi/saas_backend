const express = require('express');
const router = express.Router();
const {UserAuth} = require("../middlewares/auth");
const User = require("../models/User");
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');


//get user profile
router.get('/profile', UserAuth, async (req, res) => {

    try{
         const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    }catch(err){
        res.status(501).json({
            success:"false",
            message:"failed to fetch the user profile"
        })
    }
 
});


//fetching subscriptions.
router.get('subscriptions', UserAuth, async (req, res) => {
    try{
        const subscriptions = await Subscription.find({ userId: req.user.id });
        res.json(subscriptions);

    }catch(err){
         res.status(501).json({
            success:"false",
            message:"failed to fetch the subscriptions"
        })
    }
  
});


router.get('/invoices', UserAuth, async (req, res) => {

    try{
         const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);

    }catch(err){
        res.status(501).json({
            success:"false",
            message:"failed to fetch the invoices"
        })
    }
 
});





module.exports = router;