require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Routes
app.use("/", userRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas");
        // Start server only after successful database connection
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});
