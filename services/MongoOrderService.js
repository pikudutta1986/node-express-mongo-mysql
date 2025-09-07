// IMPORT MONGO ORDER MODEL
import Order from "../mongo_models/order.js";
// IMPORT MYSQL DB CONNECTION POOL
import { connectToMySql } from "../database/mysqldb.js";
import mongoose from "mongoose";

export class MongoOrderService {
    constructor() {
        // MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
    }

    // CREATE ORDER
    async createOrder(user_id, productList) {
        try {
            let orderItems = [];
            let orderTotal = 0;

            for (const item of productList) {
                // QUERY TO MYSQL TABLE
                const [rows] = await this.mysqlConnectionPool.query(
                    "SELECT id, name, price FROM products WHERE id = ?",
                    [item.productId]
                );

                if (rows.length === 0) {
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

            // Save to MongoDB
            const order = new Order({
                user_id: user_id,
                products: orderItems,
                orderTotal,
                status: "pending",
                createdAt: new Date(),
            });

            const result = await order.save();
            return { success: true, data: result, message: "Order created successfully" };
        } catch (error) {
            console.error("Error creating order:", error);
            throw new Error("Login failed: " + error.message);
        }
    }

    // GET ALL ORDERS
    async getAllOrders(filterOptions) {
        try {
            const orders = await Order.find(filterOptions);
            return { success: true, data: orders };
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw new Error("Login failed: " + error.message);
        }
    }

    // GET ORDER BY ID
    async getOrderById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            const order = await Order.findById(id);
            return order;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw new Error("Login failed: " + error.message);
        }
    }

    // UPDATE ORDER
    async updateOrder(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            const allowedFields = ["products", "status"];
            const updateFields = {};

            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updateFields[field] = updateData[field];
                }
            }

            if (Object.keys(updateFields).length === 0) {
                return null; // nothing to update
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );

            return updatedOrder;
        } catch (error) {
            console.error("Error updating order:", error);
            throw new Error("Login failed: " + error.message);
        }
    }

    // DELETE ORDER
    async deleteOrder(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            const result = await Order.findByIdAndDelete(id);
            return result ? true : false;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw new Error("Login failed: " + error.message);
        }
    }
}
