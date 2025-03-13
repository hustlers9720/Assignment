const mongoose = require("mongoose");

let isConnected = false; // Track connection state

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        if (mongoose.connection.readyState === 2) {
            console.log("MongoDB connection is in progress...");
            return;
        }

        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
