const express = require("express");
const cors = require("cors");

const db = require("./db");
const patientRoutes = require("./routes/patients");

const app = express();

app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.send("Hospital Queue Management Backend is running!");
});


// Test MySQL
app.get("/test-db", (req, res) => {

    db.query("SELECT 1", (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.json({
            message: "MySQL database connected successfully!"
        });
    });

});


// Patient API
app.use("/patients", patientRoutes);


// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
