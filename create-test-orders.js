/**
 * Script to Create Test Orders
 * This will populate your database with sample orders so the dashboard has data to display
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Order Schema (matching your actual schema)
const orderSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    products: [{
        product_id: Number,
        product_name: String,
        quantity: Number,
        price: Number
    }],
    orderTotal: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'shipped'],
        default: 'pending'
    },
    paymentMethod: String,
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
}, { 
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

// Sample test orders
const testOrders = [
    {
        user_id: 1,
        products: [
            {
                product_id: 1,
                product_name: 'iPhone 15 Pro',
                quantity: 1,
                price: 999.99
            }
        ],
        orderTotal: 999.99,
        status: 'paid',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        }
    },
    {
        user_id: 1,
        products: [
            {
                product_id: 2,
                product_name: 'MacBook Pro 16"',
                quantity: 1,
                price: 2499.99
            },
            {
                product_id: 3,
                product_name: 'AirPods Pro',
                quantity: 2,
                price: 249.99
            }
        ],
        orderTotal: 2999.97,
        status: 'shipped',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'USA'
        }
    },
    {
        user_id: 2,
        products: [
            {
                product_id: 4,
                product_name: 'Samsung Galaxy S24',
                quantity: 1,
                price: 799.99
            }
        ],
        orderTotal: 799.99,
        status: 'pending',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '789 Elm St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA'
        }
    },
    {
        user_id: 3,
        products: [
            {
                product_id: 5,
                product_name: 'Sony WH-1000XM5',
                quantity: 1,
                price: 399.99
            },
            {
                product_id: 6,
                product_name: 'iPad Air',
                quantity: 1,
                price: 599.99
            }
        ],
        orderTotal: 999.98,
        status: 'paid',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '321 Pine Rd',
            city: 'Houston',
            state: 'TX',
            zipCode: '77001',
            country: 'USA'
        }
    },
    {
        user_id: 2,
        products: [
            {
                product_id: 7,
                product_name: 'Dell XPS 13',
                quantity: 1,
                price: 1299.99
            }
        ],
        orderTotal: 1299.99,
        status: 'paid',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '555 Maple Dr',
            city: 'Phoenix',
            state: 'AZ',
            zipCode: '85001',
            country: 'USA'
        }
    },
    {
        user_id: 4,
        products: [
            {
                product_id: 8,
                product_name: 'Nintendo Switch',
                quantity: 2,
                price: 299.99
            }
        ],
        orderTotal: 599.98,
        status: 'shipped',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '888 Cedar Ln',
            city: 'Philadelphia',
            state: 'PA',
            zipCode: '19019',
            country: 'USA'
        }
    },
    {
        user_id: 5,
        products: [
            {
                product_id: 9,
                product_name: 'Canon EOS R5',
                quantity: 1,
                price: 3899.99
            }
        ],
        orderTotal: 3899.99,
        status: 'pending',
        paymentMethod: 'razorpay',
        shippingAddress: {
            street: '999 Birch Ave',
            city: 'San Antonio',
            state: 'TX',
            zipCode: '78201',
            country: 'USA'
        }
    }
];

async function createTestOrders() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('URI:', MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check if orders already exist
        const existingCount = await Order.countDocuments();
        console.log(`📊 Current orders in database: ${existingCount}\n`);

        if (existingCount >= 5) {
            console.log('⚠️  You already have orders in the database!');
            console.log('   To see them in dashboard, refresh the page.\n');
            
            const recent = await Order.find().sort({ createdAt: -1 }).limit(5);
            console.log('📋 Your 5 most recent orders:');
            recent.forEach((order, idx) => {
                console.log(`   ${idx + 1}. Order #${order._id.toString().substring(0, 8)} - $${order.orderTotal} - ${order.status}`);
            });
            console.log('');
        }

        console.log('➕ Creating test orders...\n');

        // Create orders with slight time delays so they have different timestamps
        for (let i = 0; i < testOrders.length; i++) {
            const order = new Order(testOrders[i]);
            
            // Set createdAt to different times (most recent first)
            const hoursAgo = i * 2;
            order.createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
            order.updatedAt = order.createdAt;
            
            await order.save();
            console.log(`✅ Created order #${order._id.toString().substring(0, 8)} - $${order.orderTotal} - ${order.status} (${hoursAgo}h ago)`);
        }

        console.log('\n🎉 Successfully created ' + testOrders.length + ' test orders!');
        
        // Show summary
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$orderTotal' } } }
        ]);
        
        console.log('\n📊 DATABASE SUMMARY:');
        console.log(`   Total Orders: ${totalOrders}`);
        console.log(`   Total Revenue: $${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`);
        console.log(`   Pending: ${await Order.countDocuments({ status: 'pending' })}`);
        console.log(`   Paid: ${await Order.countDocuments({ status: 'paid' })}`);
        console.log(`   Shipped: ${await Order.countDocuments({ status: 'shipped' })}`);

        console.log('\n✨ NEXT STEPS:');
        console.log('   1. Refresh your dashboard at http://localhost:4500/admin');
        console.log('   2. You should now see orders in the Recent Orders table');
        console.log('   3. Revenue chart will show data if orders span multiple months');
        console.log('');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('   1. Check if MongoDB is running: mongosh');
        console.error('   2. Verify MONGO_URI in .env file');
        console.error('   3. Make sure database name is correct');
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the script
createTestOrders();

