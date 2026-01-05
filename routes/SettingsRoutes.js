// IMPORT SETTINGS SERVICE
import { SettingsService } from "../services/SettingsService.js";
// IMPORT AUTHENTICATION MIDDLEWARE
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
// IMPORT ROLE-BASED MIDDLEWARE
import { RoleMiddleware } from "../middleware/RoleMiddleware.js";

// SETTINGS ROUTES CLASS - RESPONSIBLE FOR DEFINING SETTINGS API ENDPOINTS
export class SettingsRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF SETTINGS SERVICE
        this.settingsService = new SettingsService();
        // REGISTER ALL SETTINGS-RELATED API ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log("REGISTER SETTINGS ENDPOINTS");

        // ================================================
        // GET ALL SETTINGS - ADMIN ONLY
        // ================================================
        app.get("/api/admin/settings", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.settingsService.getAllSettings();
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING SETTINGS:", error);
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });

        // ================================================
        // GET SINGLE SETTING BY KEY - ADMIN ONLY
        // ================================================
        app.get("/api/admin/settings/:key", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.settingsService.getSetting(req.params.key);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING SETTING:", error);
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });

        // ================================================
        // UPDATE SETTINGS (BULK) - ADMIN ONLY
        // ================================================
        app.put("/api/admin/settings", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const settingsData = req.body;
                
                if (!settingsData || typeof settingsData !== 'object') {
                    return res.status(400).json({ 
                        success: false,
                        message: "Invalid settings data" 
                    });
                }

                const result = await this.settingsService.updateSettings(settingsData);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR UPDATING SETTINGS:", error);
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });

        // ================================================
        // UPDATE SINGLE SETTING - ADMIN ONLY
        // ================================================
        app.put("/api/admin/settings/:key", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const { value, type, description } = req.body;
                
                if (value === undefined) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Value is required" 
                    });
                }

                const result = await this.settingsService.updateSetting(
                    req.params.key,
                    value,
                    type || 'string',
                    description || null
                );
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR UPDATING SETTING:", error);
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });
    }
}

