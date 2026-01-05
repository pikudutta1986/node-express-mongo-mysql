// IMPORT MYSQL DB CONNECTION POOL
import {connectToMySql} from "../database/mysqldb.js";
// IMPORT MONGO MODELS
import Order from "../mongo_models/order.js";
import Blog from "../mongo_models/blog.js";
// IMPORT MONGOOSE
import mongoose from "mongoose";
// IMPORT BCRYPT FOR PASSWORD HASHING
import bcrypt from "bcryptjs";

// ADMIN SERVICE TO HANDLE ADMIN-RELATED OPERATIONS
export class AdminService {
    constructor() {
        // MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
    }

    // ================================================
    // FUNCTION TO GET DASHBOARD STATISTICS
    // ================================================
    async getDashboardStats() {
        try {
            const pool = await this.mysqlConnectionPool;
            
            // GET TOTAL USERS COUNT
            const [userCount] = await pool.execute("SELECT COUNT(*) as total FROM user");
            const totalUsers = userCount[0].total;

            // GET ADMIN USERS COUNT
            const [adminCount] = await pool.execute("SELECT COUNT(*) as total FROM user WHERE role = 'ADMIN'");
            const totalAdmins = adminCount[0].total;

            // GET CUSTOMER USERS COUNT
            const [customerCount] = await pool.execute("SELECT COUNT(*) as total FROM user WHERE role = 'CUSTOMER'");
            const totalCustomers = customerCount[0].total;

            // GET TOTAL PRODUCTS COUNT
            const [productCount] = await pool.execute("SELECT COUNT(*) as total FROM product");
            const totalProducts = productCount[0].total;

            // GET TOTAL ORDERS COUNT FROM MONGO
            const totalOrders = await Order.countDocuments();

            // GET ORDERS BY STATUS
            const pendingOrders = await Order.countDocuments({ status: "pending" });
            const paidOrders = await Order.countDocuments({ status: "paid" });
            const shippedOrders = await Order.countDocuments({ status: "shipped" });

            // GET TOTAL REVENUE (sum of all order totals)
            const revenueResult = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$orderTotal" }
                    }
                }
            ]);
            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            // GET TOTAL BLOGS COUNT
            const totalBlogs = await Blog.countDocuments();

            // GET RECENT ORDERS (last 5)
            const recentOrders = await Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            // GET RECENT USERS (last 5)
            // Use id for sorting since created_at doesn't exist in user table
            const [recentUsers] = await pool.execute(
                "SELECT id, name, email, role FROM user ORDER BY id DESC LIMIT 5"
            );

            return {
                success: true,
                data: {
                    users: {
                        total: totalUsers,
                        admins: totalAdmins,
                        customers: totalCustomers
                    },
                    products: {
                        total: totalProducts
                    },
                    orders: {
                        total: totalOrders,
                        pending: pendingOrders,
                        paid: paidOrders,
                        shipped: shippedOrders
                    },
                    revenue: {
                        total: totalRevenue
                    },
                    blogs: {
                        total: totalBlogs
                    },
                    recentOrders: recentOrders,
                    recentUsers: recentUsers
                },
                message: "Dashboard statistics fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw new Error("Failed to fetch dashboard statistics: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ALL USERS WITH PAGINATION
    // ================================================
    async getAllUsers(filterOptions) {
        try {
            const pool = await this.mysqlConnectionPool;
            const page = filterOptions?.page || 1;
            const pageSize = parseInt(filterOptions?.pageSize || 10, 10);
            const offset = parseInt((page - 1) * pageSize, 10);

            // SELECT fields (removed created_at as it doesn't exist in the user table)
            let sqlString = "SELECT id, name, email, role FROM user WHERE 1=1";
            const values = [];

            // FILTER BY ROLE
            if (filterOptions?.role && filterOptions.role !== '') {
                sqlString += " AND role = ?";
                values.push(filterOptions.role);
            }

            // SEARCH BY NAME OR EMAIL
            if (filterOptions?.search && filterOptions.search !== '') {
                sqlString += " AND (name LIKE ? OR email LIKE ?)";
                const searchTerm = `%${filterOptions.search}%`;
                values.push(searchTerm, searchTerm);
            }

            // GET TOTAL COUNT
            let countSql = sqlString.replace("SELECT id, name, email, role FROM user", "SELECT COUNT(*) as total FROM user");
            const [countResult] = await pool.execute(countSql, values);
            const total = countResult[0].total;

            // ADD SORTING AND PAGINATION
            // Use id for sorting since created_at doesn't exist in user table
            sqlString += ` ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;

            // EXECUTE QUERY
            const [users] = await pool.execute(sqlString, values);

            return {
                success: true,
                data: users,
                pagination: {
                    page: page,
                    pageSize: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize)
                },
                message: "Users fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET USER BY ID
    // ================================================
    async getUserById(userId) {
        try {
            const pool = await this.mysqlConnectionPool;
            // Removed created_at as it doesn't exist in the user table
            const sqlString = "SELECT id, name, email, role FROM user WHERE id = ?";
            const [rows] = await pool.execute(sqlString, [userId]);

            if (rows.length === 0) {
                throw new Error("User not found");
            }

            return {
                success: true,
                data: rows[0],
                message: "User fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error("Failed to fetch user: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE USER
    // ================================================
    async updateUser(userId, updateData) {
        try {
            const pool = await this.mysqlConnectionPool;
            const fields = [];
            const values = [];

            // ALLOWED FIELDS TO UPDATE
            if (updateData.name !== undefined) {
                fields.push("name = ?");
                values.push(updateData.name);
            }
            if (updateData.email !== undefined) {
                fields.push("email = ?");
                values.push(updateData.email);
            }
            if (updateData.role !== undefined) {
                fields.push("role = ?");
                values.push(updateData.role);
            }
            if (updateData.password !== undefined && updateData.password !== '') {
                const hashedPassword = await bcrypt.hash(updateData.password, 10);
                fields.push("password = ?");
                values.push(hashedPassword);
            }

            if (fields.length === 0) {
                throw new Error("No fields provided to update");
            }

            values.push(userId);
            const sqlString = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
            const [result] = await pool.execute(sqlString, values);

            if (result.affectedRows === 0) {
                throw new Error("User not found");
            }

            // GET UPDATED USER
            const updatedUser = await this.getUserById(userId);

            return {
                success: true,
                data: updatedUser.data,
                message: "User updated successfully"
            };
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO DELETE USER
    // ================================================
    async deleteUser(userId) {
        try {
            const pool = await this.mysqlConnectionPool;
            
            // CHECK IF USER EXISTS
            const [user] = await pool.execute("SELECT id FROM user WHERE id = ?", [userId]);
            if (user.length === 0) {
                throw new Error("User not found");
            }

            // DELETE USER
            const sqlString = "DELETE FROM user WHERE id = ?";
            const [result] = await pool.execute(sqlString, [userId]);

            if (result.affectedRows === 0) {
                throw new Error("Failed to delete user");
            }

            return {
                success: true,
                message: "User deleted successfully"
            };
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ALL ORDERS WITH PAGINATION
    // ================================================
    async getAllOrders(filterOptions) {
        try {
            const page = filterOptions?.page || 1;
            const pageSize = filterOptions?.pageSize || 10;
            const skip = (page - 1) * pageSize;

            // BUILD FILTER OBJECT
            const filter = {};
            if (filterOptions?.status && filterOptions.status !== '') {
                filter.status = filterOptions.status;
            }
            if (filterOptions?.user_id) {
                filter.user_id = parseInt(filterOptions.user_id);
            }

            // GET TOTAL COUNT
            const total = await Order.countDocuments(filter);

            // GET ORDERS WITH PAGINATION
            const orders = await Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .lean();

            return {
                success: true,
                data: orders,
                pagination: {
                    page: page,
                    pageSize: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize)
                },
                message: "Orders fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw new Error("Failed to fetch orders: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE ORDER STATUS
    // ================================================
    async updateOrderStatus(orderId, status) {
        try {
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw new Error("Not a valid order id");
            }

            const validStatuses = ["pending", "paid", "shipped"];
            if (!validStatuses.includes(status)) {
                throw new Error("Invalid status. Must be one of: " + validStatuses.join(", "));
            }

            const order = await Order.findByIdAndUpdate(
                orderId,
                { $set: { status: status } },
                { new: true }
            );

            if (!order) {
                throw new Error("Order not found");
            }

            return {
                success: true,
                data: order,
                message: "Order status updated successfully"
            };
        } catch (error) {
            console.error("Error updating order status:", error);
            throw new Error("Failed to update order status: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ALL BLOGS WITH PAGINATION
    // ================================================
    async getAllBlogs(filterOptions) {
        try {
            const page = filterOptions?.page || 1;
            const pageSize = filterOptions?.pageSize || 10;
            const skip = (page - 1) * pageSize;

            // BUILD FILTER OBJECT
            const filter = {};
            if (filterOptions?.category && filterOptions.category !== '') {
                filter.category = filterOptions.category;
            }
            if (filterOptions?.search && filterOptions.search !== '') {
                filter.$or = [
                    { title: { $regex: filterOptions.search, $options: 'i' } },
                    { content: { $regex: filterOptions.search, $options: 'i' } }
                ];
            }

            // GET TOTAL COUNT
            const total = await Blog.countDocuments(filter);

            // GET BLOGS WITH PAGINATION
            const blogs = await Blog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .lean();

            return {
                success: true,
                data: blogs,
                pagination: {
                    page: page,
                    pageSize: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize)
                },
                message: "Blogs fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw new Error("Failed to fetch blogs: " + error.message);
        }
    }
}

