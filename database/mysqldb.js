import mysql from "mysql2/promise";
let pool;
export async function connectToMySql()
{
    try {
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
            console.log("Connected to MySql DB");
        }
        return pool;
    } catch (err) {
        console.error('Failed to connect MySql DB:', err);
        process.exit(1);
    }
}