# Dashboard Analytics Setup Guide

## Overview
The admin dashboard now displays real-time analytics with dynamic charts showing revenue trends and user growth based on actual database data.

## Features
- **Monthly Revenue Chart**: Shows revenue for the last 12 months
- **Weekly User Growth Chart**: Shows new user registrations for the last 7 days
- **Recent Orders**: Displays the 5 most recent orders
- **Live Statistics**: Real-time counts for users, products, orders, and revenue

## Backend Updates

### API Endpoint
**Endpoint**: `GET /api/admin/dashboard`

**Response Structure**:
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
      "total": 50000,
      "byMonth": [
        { "month": "Jan", "revenue": 4200 },
        { "month": "Feb", "revenue": 3800 },
        ...
      ]
    },
    "userGrowth": [
      { "day": "Mon", "users": 5 },
      { "day": "Tue", "users": 8 },
      ...
    ],
    "blogs": {
      "total": 25
    },
    "recentOrders": [...],
    "recentUsers": [...]
  },
  "message": "Dashboard statistics fetched successfully"
}
```

## Database Setup

### Step 1: Run MySQL Migration
You need to add the `created_at` column to the `user` table for user growth analytics.

**Option A: Run the simple migration (recommended)**
```bash
mysql -u your_username -p your_database < database/admin-migration-simple.sql
```

**Option B: Run the dynamic migration**
```bash
mysql -u your_username -p your_database < database/admin-migration.sql
```

**Manual Alternative**:
If migrations fail, run these SQL commands manually:
```sql
-- Add created_at column
ALTER TABLE `user` ADD COLUMN `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing users
UPDATE `user` SET `created_at` = NOW() WHERE `created_at` IS NULL;

-- Add indexes for performance
CREATE INDEX `idx_user_created_at` ON `user` (`created_at`);
CREATE INDEX `idx_user_email` ON `user` (`email`);
CREATE INDEX `idx_user_role` ON `user` (`role`);
```

### Step 2: Add MongoDB Indexes (Optional but Recommended)
These indexes improve query performance for orders and blogs:

```javascript
// Run in MongoDB shell or MongoDB Compass
use your_database_name

// Orders indexes
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "user_id": 1 })
db.orders.createIndex({ "createdAt": -1 })

// Blogs indexes
db.blogs.createIndex({ "category": 1 })
db.blogs.createIndex({ "createdAt": -1 })
```

## Frontend Updates

The dashboard component automatically fetches and displays the data. No additional setup is required on the frontend.

### Chart Features

**Revenue Chart**:
- Shows monthly revenue for the last 12 months
- Bar chart with interactive tooltips
- Automatically updates when data changes

**User Growth Chart**:
- Shows daily new user registrations for the last 7 days
- Line chart with smooth curves
- Real-time data from the database

## Testing

### 1. Verify Database Schema
```sql
-- Check if created_at column exists
DESCRIBE user;

-- Check if there are users with created_at timestamps
SELECT id, name, created_at FROM user LIMIT 5;
```

### 2. Test API Endpoint
```bash
# Replace YOUR_TOKEN with your admin JWT token
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Verify Frontend
1. Login as an admin user
2. Navigate to `http://localhost:4500/admin`
3. You should see:
   - Live statistics at the top
   - Revenue chart with monthly data
   - User growth chart with daily data
   - Recent orders table

## Troubleshooting

### Issue: Charts showing no data
**Solution**: 
- Ensure you have orders in MongoDB
- Ensure users have `created_at` timestamps
- Check browser console for API errors

### Issue: "Column 'created_at' doesn't exist" error
**Solution**: 
- Run the migration script
- Or manually add the column using the SQL commands above

### Issue: Old data showing in charts
**Solution**:
- Clear browser cache
- Refresh the page (Ctrl+F5)
- Check that the backend is using the updated code

### Issue: Migration fails with "Duplicate column" error
**Solution**: 
- The column already exists, you can skip this step
- Run only the UPDATE and INDEX creation queries

### Issue: User growth chart shows all zeros
**Solution**:
- Existing users don't have `created_at` timestamps
- The UPDATE query sets them to NOW()
- Create new test users to see actual growth data

## Performance Considerations

### Caching (Optional)
For high-traffic sites, consider caching dashboard data:

```javascript
// Example Redis caching
const cachedStats = await redis.get('dashboard:stats');
if (cachedStats) {
  return JSON.parse(cachedStats);
}

const stats = await getDashboardStats();
await redis.setex('dashboard:stats', 300, JSON.stringify(stats)); // Cache for 5 minutes
return stats;
```

### Query Optimization
- All necessary indexes are created by the migration
- MongoDB aggregation queries are optimized for large datasets
- Consider pagination for recent orders if you have many orders

## Future Enhancements

Potential improvements:
1. Add date range filters for charts
2. Export data as CSV/PDF
3. Real-time updates using WebSockets
4. More detailed analytics (conversion rates, top products, etc.)
5. Customizable dashboard widgets

## Files Modified

### Backend
- `services/AdminService.js` - Added monthly revenue and user growth queries
- `database/admin-migration.sql` - MySQL migration script
- `database/admin-migration-simple.sql` - Simplified migration

### Frontend
- `src/app/services/admin.service.ts` - Updated DashboardStats interface
- `src/app/admin/dashboard/dashboard.ts` - Updated chart rendering logic

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Node.js server logs
3. Verify database connection and schema
4. Ensure you're logged in as an ADMIN user

