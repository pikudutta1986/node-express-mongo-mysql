// INCLUDING MAIN DATABASE CLASS INTO THIS CLASS SO WE CAN PERFORM INSERT/UPDATE/DELETE OPERATIONS ON DATABASE.
const dbClass = require("../database/db");

// NODE MODULE THAT WE WILL USE TO ENCRYPT THE USER PASSWORD BEFORE STORING IT IN THE USER TABLE IN THE DATABASE.
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
				// FULFILLING THE PROMISE OF SENDING USER DATA THAT WE RETRIEVED IN PREVIOUS STEPS.
				resolve({user_data: user, success: true});
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
