import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user_id: {type: Number,required: true},
        products: [
            {
                product_id: {type: Number,required: true}, // MySQL product ID
                name: {type: String,required: true},      // cached product name
                price: {type: Number,required: true},     // price at order time
                quantity: {type: Number,required: true},  // how many ordered
                total: {type: Number,required: true}      // price * quantity
            }
        ],
        
        // Financial Breakdown
        subtotal: {type: Number, required: true},         // Sum of all products before tax/shipping
        taxRate: {type: Number, default: 0},              // Tax percentage (e.g., 10 for 10%)
        taxAmount: {type: Number, default: 0},            // Calculated tax amount
        shippingCost: {type: Number, default: 0},         // Shipping cost (0 for free)
        orderTotal: {type: Number, required: true},       // Final total (subtotal + tax + shipping)
        
        status: {type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending"},
        
        // Customer Information
        customerInfo: {
            fullName: {type: String, required: true},
            email: {type: String, required: true},
            phone: {type: String, required: true}
        },
        
        // Shipping Address
        shippingAddress: {
            fullName: {type: String, required: true},
            addressLine1: {type: String, required: true},
            addressLine2: {type: String},
            city: {type: String, required: true},
            state: {type: String, required: true},
            postalCode: {type: String, required: true},
            country: {type: String, required: true},
            phone: {type: String}
        },
        
        // Payment Information
        paymentMethod: {type: String, default: 'razorpay'},
        razorpay_order_id: {type: String},
        razorpay_payment_id: {type: String},
        razorpay_signature: {type: String}
    },
    {timestamps: true}
);

export default mongoose.model("Order",orderSchema);
