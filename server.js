// IMPORT AND READ ENV FILE. 
import dotenv from "dotenv";
dotenv.config();

// IMPORT THE EXPRESS LIBRARY.
import express from 'express';

// CREATE A EXPRESS APP
const app = express();

// PARSE PAYLOAD AS JSON FOR EXPRESS APP
app.use(express.json());

// import mysql the routings
import {MysqlProductRoutings} from "./routes/mysql_product.js";
// REGISTER MYSQL PRODUCT ROUTINGS
new MysqlProductRoutings(app);

// IMPORT MONGO CONNECTION 
import {connectToMongo} from './database/mongodb.js';
// CONNECT TO MONGO DB
connectToMongo();

// IMPORT MONGO BLOG ROUTINGS
import {MongoBlogRoutings} from "./routes/mongo_blog.js";
// REGISTER MONGO BLOG ROUTINGS
new MongoBlogRoutings(app);

// IMPORT MONGO ORDER ROUTINGS
import {MongoOrderRoutings} from "./routes/mongo_order.js";
// REGISTER MONGO ORDER ROUTINGS
new MongoOrderRoutings(app);

// START THE EXPRESS SERVER AND LISTEN ON SPECIFIED PORT
app.listen(process.env.PORT,() =>
{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

