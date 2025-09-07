// IMPORT MONGO ORDER MODEL
import Order from "../mongo_models/order.js";
// IMPORT MYSQL DB CONNECTION POOL
import { connectToMySql } from "../database/mysqldb.js";
// IMPORT MONGOOSE
import mongoose from "mongoose";

// MONGO ORDER SERVICE TO OPERATE CURD OPERATIONS ON MONGO ORDER MODEL 
export class MongoOrderService {
    constructor() {
        // MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
    }

    // ================================================
    // FUNCTION TO CREATE ORDER
    // ================================================
    async createOrder(user_id, productList) {
        try {
            let orderItems = [];
            let orderTotal = 0;

            for (const item of productList) {
                // QUERY TO MYSQL TABLE TO GET THE PRODUCT INFORMATION
                const [rows] = await this.mysqlConnectionPool.query(
                    "SELECT id, name, price FROM products WHERE id = ?",
                    [item.productId]
                );

                // IF NO PRODUCT FOUND
                if (rows.length === 0) {
                    // THROW THE ERROR
                    throw new Error(`Product with ID ${item.productId} not found`);
                }

                const product = rows[0];
                const total = product.price * item.quantity;

                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    total,
                });

                orderTotal += total;
            }

            // SAVE ORDER TO MONGO DB
            const order = new Order({
                user_id: user_id,
                products: orderItems,
                orderTotal,
                status: "pending",
                createdAt: new Date(),
            });
            const result = await order.save();

            // RETURN THE FUNCTION RESPONSE
            return { 
                success: true, 
                data: result, 
                message: "Order created successfully" 
            };
        } catch (error) {
            console.error("Error creating order:", error);
            // THROW CREATE ORDER FAILED ERROR
            throw new Error("Create order failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ALL ORDERS BY FILTER
    // ================================================
    async getAllOrders(filterOptions) {
        try {
            // GET ORDERS BY FILTER OPTIONS
            const result = await Order.find(filterOptions);
            // RETURN THE FUNCTION RESPONSE
            return { 
                success: true, 
                data: result, 
                message: "Orders fetched successfully" 
            };
        } catch (error) {
            console.error("Error fetching orders:", error);
            // THROW GET FILTERED ORDERS FAILED ERROR
            throw new Error("Get all order failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ORDER BY ID
    // ================================================
    async getOrderById(id) {
        try {
            // IF THE ID IS NOT VALID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Not a valid id");
            }
            // GET ORDER BY ID
            const result = await Order.findById(id);
            // RETURN THE FUNCTION RESPONSE
            return { 
                success: true, 
                data: result, 
                message: "Order fetched successfully" 
            };
        } catch (error) {
            console.error("Error fetching order:", error);
            // THROW GET ORDER FAILED ERROR
            throw new Error("Get order failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE ORDER BY ID
    // ================================================
    async updateOrder(id, updateData) {
        try {
            // IF THE ID IS NOT VALID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                // THROW ID NOT VALID ERROR
                throw new Error("Not a valid id");
            }

            const allowedFields = ["products", "status"];
            const updateFields = {};

            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updateFields[field] = updateData[field];
                }
            }

            // IF UPDATE FILEDS NOT FOUND
            if (Object.keys(updateFields).length === 0) {
                // THROW UPDATE FIELDS ERROR
                throw new Error("Update fileds are not correct");
            }

            // UPDATE THE ORDER
            const result = await Order.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );
            // RETURN THE FUNCTION RESPONSE
            return { 
                success: true, 
                data: result, 
                message: "Order created successfully" 
            };
        } catch (error) {
            console.error("Error updating order:", error);
            // THROW ORDER UPDATE FAILED ERROR
            throw new Error("Order update failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO DELETE ORDER BY ID
    // ================================================
    async deleteOrder(id) {
        try {
            // IF THE ID IS NOT VALID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Not a valid id");
            }
            // FIND THE ITEM AND DELETE
            const result = await Order.findByIdAndDelete(id);
            // RETURN THE FUNCTION RESPONSE
            return { 
                success: true, 
                message: "Order deleted successfully" 
            };
        } catch (error) {
            console.error("Error deleting order:", error);
            // THROW ORDER DELETE FAILED ERROR
            throw new Error("Order update failed: " + error.message);
        }
    }
}
