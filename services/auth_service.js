import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {connectToMySql} from "../database/mysqldb.js";

export class AuthService
{
    constructor()
    {
        this.mysqlConnectionPool = connectToMySql();
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async register(userData)
    {
        try
        {
            const {name, email, password} = userData;
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
            const [result] = await (await this.mysqlConnectionPool).execute(sql,[
                name,
                email,
                hashedPassword
            ]);

            const userObject = {

                id: result.insertId,
                name: name,
                email: email
            };
            return {
                success: true,
                data: userObject,
                message: "User registered successfully"
            };
        } catch (error)
        {
            throw new Error("Registration failed: " + error.message);
        }
    }

    async login(email, password)
    {
        try
        {
            const sql = "SELECT * FROM user WHERE email = ?";
            const [rows] = await (await this.mysqlConnectionPool).execute(sql,[
                email
            ]);

            if (rows.length === 0) throw new Error("User not found");

            const userObject = rows[0];
            const isPasswordValid = await bcrypt.compare(password, userObject.password);

            if (!isPasswordValid) throw new Error("Invalid credentials");

            const generatedToken = jwt.sign(
                userObject,
                this.jwtSecret,
                {expiresIn: "1d"}
            );

            return {
                success: true,
                token: generatedToken, 
                data: userObject,
                message: "Login successful"
            };
        } catch (error)
        {
            throw new Error("Login failed: " + error.message);
        }
    }
}
