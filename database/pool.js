const mysql = require ('mysql'); // REFERENCE TO THE MYSQL LIBRARY
const util = require ('util'); // REFERENCE TO THE UTIL LIBRARY
require ('dotenv').config (); // GET THE CONFIGURATIONS FROM THE .ENV FILE

// CREATE A MYSQL POOL CONFIGURATION TO CONNECT TO THE LK_MAIN DATABASE USING VALUES IN THE .ENV FILE
var pool = mysql.createPool
({
	connectionLimit: process.env.connectionLimit,
	host: process.env.mysqlhost,
	user: process.env.mysqluser,
	password: process.env.mysqlpass,
	database: process.env.mysqldb,
	port: process.env.mysqlport,
	multipleStatements: true,
	dateStrings: true
	//waitForConnections: false,
	//debug: true
});

// CREATE THE CONNECTION
pool.getConnection (function (err, connection)
{
	console.log ("getting main db connection")

	// IF CONNECTION COULD NOT BE ESTABLISHED, LOG THE REASON ON THE CONSOLE
	if (err)
	{
		if (err.code === 'PROTOCOL_CONNECTION_LOST')
		{
			console.error ('Database connection was closed.')
		}
		if (err.code === 'ER_CON_COUNT_ERROR')
		{
			console.error ('Database has too many connections.')
		}
		if (err.code === 'ECONNREFUSED')
		{
			console.error ('Database connection was refused.')
		}
		console.log ("Error in db connection ", err);
	}

	// CONNECTION SUCCESSFULLY ESTABLISHED
	if (connection)
	{
		console.log ("releasing main db connection");
		connection.release()
	}
	return
});

// ALL QUERIES WILL BE EXECUTED VIA PROMISES TO GIVE TIME FOR DATABASE TRANSACTION
pool.query = util.promisify (pool.query);

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = pool;
