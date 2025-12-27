// IMPORT ADMIN SERVICE
import { AdminService } from "../services/AdminService.js";
// IMPORT AUTHENTICATION MIDDLEWARE
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
// IMPORT ROLE-BASED MIDDLEWARE
import { RoleMiddleware } from "../middleware/RoleMiddleware.js";

// ADMIN ROUTES CLASS - RESPONSIBLE FOR DEFINING ADMIN API ENDPOINTS
export class AdminRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF ADMIN SERVICE
        this.adminService = new AdminService();
        // REGISTER ALL ADMIN-RELATED API ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log("REGISTER ADMIN ENDPOINTS");

        // ================================================
        // DASHBOARD STATISTICS - ADMIN ONLY
        // ================================================
        app.get("/api/admin/dashboard", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.adminService.getDashboardStats();
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING DASHBOARD STATS:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // USER MANAGEMENT - ADMIN ONLY
        // ================================================
        
        // GET ALL USERS
        app.get("/api/admin/users", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const filterOptions = {
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                    role: req.query.role || '',
                    search: req.query.search || ''
                };
                const result = await this.adminService.getAllUsers(filterOptions);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING USERS:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // GET USER BY ID
        app.get("/api/admin/users/:id", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.adminService.getUserById(req.params.id);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING USER:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // UPDATE USER
        app.put("/api/admin/users/:id", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.adminService.updateUser(req.params.id, req.body);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR UPDATING USER:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // DELETE USER
        app.delete("/api/admin/users/:id", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const result = await this.adminService.deleteUser(req.params.id);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR DELETING USER:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // ORDER MANAGEMENT - ADMIN ONLY
        // ================================================
        
        // GET ALL ORDERS
        app.get("/api/admin/orders", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const filterOptions = {
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                    status: req.query.status || '',
                    user_id: req.query.user_id || ''
                };
                const result = await this.adminService.getAllOrders(filterOptions);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING ORDERS:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // UPDATE ORDER STATUS
        app.put("/api/admin/orders/:id/status", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const { status } = req.body;
                if (!status) {
                    return res.status(400).json({ message: "Status is required" });
                }
                const result = await this.adminService.updateOrderStatus(req.params.id, status);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR UPDATING ORDER STATUS:", error);
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // BLOG MANAGEMENT - ADMIN ONLY
        // ================================================
        
        // GET ALL BLOGS (ADMIN VIEW)
        app.get("/api/admin/blogs", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                const filterOptions = {
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                    category: req.query.category || '',
                    search: req.query.search || ''
                };
                const result = await this.adminService.getAllBlogs(filterOptions);
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING BLOGS:", error);
                res.status(400).json({ message: error.message });
            }
        });
    }
}

