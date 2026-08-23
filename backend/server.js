const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test backend
app.get("/", (req, res) => {
    res.send("Hospital Queue Management Backend is running!");
});

// Test MySQL connection
app.get("/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.json({
            message: "MySQL database connected successfully!"
        });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
