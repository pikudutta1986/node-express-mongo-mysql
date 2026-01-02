# Admin Panel API Documentation

This document describes all the backend APIs required for the admin panel functionality.

## Authentication

All admin endpoints require:
- **JWT Token** in the Authorization header
- **ADMIN Role** - Only users with role 'ADMIN' can access these endpoints

## API Endpoints

### 1. Dashboard Statistics

**Endpoint:** `GET /api/admin/dashboard`

**Description:** Get dashboard statistics including user counts, product counts, order counts, revenue, and recent activity.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "admins": 5,
      "customers": 145
    },
    "products": {
      "total": 50
    },
    "orders": {
      "total": 200,
      "pending": 10,
      "paid": 150,
      "shipped": 40
    },
    "revenue": {
      "total": 50000
    },
    "blogs": {
      "total": 25
    },
    "recentOrders": [
      {
        "_id": "order_id",
        "user_id": 1,
        "products": [...],
        "orderTotal": 100,
        "status": "paid",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "recentUsers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "CUSTOMER",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Dashboard statistics fetched successfully"
}
```

---

### 2. User Management

#### Get All Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `role` (optional): Filter by role ('ADMIN' or 'CUSTOMER')
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 150,
    "totalPages": 15
  },
  "message": "Users fetched successfully"
}
```

#### Get User by ID

**Endpoint:** `GET /api/admin/users/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User fetched successfully"
}
```

#### Update User

**Endpoint:** `PUT /api/admin/users/:id`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "ADMIN",
  "password": "newpassword123"  // Optional, only if changing password
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "ADMIN",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

#### Delete User

**Endpoint:** `DELETE /api/admin/users/:id`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 3. Order Management

#### Get All Orders

**Endpoint:** `GET /api/admin/orders`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `status` (optional): Filter by status ('pending', 'paid', 'shipped')
- `user_id` (optional): Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "user_id": 1,
      "products": [
        {
          "product_id": 1,
          "name": "Product Name",
          "price": 10,
          "quantity": 2,
          "total": 20
        }
      ],
      "orderTotal": 20,
      "status": "paid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 200,
    "totalPages": 20
  },
  "message": "Orders fetched successfully"
}
```

#### Update Order Status

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Request Body:**
```json
{
  "status": "shipped"  // Must be one of: "pending", "paid", "shipped"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user_id": 1,
    "products": [...],
    "orderTotal": 20,
    "status": "shipped",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order status updated successfully"
}
```

---

### 4. Blog Management

#### Get All Blogs

**Endpoint:** `GET /api/admin/blogs`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title or content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "blog_id",
      "title": "Blog Title",
      "content": "Blog content...",
      "category": "Technology",
      "author": "Author Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3
  },
  "message": "Blogs fetched successfully"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error, missing parameters)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (user doesn't have ADMIN role)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Implementation Files

### Backend Files:
- `routes/AdminRoutes.js` - Route definitions
- `services/AdminService.js` - Business logic
- `middleware/AuthMiddleware.js` - JWT authentication
- `middleware/RoleMiddleware.js` - Role-based access control

### Frontend Files:
- `src/app/services/admin.service.ts` - Angular service for API calls
- `src/app/admin/dashboard/dashboard.ts` - Dashboard component
- `src/app/admin/users/users.ts` - User management component
- `src/app/admin/orders/orders.ts` - Order management component

---

## Testing

### Test Admin User

To test the admin panel, you need a user with the `ADMIN` role. You can:
1. Create a user through registration
2. Update the user's role in the database to 'ADMIN'
3. Or use the admin migration script if available

### Example API Calls

**Get Dashboard Stats:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Users:**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&pageSize=10&role=CUSTOMER" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Order Status:**
```bash
curl -X PUT http://localhost:5000/api/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

## Notes

1. All admin endpoints are protected by `AuthMiddleware` and `RoleMiddleware("ADMIN")`
2. Pagination is implemented for list endpoints (users, orders, blogs)
3. Search and filter functionality is available for most list endpoints
4. All responses follow a consistent format with `success`, `data`, and `message` fields
5. Error handling is consistent across all endpoints

