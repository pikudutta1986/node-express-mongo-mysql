import {AuthService} from "../services/auth_service.js";
import express from "express";

export class AuthRoutes
{
    constructor(app)
    {
        this.authService = new AuthService();
        this.registerEndpoints(app);
    }

    registerEndpoints(app)
    {
        const router = express.Router();

        // Register
        app.post("/api/auth/register",async (req,res) =>
        {
            try
            {
                const result = await this.authService.register(req.body);
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error in register:",error);
                res.status(400).json({error: error.message});
            }
        });

        // Login
        app.post("/api/auth/login",async (req,res) =>
        {
            try
            {
                const {email,password} = req.body;
                const result = await this.authService.login(email,password);
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error in login:",error);
                res.status(400).json({error: error.message});
            }
        });
    }
}
