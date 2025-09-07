// IMPORT AUTHSERVICE WHICH HANDLES THE ACTUAL LOGIC FOR AUTHENTICATION
import { AuthService } from "../services/AuthService.js";
import express from "express";

// AUTHROUTES CLASS - RESPONSIBLE FOR DEFINING AUTHENTICATION ROUTES
export class AuthRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF AUTHSERVICE
        this.authService = new AuthService();
        // REGISTER ROUTES WITH THE EXPRESS APP
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        // CREATE A NEW ROUTER (GOOD PRACTICE TO GROUP ROUTES)
        const router = express.Router();

        /**
         * @ROUTE   POST /api/auth/register
         * @DESC    REGISTER A NEW USER
         * @ACCESS  PUBLIC
         */
        app.post("/api/auth/register", async (req, res) => {
            try {
                // CALL SERVICE LAYER TO HANDLE REGISTRATION
                const result = await this.authService.register(req.body);
                // RESPOND WITH SUCCESS + USER INFO
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR IN REGISTER:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ error: error.message });
            }
        });

        /**
         * @ROUTE   POST /api/auth/login
         * @DESC    LOGIN USER AND RETURN JWT TOKEN
         * @ACCESS  PUBLIC
         */
        app.post("/api/auth/login", async (req, res) => {
            try {
                const { email, password } = req.body;
                // CALL SERVICE LAYER TO VALIDATE USER + GENERATE TOKEN
                const result = await this.authService.login(email, password);
                // RESPOND WITH TOKEN + USER INFO
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR IN LOGIN:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ error: error.message });
            }
        });
    }
}
