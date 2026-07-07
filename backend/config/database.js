const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to fix Atlas SRV connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async function() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB Connected Successfully");
        return connection;
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Stop the server if DB connection fails
    }
};

module.exports = connectDB;
