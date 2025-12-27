# Admin Panel Setup Instructions

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd node-express-mongo-mysql
   npm install
   ```

2. **Database Setup**
   
   **MySQL:**
   - Create a MySQL database (e.g., `demo_database`)
   - Import the existing schema: `mysql-database.sql`
   - Run the admin migration: `database/admin-migration.sql`
   ```bash
   mysql -u root -p demo_database < mysql-database.sql
   mysql -u root -p demo_database < database/admin-migration.sql
   ```

   **MongoDB:**
   - Ensure MongoDB is running
   - The collections will be created automatically when first used
   - Optionally create indexes for better performance (see ADMIN_PANEL_README.md)

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your-password
   MYSQL_DATABASE=demo_database
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## Frontend Setup (Angular)

1. **Install Dependencies**
   ```bash
   cd angular-demo
   npm install
   ```

2. **Configure API Proxy**
   The proxy configuration should already be set up in `proxy.conf.json` to point to `http://localhost:3000`

3. **Start Development Server**
   ```bash
   ng serve
   ```

4. **Access Admin Panel**
   - Navigate to `http://localhost:4200/admin`
   - Login with an admin account (role: ADMIN)

## Creating an Admin User

You can create an admin user via the registration API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

Then login to get your JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## Features Implemented

### Backend API Endpoints
✅ Dashboard statistics endpoint
✅ User management (CRUD)
✅ Order management (view, update status)
✅ Blog management (view with filters)

### Frontend Components
✅ Admin dashboard with real-time stats
✅ User management interface
✅ Order management interface
✅ Responsive admin layout with sidebar

### Security
✅ JWT authentication
✅ Role-based access control (ADMIN only)
✅ Password hashing with bcrypt

## Testing the Admin Panel

1. **Login as Admin**
   - Go to `/login`
   - Use admin credentials
   - You'll be redirected to `/admin` dashboard

2. **Dashboard**
   - View statistics for users, products, orders, revenue
   - See recent orders and users

3. **User Management**
   - View all users with pagination
   - Search users by name or email
   - Filter by role
   - Edit user details
   - Change user passwords
   - Delete users

4. **Order Management**
   - View all orders
   - Filter by status
   - Update order status (pending → paid → shipped)

## Troubleshooting

### Backend Issues
- **Port already in use**: Change PORT in `.env`
- **Database connection errors**: Check MySQL and MongoDB are running
- **JWT errors**: Ensure JWT_SECRET is set in `.env`

### Frontend Issues
- **CORS errors**: Ensure proxy is configured correctly
- **401 Unauthorized**: Check JWT token is valid and user role is ADMIN
- **404 Not Found**: Ensure routes are properly configured

## Next Steps

You can extend the admin panel by:
- Adding product management UI
- Adding blog management UI
- Adding analytics and reporting
- Adding user activity logs
- Adding email notifications

