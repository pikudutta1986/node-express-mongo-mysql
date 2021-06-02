// INCLUDING EXPRESS FRAMEWORK TO RUN NODE JS APPLICATION.
const express = require ("express");

// INCLUDING THIS MODULE TO USE .ENV FILE FOR STATIC VALUES.
require ('dotenv').config ();
const https = require ("https"), http = require ("http"); // INCLUDING HTTP MODULE FOR HTTP REQUESTS.
const fs = require ("fs"); // THIS MODULE WILL BE USED FOR READING FILES FROM SERVER DIRECTORIES.
const app = express ();
let server;

// CREATE THE HTTP SERVER TO HANDLE CLIENT REQUEST
server = http.createServer (app);

// NODE MODULE THAT WE WILL USE TO ENCRYPT THE USER PASSWORD BEFORE STORING IT INTO USER TABLE IN DATABASE.
const crypto = require ('crypto'); // TO ENCRYPT STRINGS. FOR EXAMPLE, PASSWORD.
const session = require ('express-session'); // TO STORE SESSION DATA. FOR EXAMPLE USER'S LOGIN INFORMATION.

// INCLUDING THIS NODE MODULE TO CONVERT USER'S TIME ZONE INTO SERVER'S TIME ZONE.
const moment = require ('moment-timezone');

// PARSE INCOMING REQUEST BODIES IN A MIDDLEWARE, AVAILABLE UNDER THE req.body PROPERTY.
const bodyParser = require ("body-parser");

// PARSE application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// PARSE application/json
app.use(bodyParser.json())

// IMPORT NECESSARY CLASS FILES
const store = require ('./store');

// APP STATIC DATA LOAD IN SERVER ENDS HERE.
// OPERATOR CLASS IS USED TO GET INSTANCES OF DIFFERENT DATABASES. IT ALSO INCLUDES SOME COMMON AND GENERAL PURPOSE
// FUNCTIONS THAT CAN BE REQUIRED BY DIFFERENT CLASSES, LIKE GETTING SITE VARIABLES OR MESSAGE DATA.
const operatorClass = require ('./classes/operator');
const operator = new operatorClass(); // CREATING A NEW INSTANCE OF OPERATOR CLASS SO WE CAN USE ITS OBJECTS.
operator.getSiteVariable (); // GETTING SITE VARIABLES FROM SITEVARIABLE TABLE.
operator.getSiteMessages (); // GETTING MESSAGES FROM MESSAGE TABLE.
// APP STATIC DATA LOAD IN SERVER ENDS HERE.

// ALLOWING ANY ORIGIN TO ACCESS THE API.
// CORS (CROSS-ORIGIN RESOURCE SHARING) SETTING.
app.use (function (req, res, next)
{
	// ALLOWING ACCESS TO API FROM ALL THE ORIGINS.
	res.header("Access-Control-Allow-Origin", "*");
	
	// ONLY ALLOWING API REQUESTS IF THEY CONTAIN THE HEADER THAT IS PRESENT IN THIS LIST.
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept, size, name, x-file-id, x-start-byte");
	
	// ALLOWING ALL METHODS FOR API. FOR EXAMPLE, POST, GET OR PUT.
	res.header("Access-Control-Allow-Methods", "*");
	next(); // PROCEEDING WITH THE REQUEST.
});


// ACCOUNT RELATED API REQUESTS HANDLE STARTS HERE
const accountClass = require ('./controllers/account'); // TO HANDLE ACCOUNT RELATED REQUESTS.
const accountController = new accountClass(); // CREATING A NEW INSTANCE TO HANDLE GET/POST REQUESTS.
accountController.handleRequests (app); // HANDLING GET/POST API FOR USER ACCOUNT RELATED ACTIVITIES.
// ACCOUNT RELATED API REQUESTS HANDLE ENDS HERE

// GENERAL API REQUESTS HANDLE STARTS HERE
genericClass = require ('./controllers/generic'); // TO HANDLE GENERAL REQUEST.
const genericController = new genericClass(); // CREATING A NEW INSTANCE TO HANDLE GET/POST REQUESTS.
genericController.handleRequests (app); // CALLING FUNCTION TO HANDLE API GET/POST REQUESTS.
// GENERAL API REQUESTS HANDLE ENDS HERE


// STARTING SERVER AND LISTENING FOR REQUESTS ON THE PORT.
server.listen(process.env.port , () => console.log('server is running on port '+process.env.port ));
