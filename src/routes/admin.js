const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv");

router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "falied to fetch all the users",
    });
  }
});

router.get("/user/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const subscriptions = await Subscription.find({ userId: req.params.id });
    res.json({ user, subscriptions });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "falied to user details + purchases",
    });
  }
});

router.put("/user/:id/ban", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBanned = !user.isBanned;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "falied to ban user",
    });
  }
});

router.get("/subscriptions", adminAuth, async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.json(subs);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "falied to fetch subscriptions",
    });
  }
});

router.get("/transactions", adminAuth, async (req, res) => {
  try {
    const txns = await Transaction.find();
    res.json(txns);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "falied to fetch Transactions",
    });
  }
});

router.get("/export/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const parser = new Parser();
    const csv = parser.parse(users);
    res.attachment("users.csv").send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting users" });
  }
});

router.get("/export/transactions", adminAuth, async (req, res) => {
  try {
    const transactions = await Subscription.find().select(
      "paymentId amount createdAt"
    );
    const parser = new Parser();
    const csv = parser.parse(transactions);
    res.attachment("transactions.csv").send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting transactions" });
  }
});

// router.get('/export/users', adminAuth, async (req, res) => {
//     try{
//          const users = await User.find();
//         // Placeholder: export logic here
//         res.json({ exported: users.length });

//     }catch(err){
//          res.status(500).json({
//             success:false,
//             message:"falied to export users to csv"
//         })
//     }

// });

// router.get('/export/transactions', adminAuth, async (req, res) => {
//     try{

//          const txns = await Transaction.find();
//         // Placeholder: export logic here
//         res.json({ exported: txns.length });

//     }catch(err){
//              res.status(500).json({
//              success:false,
//              message:"falied to export payments to csv"
//         })
//     }

// });

module.exports = router;
