require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(function () {
        console.log("MongoDB connected successfully!");
    })
    .catch(function (error) {
        console.error("MongoDB connection failed:", error.message);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", function (req, res) {
    res.send("Arena Adventures Sports Backend is running!");
});

// Booking API
app.post("/api/bookings", function (req, res) {

    const booking = req.body;

    console.log("New booking received:");
    console.log(booking);

    res.status(201).json({
        success: true,
        message: "Booking received successfully!",
        booking: booking
    });

});

app.listen(PORT, function () {
    console.log(
        `Arena Adventures Sports Backend running on http://localhost:${PORT}`
    );
});