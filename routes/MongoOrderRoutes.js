// IMPORT MONGO ORDER SERVICE TO HANDLE DATABASE OPERATIONS
import { MongoOrderService } from "../services/MongoOrderService.js";

// IMPORT AUTH MIDDLEWARE TO VERIFY JWT TOKEN AND ATTACH USER INFO
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

// IMPORT ROLE-BASED MIDDLEWARE TO RESTRICT ACCESS BY USER ROLE
import { RoleMiddleware } from "../middleware/RoleMiddleware.js";

export class MongoOrderRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF MONGO ORDER SERVICE
        this.orderService = new MongoOrderService();

        // REGISTER ALL ORDER-RELATED API ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log("REGISTER MONGO ORDER ENDPOINTS");

        // ================================================
        // CREATE ORDER - AUTH REQUIRED
        // ================================================
        app.post("/api/orders", AuthMiddleware, async (req, res) => {
            try {
                // EXTRACT USER_ID AND PRODUCTS FROM REQUEST BODY
                const { products } = req.body;

                // VALIDATE REQUEST BODY
                if (!products || !Array.isArray(products)) {
                    // SEND ERROR RESPONSE
                    res.status(400).json({ message: "No products found to create order" });
                }

                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;

                // CALL SERVICE TO CREATE ORDER
                const result = await this.orderService.createOrder(user_id, products);
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // GET ALL ORDERS - AUTH REQUIRED
        // ADMIN TO GET ALL ORDERS, CUSTOMER WILL GET ONLY HIS ORDERS
        // ================================================
        app.get("/api/orders", AuthMiddleware, async (req, res) => {
            try {
                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;
                // GET USER ROLE FROM AUTH MIDDLEWARE
                let role = req.user.role;
                // FILTER OPTIONS FOR ORDER DATA IN MONGO DB
                let filterOptions = {};

                // IF USER IS NOT ADMIN
                if (role != 'ADMIN') {
                    // ADD USER ID TO FILTER OPTION
                    filterOptions.user_id = user_id;
                }
                // CALL SERVICE TO FETCH ALL ORDERS
                const result = await this.orderService.getAllOrders(filterOptions);
                // RETURN ORDERS
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR FETCHING ORDERS:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // GET ORDER BY ID - AUTH REQUIRED
        // ================================================
        app.get("/api/orders/:id", AuthMiddleware, async (req, res) => {
            try {
                // CALL SERVICE TO FETCH ORDER BY ID
                const result = await this.orderService.getOrderById(req.params.id);

                // IF ORDER DOES NOT EXIST, RETURN 404
                if (!result) {
                    return res.status(400).json({error: "Order id not found." });
                }
                // RETURN ORDERS
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR FETCHING ORDER BY ID:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // UPDATE ORDER - AUTH REQUIRED
        // ONLY THE OWNER OF THE ORDER AND ADMIN CAN UPDATE IT
        // ================================================
        app.put("/api/orders/:id", AuthMiddleware, async (req, res) => {
            try {
                // EXTRACT PRODUCTS AND STATUS FROM REQUEST BODY
                const { products, status } = req.body;

                // VALIDATE UPDATE REQUEST BODY
                if (!products && !status) {
                    // SEND ERROR RESPONSE
                    res.status(400).json({ message: "Nothing to update" });
                }

                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;

                // GET USER ROLE FROM AUTH MIDDLEWARE
                let role = req.user.role;

                // FETCH ORDER DATA
                let orderData = await this.orderService.getOrderById(req.params.id);

                // IF ORDER NOT FOUND
                if (!orderData) {
                    // SEND ERROR RESPONSE
                    res.status(400).json({ message: "Order not found" });
                }

                // CHECK IF ORDER BELONGS TO THE USER OR THE USER IS ADMIN
                if (orderData.user_id == user_id || role == 'ADMIN') {
                    // UPDATE THE ORDER
                    const result = await this.orderService.updateOrder(req.params.id, {
                        products,
                        status,
                    });

                    // RETURN ORDERS
                    res.status(201).json(result);
                } else {
                    // SEND ERROR RESPONSE
                    res.status(400).json({ message: "Order not found" });
                }
            } catch (error) {
                console.error("ERROR UPDATING ORDER:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // DELETE ORDER - AUTH REQUIRED
        // ONLY ADMIN CAN DELETE
        // ================================================
        app.delete("/api/orders/:id", AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                // FETCH ORDER DATA
                let orderData = await this.orderService.getOrderById(req.params.id);

                // IF ORDER NOT FOUND
                if (!orderData) {
                    // SEND ERROR RESPONSE
                    res.status(400).json({ message: "Order not found" });
                }

                // DELETE THE ORDER
                const result = await this.orderService.deleteOrder(req.params.id);

                // RETURN ORDERS
                res.status(201).json(result);
                
            } catch (error) {
                console.error("ERROR DELETING ORDER:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });
    }
}
