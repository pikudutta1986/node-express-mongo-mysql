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
    async createOrder(user_id, productList, customerInfo, shippingAddress, paymentInfo = {}, financialData = {}) {
        try {
            let orderItems = [];
            let subtotal = 0;

            const pool = await this.mysqlConnectionPool;
            for (const item of productList) {
                // SUPPORT BOTH product_id (from frontend) AND productId (legacy)
                const productId = item.product_id || item.productId;
                
                // QUERY TO MYSQL TABLE TO GET THE PRODUCT INFORMATION
                const [rows] = await pool.execute(
                    "SELECT id, name, price FROM product WHERE id = ?",
                    [productId]
                );

                // IF NO PRODUCT FOUND
                if (rows.length === 0) {
                    // THROW THE ERROR
                    throw new Error(`Product with ID ${productId} not found`);
                }

                const product = rows[0];
                const total = product.price * item.quantity;

                orderItems.push({
                    product_id: product.id, // Use product_id to match schema
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    total,
                });

                subtotal += total;
            }

            // CALCULATE FINANCIAL BREAKDOWN
            const taxRate = financialData.taxRate !== undefined ? financialData.taxRate : 0;
            const shippingCost = financialData.shippingCost !== undefined ? financialData.shippingCost : 0;
            const taxAmount = financialData.taxAmount !== undefined ? financialData.taxAmount : (subtotal * taxRate / 100);
            const orderTotal = subtotal + taxAmount + shippingCost;

            // PREPARE ORDER DATA
            const orderData = {
                user_id: user_id,
                products: orderItems,
                subtotal: subtotal,
                taxRate: taxRate,
                taxAmount: taxAmount,
                shippingCost: shippingCost,
                orderTotal: orderTotal,
                status: "pending",
                createdAt: new Date(),
            };

            // ADD CUSTOMER INFO IF PROVIDED
            if (customerInfo && customerInfo.fullName && customerInfo.email && customerInfo.phone) {
                orderData.customerInfo = {
                    fullName: customerInfo.fullName,
                    email: customerInfo.email,
                    phone: customerInfo.phone
                };
            }

            // ADD SHIPPING ADDRESS IF PROVIDED
            if (shippingAddress && shippingAddress.addressLine1 && shippingAddress.city && 
                shippingAddress.state && shippingAddress.postalCode && shippingAddress.country) {
                orderData.shippingAddress = {
                    fullName: shippingAddress.fullName || customerInfo?.fullName || 'N/A',
                    addressLine1: shippingAddress.addressLine1,
                    addressLine2: shippingAddress.addressLine2 || '',
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                    phone: shippingAddress.phone || customerInfo?.phone || ''
                };
            }

            // ADD PAYMENT INFO IF PROVIDED
            if (paymentInfo) {
                if (paymentInfo.paymentMethod) orderData.paymentMethod = paymentInfo.paymentMethod;
                if (paymentInfo.razorpay_order_id) orderData.razorpay_order_id = paymentInfo.razorpay_order_id;
                if (paymentInfo.razorpay_payment_id) orderData.razorpay_payment_id = paymentInfo.razorpay_payment_id;
                if (paymentInfo.razorpay_signature) orderData.razorpay_signature = paymentInfo.razorpay_signature;
            }

            // SAVE ORDER TO MONGO DB
            const order = new Order(orderData);
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
