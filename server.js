require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Debug: Print environment variables
console.log('MongoDB URI:', process.env.MONGO_URI);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Routes
app.use("/", userRoutes);

// Connect to MongoDB Atlas with detailed error logging
console.log("Attempting to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error Details:");
    console.error("Error Message:", err.message);
    console.error("Error Code:", err.code);
    console.error("Error Name:", err.name);
    if (err.reason) {
        console.error("Error Reason:", err.reason);
    }
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error in middleware:", err);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
