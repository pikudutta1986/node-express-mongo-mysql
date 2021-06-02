// GETTING POOL INSTANCE SO WE CAN SEND QUERIES TO CONNECTION POOL. MORE INFO IS ON POOL.JS
const pool = require ("./pool"); // THIS IS A REFERENCE TO THE POOL VARIABLE IN POOL.JS
const mysql = require ("mysql"); // THIS IS A REFERENCE TO THE BUILT IN MYSQL LIBRARY

// EXPORTING DB MODULE SO WE CAN USE IT IN MAIN APP CLASS.
module.exports = function Db()
{
	// FUNCTION TO INSERT DATA INTO DATABASE.
	Db.prototype.insert = function (table, data)
	{
		// EXECUTE ONLY WHEN THERE WAS VALID DATA PASSED
		if (data)
		{
			// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
			return new Promise ((resolve, reject) =>
			{
				let queryRaw = "INSERT INTO `" + table + "` SET ?"; // QUERY STRING TO EXECUTE
				let query = mysql.format (queryRaw, data); // PREPARE THE QUERY

				// EXECUTE THE QUERY
				pool.query (query, (err, result) =>
				{
					console.log (query);

					// IF ERROR IN INSERTING DATA, REJECT THIS PROMISE AND EXIT, ELSE,
					// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
					if (err)
					{
						reject (err);
					}
					else
					{
						resolve (result);
					}
				})
			});
		}
		else
		{
			// LOG ERROR ON SERVER CONSOLE THAT DATA PASSED WAS NOT VALID
			console.log ("No data was submitted to insert into database.");
		}
	}

	// FUNCTION TO UPDATE DATA INTO DATABASE.
	Db.prototype.update = function (table, data, where)
	{
		// EXECUTE ONLY WHEN THERE WAS VALID DATA PASSED
		if (data)
		{
			// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
			return new Promise ((resolve, reject) =>
			{
				let queryRaw = "UPDATE `" + table + "` SET ? " + where; // QUERY STRING TO EXECUTE
				let query = mysql.format (queryRaw, data); // PREPARE THE QUERY
				console.log ("------------------++++++++++++++++++---------", query);

				// EXECUTE THE QUERY
				pool.query (query, (err, result) =>
				{
					// IF ERROR IN UPDATING DATA, REJECT THIS PROMISE AND EXIT, ELSE,
					// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
					if (err)
					{
						reject (err);
					}
					else
					{
						resolve (result);
					}
				});
			});
		}
		else
		{
			console.log ("No data was submitted to update database.");
		}
	}

	// EXECUTE A GIVEN QUERY ON DATABASE
	Db.prototype.execute = function (query)
	{
		// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
		return new Promise ((resolve, reject) =>
		{
			// EXECUTE THE QUERY
			pool.query (query, (err, result, fields) =>
			{
				// IF ERROR IN EXECUTING QUERY, REJECT THIS PROMISE AND EXIT, ELSE,
				// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
				if (err)
				{
					reject (err);
				}
				else
				{
					resolve (result);
				}
			});
		});
	}

	// GET ROWS FROM DATABASE
	Db.prototype.getRows = function (query)
	{
		// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
		return new Promise ((resolve, reject) =>
		{
			// EXECUTE THE QUERY
			pool.query (query, (err, result, fields) =>
			{
				// IF ERROR IN EXECUTING QUERY, REJECT THIS PROMISE AND EXIT, ELSE,
				// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
				if (err)
				{
					reject (err);
				}
				else
				{
					resolve (result);
				}
			})
		});
	}

	// FUNCTION THAT GETS ALL THE ROWS AS AN ARRAY
	Db.prototype.getArray = async function (query, col)
	{
		// EXECUTE THE GIVEN QUERY
		this.getRows (query).then (rows =>
		{
			let data = []; // RETURN ARRAY

			// PUT EACH ROW INTO THE RETURN ARRAY
			rows.forEach (row =>
			{
				data.push (row [col]);
			});

			// RETURN THE ARRAY
			return data;
		});
	}

	// GET SINGLE ROW FROM DATABASE
	Db.prototype.getRow = function (query)
	{
		// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
		return new Promise ((resolve, reject) =>
		{
			// EXECUTE THE QUERY
			pool.query (query, (err, result, fields) =>
			{
				// IF ERROR IN EXECUTING QUERY, REJECT THIS PROMISE AND EXIT, ELSE,
				// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
				if (err)
				{
					reject (err);
				}
				else
				{
					// IF THE DATABASE RETURNED ROW, THEN PICK UP THE ROWS INTO THE RESULT VARIABLE, ELSE IT WILL BE 0
					if (result.length > 0)
					{
						result = result [0];
					}
					else
					{
						result = 0;
					}
					resolve (result);
				}
			})
		});
	}

	// GET A SINGLE VALUE FROM DATABASE
	Db.prototype.getValue = function (query)
	{
		// THIS WILL BE A PROMISE, BECAUSE WE HAVE TO WAIT FOR THE DATABASE TRANSACTION TO COMPLETE.
		return new Promise ((resolve, reject) =>
		{
			try
			{
				// EXECUTE THE QUERY
				pool.query (query, (err, result, fields) =>
				{
					// IF ERROR IN EXECUTING QUERY, REJECT THIS PROMISE AND EXIT, ELSE,
					// RESOLVE THE PROMISE AND SEND BACK QUERY RESULT
					if (err)
					{
						reject (err);
					}
					else
					{
						// IF THE DATABASE RETURNED VALUE, THEN PICK UP THE VALUE INTO THE
						// RESULT VARIABLE, ELSE IT WILL BE 0
						if (result.length > 0)
						{
							result = result [0];
							result = Object.values (result) [0];
						} else
						{
							result = 0;
						}
						console.log ("result getValue ", result);
						resolve (result);
					}
				});
			}
			catch (e)
			{
				// QUERY EXECUTION FAILED
				console.log ("DB Query Failed, ", e);
				reject (e);
			}
		});
	}
}

