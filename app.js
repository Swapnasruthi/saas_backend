const express = require('express');
const connectDb = require("./src/config/database");
const http = require("http");

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(express.json());


//importing models
const User = require("./src/models/User");
const Subscription = require("./src/models/Subscription");
const Transaction = require("./src/models/Transaction");
const Plan = require('./src/models/Plan');
const Admin = require('./src/models/Admin');
const Product = require('./src/models/Product');


//importing routes

const authRouter = require('./src/routes/auth');
const adminRouter = require('./src/routes/admin');
const productRouter = require('./src/routes/product');
const userRouter = require('./src/routes/user');



//using routes

app.use('/api/auth', authRouter);
app.use("/api", productRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);












connectDb()
.then(
    () => {
        console.log("Database connected successfuly");
        server.listen(PORT, () =>{
            console.log(`server is running on port ${PORT}`);
        })
    }
)
.catch(
    (err) => {
        console.log("Database connection failed"+ err);
    }
)

