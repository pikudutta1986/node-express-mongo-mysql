// IMPORT AND READ ENV FILE. 
import dotenv from "dotenv";
dotenv.config();

// IMPORT THE EXPRESS LIBRARY.
import express from 'express';

// CREATE A EXPRESS APP
const app = express();

// PARSE PAYLOAD AS JSON FOR EXPRESS APP
app.use(express.json());

// IMPORT MONGO CONNECTION 
import {connectToMongo} from './database/mongodb.js';
// CONNECT TO MONGO DB
connectToMongo();

// BASE ROUTE OF THE SERVER
app.get("/", async (req, res) => {
    res.send('Test Node Express Server is running...') 
});


// ================================================
// AUTH ROUTES
// ================================================
// IMPORT MYSQL AUTH ROUTES
import { AuthRoutes } from "./routes/AuthRoutes.js";
// REGISTER MYSQL AUTH ROUTES
new AuthRoutes(app);

// ================================================
// PRODUCT ROUTES
// ================================================
// IMPORT MYSQL PRODUCT ROUTES
import {MysqlProductRoutes} from "./routes/MysqlProductRoutes.js";
// REGISTER MYSQL PRODUCT ROUTES
new MysqlProductRoutes(app);

// ================================================
// BLOG ROUTES
// ================================================
// IMPORT MONGO BLOG ROUTES
import {MongoBlogRoutes} from "./routes/MongoBlogRoutes.js";
// REGISTER MONGO BLOG ROUTES
new MongoBlogRoutes(app);

// ================================================
// ORDER ROUTES
// ================================================
// IMPORT MONGO ORDER ROUTES
import {MongoOrderRoutes} from "./routes/MongoOrderRoutes.js";
// REGISTER MONGO ORDER ROUTES
new MongoOrderRoutes(app);

// ================================================
// PAYMENT ROUTES
// ================================================
// IMPORT PAYMENT ROUTES
import {PaymentRoutes} from "./routes/PaymentRoutes.js";
// REGISTER PAYMENT ROUTES
new PaymentRoutes(app);

// ================================================
// ADMIN ROUTES
// ================================================
// IMPORT ADMIN ROUTES
import {AdminRoutes} from "./routes/AdminRoutes.js";
// REGISTER ADMIN ROUTES
new AdminRoutes(app);

// START THE EXPRESS SERVER AND LISTEN ON SPECIFIED PORT
app.listen(process.env.PORT,() =>
{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

