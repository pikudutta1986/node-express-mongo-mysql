// IMPORT PAYMENT SERVICE TO HANDLE RAZORPAY OPERATIONS
import { PaymentService } from "../services/PaymentService.js";

// IMPORT AUTH MIDDLEWARE TO VERIFY JWT TOKEN AND ATTACH USER INFO
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

export class PaymentRoutes {
    constructor(app) {
        // CREATE AN INSTANCE OF PAYMENT SERVICE
        this.paymentService = new PaymentService();

        // REGISTER ALL PAYMENT-RELATED API ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log("REGISTER PAYMENT ENDPOINTS");

        // ================================================
        // CREATE RAZORPAY ORDER - AUTH REQUIRED
        // ================================================
        app.post("/api/payments/create-order", AuthMiddleware, async (req, res) => {
            try {
                // EXTRACT AMOUNT, CURRENCY, AND RECEIPT FROM REQUEST BODY
                const { amount, currency, receipt } = req.body;

                // VALIDATE REQUEST BODY
                if (!amount || amount <= 0) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Amount is required and must be greater than 0" 
                    });
                }

                // CALL SERVICE TO CREATE RAZORPAY ORDER
                const result = await this.paymentService.createOrder(
                    amount,
                    currency || "INR",
                    receipt
                );

                // RETURN SUCCESS RESPONSE
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR CREATING PAYMENT ORDER:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });

        // ================================================
        // VERIFY PAYMENT - AUTH REQUIRED
        // ================================================
        app.post("/api/payments/verify-payment", AuthMiddleware, async (req, res) => {
            try {
                // EXTRACT PAYMENT DETAILS FROM REQUEST BODY
                const { 
                    razorpay_order_id, 
                    razorpay_payment_id, 
                    razorpay_signature 
                } = req.body;

                // VALIDATE REQUEST BODY
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Missing payment verification parameters" 
                    });
                }

                // CALL SERVICE TO VERIFY PAYMENT
                const result = await this.paymentService.verifyPayment(
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                );

                // RETURN SUCCESS RESPONSE
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR VERIFYING PAYMENT:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });

        // ================================================
        // GET PAYMENT DETAILS BY PAYMENT ID - AUTH REQUIRED
        // ================================================
        app.get("/api/payments/:payment_id", AuthMiddleware, async (req, res) => {
            try {
                // EXTRACT PAYMENT ID FROM REQUEST PARAMS
                const { payment_id } = req.params;

                // VALIDATE PAYMENT ID
                if (!payment_id) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Payment ID is required" 
                    });
                }

                // CALL SERVICE TO FETCH PAYMENT DETAILS
                const result = await this.paymentService.getPaymentDetails(payment_id);

                // RETURN SUCCESS RESPONSE
                res.status(200).json(result);
            } catch (error) {
                console.error("ERROR FETCHING PAYMENT DETAILS:", error);
                // SEND ERROR RESPONSE
                res.status(400).json({ 
                    success: false,
                    message: error.message 
                });
            }
        });
    }
}

