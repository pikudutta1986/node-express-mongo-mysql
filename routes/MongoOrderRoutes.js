// IMPORT MONGO ORDER SERVICE TO HANDLE DATABASE OPERATIONS
import { MongoOrderService } from "../services/MongoOrderService.js";

// IMPORT AUTH MIDDLEWARE TO VERIFY JWT TOKEN AND ATTACH USER INFO
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

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
                    return res
                        .status(400)
                        .json({ success: false, message: "INVALID REQUEST BODY" });
                }

                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;

                // CALL SERVICE TO CREATE ORDER
                const result = await this.orderService.createOrder(user_id, products);

                // RETURN SUCCESS OR FAILURE BASED ON RESULT
                res.status(result.success ? 201 : 400).json(result);
            } catch (error) {
                console.error("ERROR CREATING ORDER:", error);
                res
                    .status(500)
                    .json({ success: false, message: "INTERNAL SERVER ERROR" });
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
                res.json(result);
            } catch (error) {
                console.error("ERROR FETCHING ORDERS:", error);
                res
                    .status(500)
                    .json({ success: false, message: "INTERNAL SERVER ERROR" });
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
                    return res.status(404).json({ success: false, message: "Order not found." });
                }

                


                // RETURN ORDER DETAILS
                res.json(result);
            } catch (error) {
                console.error("ERROR FETCHING ORDER BY ID:", error);
                res
                    .status(500)
                    .json({ success: false, message: "INTERNAL SERVER ERROR" });
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
                    return res
                        .status(400)
                        .json({ success: false, message: "NOTHING TO UPDATE" });
                }

                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;

                // FETCH ORDER DATA
                let orderData = await this.orderService.getOrderById(req.params.id);

                // CHECK IF ORDER BELONGS TO THE LOGGED-IN USER
                if (orderData.user_id == user_id) {
                    // UPDATE THE ORDER
                    const result = await this.orderService.updateOrder(req.params.id, {
                        user_id,
                        products,
                        status,
                    });

                    // IF ORDER NOT FOUND
                    if (!result) {
                        return res
                            .status(404)
                            .json({ success: false, message: "ORDER NOT FOUND" });
                    }

                    // RETURN SUCCESS RESPONSE
                    res.json({
                        success: true,
                        message: "ORDER UPDATED SUCCESSFULLY",
                        data: result,
                    });
                } else {
                    // IF USER IS NOT OWNER OF THE ORDER
                    return res
                        .status(404)
                        .json({ success: false, message: "ORDER NOT FOUND" });
                }
            } catch (error) {
                console.error("ERROR UPDATING ORDER:", error);
                res
                    .status(500)
                    .json({ success: false, message: "INTERNAL SERVER ERROR" });
            }
        });

        // ================================================
        // DELETE ORDER - AUTH REQUIRED
        // ONLY THE OWNER OF THE ORDER CAN DELETE IT
        // ================================================
        app.delete("/api/orders/:id", AuthMiddleware, async (req, res) => {
            try {
                // GET USER ID FROM AUTH MIDDLEWARE
                let user_id = req.user.id;

                // FETCH ORDER DATA
                let orderData = await this.orderService.getOrderById(req.params.id);

                // CHECK IF ORDER BELONGS TO THE LOGGED-IN USER
                if (orderData.user_id == user_id) {
                    // DELETE THE ORDER
                    const result = await this.orderService.deleteOrder(req.params.id);

                    // IF ORDER NOT FOUND
                    if (!result) {
                        return res
                            .status(404)
                            .json({ success: false, message: "ORDER NOT FOUND" });
                    }

                    // RETURN SUCCESS RESPONSE
                    res.json({
                        success: true,
                        message: "ORDER DELETED SUCCESSFULLY",
                    });
                } else {
                    // IF USER IS NOT OWNER OF THE ORDER
                    return res
                        .status(404)
                        .json({ success: false, message: "ORDER NOT FOUND" });
                }
            } catch (error) {
                console.error("ERROR DELETING ORDER:", error);
                res
                    .status(500)
                    .json({ success: false, message: "INTERNAL SERVER ERROR" });
            }
        });
    }
}
