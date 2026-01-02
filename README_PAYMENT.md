# Payment Integration - Razorpay

This document describes the Razorpay payment gateway integration for the Node.js Express backend.

## Setup Instructions

### 1. Install Dependencies

The Razorpay package has been installed. If you need to reinstall:

```bash
npm install razorpay
```

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**To get your Razorpay keys:**
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** > **API Keys**
3. Generate a new key pair
4. Copy the **Key ID** and **Key Secret** to your `.env` file

**Note:** For testing, you can use test keys. The code includes fallback test keys, but it's recommended to use your own keys.

### 3. API Endpoints

#### Create Razorpay Order
- **Endpoint:** `POST /api/payments/create-order`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "amount": 10000,      // Amount in paise (10000 = ₹100.00)
    "currency": "INR",     // Optional, defaults to "INR"
    "receipt": "receipt_123"  // Optional, auto-generated if not provided
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "order_xxxxx",
      "amount": 10000,
      "currency": "INR",
      "receipt": "receipt_123",
      "status": "created",
      "key_id": "rzp_test_xxxxx"
    },
    "message": "Razorpay order created successfully"
  }
  ```

#### Verify Payment
- **Endpoint:** `POST /api/payments/verify-payment`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_signature": "signature_xxxxx"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "order_id": "order_xxxxx",
      "payment_id": "pay_xxxxx",
      "signature": "signature_xxxxx"
    },
    "message": "Payment verified successfully"
  }
  ```

#### Get Payment Details
- **Endpoint:** `GET /api/payments/:payment_id`
- **Authentication:** Required (JWT token)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      // Razorpay payment object
    },
    "message": "Payment details fetched successfully"
  }
  ```

## Payment Flow

1. **Frontend** calls `POST /api/payments/create-order` with order amount
2. **Backend** creates a Razorpay order and returns order details with `key_id`
3. **Frontend** opens Razorpay checkout modal using the order details
4. **User** completes payment in Razorpay modal
5. **Frontend** receives payment response and calls `POST /api/payments/verify-payment`
6. **Backend** verifies the payment signature
7. **Frontend** creates order via `POST /api/orders` and updates status to "paid"

## Testing

### Test Mode
Razorpay provides test mode for development. Use test API keys from your Razorpay dashboard.

### Test Cards
Razorpay provides test card numbers for testing:
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **3D Secure:** 4012 0010 3714 1112

### Test Payment Flow
1. Use test API keys in `.env`
2. Create an order with test amount (e.g., ₹100 = 10000 paise)
3. Use test card numbers in Razorpay checkout
4. Complete payment and verify order is created with "paid" status

## Security Notes

1. **Never expose `RAZORPAY_KEY_SECRET`** in frontend code
2. Always verify payment signature on backend before processing orders
3. Use HTTPS in production
4. Store sensitive payment data securely if needed for compliance

## Error Handling

All payment endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error scenarios:
- Invalid amount (must be > 0)
- Missing payment verification parameters
- Invalid payment signature
- Razorpay API errors

## Files Created/Modified

- `services/PaymentService.js` - Razorpay service implementation
- `routes/PaymentRoutes.js` - Payment API routes
- `server.js` - Registered payment routes
- `services/MongoOrderService.js` - Updated to handle `product_id` from frontend
- `routes/MongoOrderRoutes.js` - Updated response formats for consistency

## Support

For Razorpay documentation, visit: https://razorpay.com/docs/

