import { MongoOrderService } from "../services/mongo_order.js";

export class MongoOrderRoutings {
    constructor(app) {
        this.orderService = new MongoOrderService();
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log('register Mongo Order Endpoints');
        // Create order
        app.post("/api/orders", async (req, res) => {
            try {
                const { customer, products } = req.body;
                if (!customer || !products || !Array.isArray(products)) {
                    return res.status(400).json({ success: false, message: "Invalid request body" });
                }
                const result = await this.orderService.createOrder(customer, products);
                res.status(result.success ? 201 : 400).json(result);
            } catch (error) {
                console.error("Error creating order:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });

        // Get all orders
        app.get("/api/orders", async (req, res) => {
            try {
                const result = await this.orderService.getAllOrders();
                res.json(result);
            } catch (error) {
                console.error("Error fetching orders:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });

        // Get order by ID
        app.get("/api/orders/:id", async (req, res) => {
            try {
                const result = await this.orderService.getOrderById(req.params.id);
                if (!result) {
                    return res.status(404).json({ success: false, message: "Order not found" });
                }
                res.json(result);
            } catch (error) {
                console.error("Error fetching order by ID:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });

        // Update order
        app.put("/api/orders/:id", async (req, res) => {
            try {
                const { customer, products, status } = req.body;
                if (!customer && !products && !status) {
                    return res.status(400).json({ success: false, message: "Nothing to update" });
                }

                const result = await this.orderService.updateOrder(req.params.id, { customer, products, status });
                if (!result) {
                    return res.status(404).json({ success: false, message: "Order not found" });
                }

                res.json({ success: true, message: "Order updated successfully", data: result });
            } catch (error) {
                console.error("Error updating order:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });

        // Delete order
        app.delete("/api/orders/:id", async (req, res) => {
            try {
                const result = await this.orderService.deleteOrder(req.params.id);
                if (!result) {
                    return res.status(404).json({ success: false, message: "Order not found" });
                }

                res.json({ success: true, message: "Order deleted successfully" });
            } catch (error) {
                console.error("Error deleting order:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
