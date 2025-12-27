# Admin Panel Documentation

## Overview
This admin panel provides comprehensive management features for users, products, orders, and blogs. It includes a dashboard with statistics and full CRUD operations for all entities.

## API Endpoints

### Dashboard
- **GET** `/api/admin/dashboard` - Get dashboard statistics
  - Returns: Users count, Products count, Orders count, Revenue, Recent orders, Recent users
  - Access: ADMIN only

### User Management
- **GET** `/api/admin/users` - Get all users with pagination
  - Query params: `page`, `pageSize`, `role`, `search`
  - Access: ADMIN only

- **GET** `/api/admin/users/:id` - Get user by ID
  - Access: ADMIN only

- **PUT** `/api/admin/users/:id` - Update user
  - Body: `{ name?, email?, role?, password? }`
  - Access: ADMIN only

- **DELETE** `/api/admin/users/:id` - Delete user
  - Access: ADMIN only

### Order Management
- **GET** `/api/admin/orders` - Get all orders with pagination
  - Query params: `page`, `pageSize`, `status`, `user_id`
  - Access: ADMIN only

- **PUT** `/api/admin/orders/:id/status` - Update order status
  - Body: `{ status: "pending" | "paid" | "shipped" }`
  - Access: ADMIN only

### Blog Management
- **GET** `/api/admin/blogs` - Get all blogs with pagination
  - Query params: `page`, `pageSize`, `category`, `search`
  - Access: ADMIN only

## Database Setup

### MySQL Migration
Run the migration script to add necessary columns and indexes:

```sql
-- Run database/admin-migration.sql
```

This will:
- Add `created_at` column to `user` table
- Add indexes on `user.email`, `user.role`
- Add indexes on `product.created_at`, `product.category`

### MongoDB Indexes
For better performance, create indexes on MongoDB collections:

```javascript
// In MongoDB shell or via Mongoose
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "user_id": 1 })
db.orders.createIndex({ "createdAt": -1 })
db.blogs.createIndex({ "category": 1 })
db.blogs.createIndex({ "createdAt": -1 })
```

## Frontend Admin Panel

### Routes
- `/admin` - Dashboard
- `/admin/users` - User Management
- `/admin/orders` - Order Management

### Features
1. **Dashboard**
   - Real-time statistics
   - Recent orders and users
   - Revenue overview

2. **User Management**
   - View all users with pagination
   - Search by name or email
   - Filter by role (ADMIN/CUSTOMER)
   - Edit user details
   - Change user password
   - Delete users

3. **Order Management**
   - View all orders with pagination
   - Filter by status (pending/paid/shipped)
   - Update order status
   - View order details

## Authentication
All admin endpoints require:
1. Valid JWT token in `Authorization` header: `Bearer <token>`
2. User role must be `ADMIN`

## Usage Example

### Get Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Users
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&pageSize=10&role=ADMIN" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

## Notes
- All timestamps are in UTC
- Pagination defaults: page=1, pageSize=10
- Search is case-insensitive
- Password updates are optional (leave blank to keep current password)

