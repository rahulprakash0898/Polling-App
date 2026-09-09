const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }
    try {
        if (!process.env.MONGO_URI) {
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = db.connections[0].readyState === 1;
    } catch (err) {
        // Connection error handled gracefully
    }
};

module.exports = connectDB;