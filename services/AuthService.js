// IMPORT bcryptjs TO HASH A PASSWORD AND COMPARE HASH PASSWORD
import bcrypt from "bcryptjs";
// IMPORT jsonwebtoken TO GENERATE AUTH TOKEN
import jwt from "jsonwebtoken";
import {connectToMySql} from "../database/mysqldb.js";

// AUTH SERVICE TO HANDLE AUTHENTICATION RELATED OPERATIONS
export class AuthService
{
    constructor()
    {
        // SET THE MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
        // SET THE JWT SECRET
        this.jwtSecret = process.env.JWT_SECRET;
    }

    // ================================================
    // FUNCTION TO CREATE A USER
    // ================================================
    async register(userData)
    {
        try
        {
            // GET ROLE, NAME, EMAIL, PASSWORD FROM USER DATA
            const {role, name, email, password} = userData;
            // CREATE A HASH PASSWORD
            const hashedPassword = await bcrypt.hash(password, 10);

            // INSERT THE USER IN MYSQL DB
            const sql = "INSERT INTO user (role, name, email, password) VALUES (?, ?, ?, ?)";
            const [result] = await (await this.mysqlConnectionPool).execute(sql,[
                role,
                name,
                email,
                hashedPassword
            ]);

            // USER OBJECT TO RETURN
            const userObject = {
                id: result.insertId,
                role: role,
                name: name,
                email: email
            };

            // RETURN THE USER DATA
            return {
                success: true,
                data: userObject,
                message: "User registered successfully"
            };
        } catch (error)
        {
            // THROW REGISTRATION FAILED ERROR
            throw new Error("Registration failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO LOGIN AND CREATE AUTH TOKEN 
    // ================================================
    async login(email, password)
    {
        try
        {
            // QUERY TO GET USER BY EMAIL
            const sql = "SELECT * FROM user WHERE email = ?";
            const [rows] = await (await this.mysqlConnectionPool).execute(sql,[
                email
            ]);

            // IF USER NOT FOUND WITH THE EMAIL
            if (rows.length === 0) {
                // THROW USER NOT FOUND ERROR
                throw new Error("User not found");
            }

            // GET THE USER
            const userObject = rows[0];

            // COMPARE THE USER PASSWORD WITH PASSWORD HASH FROM DB
            const isPasswordValid = await bcrypt.compare(password, userObject.password);

            // IF PASSWORD NOT VALID
            if (!isPasswordValid) {
                // THROW INVALID CREDENTIAL ERROR
                throw new Error("Invalid credentials");
            }

            // GENERATE TOKEN FOR AUTHENTICATION PURPOSE
            const generatedToken = jwt.sign(
                userObject,
                this.jwtSecret,
                {expiresIn: "1d"}
            );

            // RETURN THE USER DATA AND TOKEN RESPONSE 
            return {
                success: true,
                token: generatedToken, 
                data: userObject,
                message: "Login successful"
            };
        } catch (error)
        {
            // THROW LOGIN FAILED ERROR
            throw new Error("Login failed: " + error.message);
        }
    }
}
