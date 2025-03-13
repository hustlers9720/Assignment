const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/couponRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS properly
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/", router);

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Export for testing
