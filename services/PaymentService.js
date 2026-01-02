// IMPORT RAZORPAY SDK
import Razorpay from "razorpay";
// IMPORT CRYPTO FOR SIGNATURE VERIFICATION
import crypto from "crypto";

// PAYMENT SERVICE TO HANDLE RAZORPAY OPERATIONS
export class PaymentService {
    constructor() {
        // INITIALIZE RAZORPAY INSTANCE WITH API KEYS FROM ENVIRONMENT
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "WXgQyrXx4LzeKm1f57M4urxF"
        });
    }

    // ================================================
    // FUNCTION TO CREATE RAZORPAY ORDER
    // ================================================
    async createOrder(amount, currency, receipt) {
        try {
            // VALIDATE INPUTS
            if (!amount || amount <= 0) {
                throw new Error("Amount must be greater than 0");
            }

            if (!currency) {
                currency = "INR";
            }

            if (!receipt) {
                receipt = `receipt_${Date.now()}`;
            }

            // CREATE RAZORPAY ORDER OPTIONS
            const options = {
                amount: amount, // Amount in paise (smallest currency unit)
                currency: currency,
                receipt: receipt,
            };

            // CREATE ORDER IN RAZORPAY
            const order = await this.razorpay.orders.create(options);

            // RETURN ORDER WITH KEY_ID FOR FRONTEND
            return {
                success: true,
                data: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt,
                    status: order.status,
                    key_id: this.razorpay.key_id // Include key_id for frontend
                },
                message: "Razorpay order created successfully"
            };
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw new Error("Failed to create payment order: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO VERIFY PAYMENT SIGNATURE
    // ================================================
    async verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        try {
            // VALIDATE INPUTS
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                throw new Error("Missing payment verification parameters");
            }

            // GENERATE SIGNATURE FOR VERIFICATION
            const generated_signature = crypto
                .createHmac("sha256", this.razorpay.key_secret)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest("hex");

            // COMPARE GENERATED SIGNATURE WITH RAZORPAY SIGNATURE
            if (generated_signature === razorpay_signature) {
                // PAYMENT VERIFICATION SUCCESSFUL
                return {
                    success: true,
                    data: {
                        order_id: razorpay_order_id,
                        payment_id: razorpay_payment_id,
                        signature: razorpay_signature
                    },
                    message: "Payment verified successfully"
                };
            } else {
                // PAYMENT VERIFICATION FAILED
                throw new Error("Payment verification failed: Invalid signature");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw new Error("Payment verification failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET PAYMENT DETAILS BY PAYMENT ID
    // ================================================
    async getPaymentDetails(payment_id) {
        try {
            // FETCH PAYMENT DETAILS FROM RAZORPAY
            const payment = await this.razorpay.payments.fetch(payment_id);
            
            return {
                success: true,
                data: payment,
                message: "Payment details fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching payment details:", error);
            throw new Error("Failed to fetch payment details: " + error.message);
        }
    }
}

