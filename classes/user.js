/*
	         AUTHOR: Anindya Dutta
 	        SUMMARY: THIS FILE WILL HAVE SHARED INFO OR FUNCTIONS LIKE DATABASE CONNECTION. THIS FILE CAN BE SHARED BETWEEN
                     CLASSES TO CALL/USER COMMON FUNCTIONS.
            PURPOSE: TO PROVIDE ACCESS TO COMMON OR SHAREABLE FUNCTIONS BETWEEN CLASSES.
    IMPORTING FILES: db.js
  SUBSCRIBING FILES: account.js
   LAST COMMIT DATE: June 2, 2021
*/

// INCLUDING MAIN DATABASE CLASS INTO THIS CLASS SO WE CAN PERFORM INSERT/UPDATE/DELETE OPERATIONS ON MAIN DATABASE.
const dbClass = require("../database/db");

// NODE MODULE THAT WE WILL USE TO ENCRYPT THE USER PASSWORD BEFORE STORING IT INTO USER TABLE IN DATABASE.
const crypto = require ('crypto');

// STARTING THE User CLASS.
class User
{
	#Db; // PRIVATE VARIABLE TO HOLD INSTANCE OF MAIN DB CLASS.
	
	// CLASS CONSTRUCTOR; THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
	constructor ()
	{
		this.#Db = new dbClass(); // CREATING A NEW INSTANCE OF MAIN DB CLASS.
	}
	
	// GETTING ALL THE DATA OF USER FROM user TABLE ON THE BASIS OF USERNAME.
	get(username)
	{
		return this.#Db.getRow("SELECT * FROM user WHERE username = '"+username+"'");
	}
	
	// FUNCTION WILL CONVERT THE PASSWORD INTO HASH
	encryptPassword(value)
	{
		return crypto.createHash("md5").update(value).digest('hex');
	}
	
	// GETTING USER'S ACCOUNT RELATED DATA.
	getUserAccountData(user_id)
	{
		// RETURNING A PROMISE THAT WE WILL GET THE REQUIRED USER DATA FROM DATABASE AND SEND BACK.
		return new Promise((resolve, reject) =>
		{
			// QUERY TO SELECT USER ROW.
			let user_query = "SELECT * FROM user WHERE user_id="+user_id; 
			
			// RUNNING THE QUERY.
			this.#Db.getRow(user_query).then( user =>
			{
				// QUERY TO SELECT USER ROLE ID AND ROLE NAME.
				let role_query = "SELECT ur.role_id, r.role FROM user_role ur JOIN role r ON r.role_id = ur.role_id WHERE ur.user_id="+user_id; 

				// RUNNING THE QUERY.
				this.#Db.getRow(role_query).then( roleData =>
				{
					// QUERY TO SELECT THE USER ROLE PAGES.
					let rolepage_query = "SELECT page_id FROM role_page WHERE role_id='"+roleData['role_id']+"'";

					// RUNNING THE QUERY ON MAIN DATABASE.
					this.#Db.getRow(rolepage_query).then( pageList =>
					{
						// FULFILLING THE PROMISE OF SENDING USER DATA THAT WE RETRIEVED IN PREVIOUS STEPS.
						resolve({user_data: user, userrole_data: roleData, userpage_data: pageList});

					}).catch((error)=>
					{
						// WE COULD NOT GET THE DATA FROM DATABASE. REJECTING THE PROMISE.
						reject({success: false, error : error});
					});
					
				}).catch((error)=>
				{
					// WE COULD NOT GET THE DATA FROM DATABASE. REJECTING THE PROMISE.
					reject({success: false, error : error});
				});
			}).catch((error)=>
			{
				// WE COULD NOT GET THE DATA FROM DATABASE. REJECTING THE PROMISE.
				reject({success: false, error : error});
			});
		});
	}
	
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = User;
