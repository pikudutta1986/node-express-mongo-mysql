/*
		   FILENAME: server/controllers/account.js
	         AUTHOR: Anindya Dutta
 	        SUMMARY: HANDLES THE ACCOUNT RELATED ACTIVITIES. FOR EXAMPLE, LOGGING IN USER, CREATING NEW ACCOUNT,
 	                 CHANGING PASSWORD OR RESETTING PASSWORD ETC.
            PURPOSE: TO PERFORM ACCOUNT OPERATIONS.
    IMPORTING FILES: operator.js | user.js | store.js
  SUBSCRIBING FILES: index.js
   LAST COMMIT DATE: June 2, 2021
*/

// THE OPERATOR CLASS IS USED TO GET INSTANCES OF DIFFERENT DATABASES. IT ALSO INCLUDES SOME COMMON AND GENERAL PURPOSE
// FUNCTIONS THAT CAN BE REQUIRED BY DIFFERENT CLASSES. LIKE GETTING SITE VARIABLES OR MESSAGE DATA.
const operatorClass = require ('../classes/operator');

// USER CLASS CONTAINS USER RELATED ACTIVITIES LIKE GETTING USER PROFILE INFORMATION FROM USER TABLE,
// GETTING THE USER ROLE, AUTHENTICATING USER, ENCRYPTING PASSWORDS ETC.
const userClass = require ('../classes/user');

// THIS FILE CONTAINS COMMON VARIABLES THAT WE CAN SHARE BETWEEN CLASSES. FOR EXAMPLE SITEVARIABLE, SITEMESSAGES ETC.
const store = require ('../store');

// STARTING Account CLASS.
class Account
{
	// PRIVATE VARIABLE TO HOLD THE INSTANCE OF OPERATOR CLASS.
	// WE WILL USE THIS CLASS TO GET INSTANCES OF DIFFERENT DATABASES TO COMMUNICATE WITH THEM.
	#operator;
	
	// PUBLIC VARIABLE TO HOLD INSTANCE OF USER CLASS. WE WILL USE IT TO GET USER-RELATED PROPERTIES.
	// FOR EXAMPLE, GETTING USER PROFILE INFORMATION.
	#user;
	
	// CLASS CONSTRUCTOR; THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
	constructor()
	{
		this.#operator = new operatorClass(); // CREATING A NEW INSTANCE OF OPERATOR CLASS SO WE CAN USE ITS OBJECTS.
		this.#user = new userClass();  // CREATING A NEW INSTANCE OF USER CLASS SO WE CAN USE ITS OBJECTS.
	}
	
	// THIS FUNCTION WILL HANDLE GET/POST REQUESTS MADE BY USER FROM THE ANGULAR APPLICATION RUNNING ON CLIENT SIDE.
	handleRequests (app)
	{
		// THIS WILL CHECK IF THE PROVIDED LOGIN DETAILS ARE CORRECT, IF IT IS THEN LOG IN THE USER.
		app.post ('/api/user/login', (req, res) =>
		{
			console.log (req.body);
			let email = req.body.username;
			let password = req.body.password;

			//let password = this.#user.encryptPassword (req.body.password);
			this.#operator.getDbInstance().getRow ("SELECT * FROM user WHERE email = '" + email + "'").then (row =>
			{
				// IF WE DID NOT FIND THE USER BY USERNAME.
				if (!row)
				{
					console.log("User not found with this username.");
					res.send ({success: false, error: "User not found."});
				}
				else
				{
					this.#operator.getDbInstance().getRow ("SELECT * FROM user WHERE email = '" + email + "' AND password = '"+ password +"' ").then (userrow =>
					{
						// IF WE DID NOT FIND THE USER BY USERNAME.
						if (!userrow)
						{
							console.log("Incorrect password.");
							res.send ({success: false, error: "Incorrect password."});
						}
						else
						{
							// FOUND THE USER BY USERNAME AND PASSWORD.
							// NOW GET USER-RELATED DATA.
							this.#user.getUserAccountData (userrow.user_id).then (result =>
							{
								//console.log(result);
								res.send ({success: true, userinfo: result});
								
							}).catch ((error) =>
							{
								// WE COULD NOT RUN QUERY ON DATABASE BECAUSE OF SOME ERROR. RETURNING FALSE TO CLIENT.
								res.send ({success: false});
							})
						}
					});
				}
			});
		});
		
		// THIS WILL LOGOUT USER FROM SERVER. THIS WILL BE EXECUTED WHEN USER TYPES LOGOUT JUMPCODE.
		app.post ('/api/user/logout', (req, res) =>
		{
			let user_id = req.body.user_id; // GETTING USER ID OF CURRENT USER FROM REQUEST PARAMETER.
			
			// LOGIC TO LOG OUT THE USER SHOULD GO HERE.
		});

	}
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = Account;
