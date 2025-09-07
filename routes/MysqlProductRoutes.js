// IMPORT MYSQL PRODUCT SERVICE CLASS
import { MysqlProductService } from "../services/MysqlProductService.js";

// IMPORT AUTHENTICATION MIDDLEWARE TO VERIFY JWT TOKEN
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

// IMPORT ROLE-BASED MIDDLEWARE TO RESTRICT ACCESS BY USER ROLE
import { roleMiddleware } from "./middleware/roleMiddleware.js";

// IMPORT MOMENT FOR DATE/TIME HANDLING
import moment from "moment";

export class MysqlProductRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF MYSQL PRODUCT SERVICE
        this.productService = new MysqlProductService();

        // REGISTER ALL PRODUCT-RELATED API ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log("REGISTER MYSQL PRODUCT ENDPOINTS");

        // ================================================
        // CREATE (INSERT) PRODUCT - ONLY ADMIN ALLOWED
        // ================================================
        app.post("/api/product", AuthMiddleware, roleMiddleware("ADMIN"), async (req, res) => {
            try {
                // GET CURRENT TIMESTAMP FOR CREATED_AT FIELD
                const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

                // BUILD PRODUCT OBJECT FROM REQUEST BODY
                let requestObj = {
                    name: req.body.name,
                    code: req.body.code,
                    category: req.body.category,
                    price: req.body.price,
                    specification: req.body.specification,
                    description: req.body.description,
                    images: req.body.images,
                    created_at: created_at,
                };

                // CALL SERVICE TO INSERT PRODUCT INTO DATABASE
                const result = await this.productService.insertProduct(requestObj);

                // RETURN SUCCESS RESPONSE WITH CREATED PRODUCT
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR INSERTING PRODUCT:", error);
                res.status(400).json({ error: error.message });
            }
        });

        // ================================================
        // GET ALL PRODUCTS - PUBLIC ACCESS
        // ================================================
        app.get("/api/product", async (req, res) => {
            try {
                // CALL SERVICE TO FETCH ALL PRODUCTS
                const result = await this.productService.getAllProducts();

                // RETURN ALL PRODUCTS
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR FETCHING PRODUCTS:", error);
                res.status(400).json({ error: error.message });
            }
        });

        // ================================================
        // GET PRODUCT BY ID - PUBLIC ACCESS
        // ================================================
        app.get("/api/product/:id", async (req, res) => {
            try {
                // CALL SERVICE TO FETCH PRODUCT BY ID
                const result = await this.productService.getProductById(req.params.id);

                // RETURN PRODUCT DETAILS
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR FETCHING PRODUCT BY ID:", error);
                res.status(400).json({ error: error.message });
            }
        });

        // ================================================
        // UPDATE PRODUCT - ONLY ADMIN ALLOWED
        // ================================================
        app.put("/api/product/:id", AuthMiddleware, roleMiddleware("ADMIN"), async (req, res) => {
            try {
                // BUILD UPDATE OBJECT FROM REQUEST BODY
                let requestObj = {
                    name: req.body.name,
                    code: req.body.code,
                    category: req.body.category,
                    price: req.body.price,
                    specification: req.body.specification,
                    description: req.body.description,
                    images: req.body.images,
                };

                // CALL SERVICE TO UPDATE PRODUCT IN DATABASE
                const result = await this.productService.updateProduct(req.params.id, requestObj);

                // RETURN SUCCESS RESPONSE WITH UPDATED PRODUCT
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR UPDATING PRODUCT:", error);
                res.status(400).json({ error: error.message });
            }
        });

        // ================================================
        // DELETE PRODUCT - ONLY ADMIN ALLOWED
        // ================================================
        app.delete("/api/product/:id", AuthMiddleware, roleMiddleware("ADMIN"), async (req, res) => {
            try {
                // CALL SERVICE TO DELETE PRODUCT FROM DATABASE
                const result = await this.productService.deleteProduct(mysqlConnectionPool, req.params.id);

                // RETURN SUCCESS RESPONSE AFTER DELETION
                res.status(201).json(result);
            } catch (error) {
                console.error("ERROR DELETING PRODUCT:", error);
                res.status(400).json({ error: error.message });
            }
        });
    }
}
