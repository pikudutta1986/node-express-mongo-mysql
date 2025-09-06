import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerName: {type: String,required: true},
        customerEmail: {type: String,required: true},

        products: [
            {
                productId: {type: Number,required: true}, // MySQL product ID
                name: {type: String,required: true},      // cached product name
                price: {type: Number,required: true},     // price at order time
                quantity: {type: Number,required: true},  // how many ordered
                total: {type: Number,required: true}      // price * quantity
            }
        ],

        orderTotal: {type: Number,required: true},
        status: {type: String,enum: ["pending","paid","shipped"],default: "pending"}
    },
    {timestamps: true}
);

export default mongoose.model("Order",orderSchema);
