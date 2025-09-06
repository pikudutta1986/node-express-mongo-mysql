import mysql from "mysql2/promise";
let pool;
export async function connectToMySql()
{
    if (!pool)
    {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log("Connected to MySQL DB");
    }
    return pool;
}