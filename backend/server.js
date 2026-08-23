// ========================================
// HOSPITAL QUEUE MANAGEMENT SYSTEM
// MAIN SERVER FILE
// ========================================


// ========================================
// 1. IMPORT PACKAGES
// ========================================

const express = require("express");
const cors = require("cors");
const axios = require("axios");


// ========================================
// 2. IMPORT MYSQL CONNECTION
// ========================================

const db = require("./db");


// ========================================
// 3. IMPORT API ROUTES
// ========================================

const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const queueRoutes = require("./routes/queues");
const userRoutes = require("./routes/users");


// ========================================
// 4. CREATE EXPRESS APPLICATION
// ========================================

const app = express();


// ========================================
// 5. MIDDLEWARE
// ========================================

// Allow frontend to communicate with backend
app.use(cors());

// Allow server to receive JSON data
app.use(express.json());


// ========================================
// 6. HOME / TEST ROUTE
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Hospital Queue Management Backend is running!"
    });

});


// ========================================
// 7. PATIENT API
// ========================================

// Add / Get patients
// Examples:
// POST http://localhost:5000/patients
// GET  http://localhost:5000/patients

app.use("/patients", patientRoutes);


// ========================================
// 8. DOCTOR API
// ========================================

// Add / Get / Update / Delete doctors
// Examples:
// POST   /doctors
// GET    /doctors
// GET    /doctors/:id
// PUT    /doctors/:id
// DELETE /doctors/:id

app.use("/doctors", doctorRoutes);


// ========================================
// 9. QUEUE API
// ========================================

// Add / Get / Update / Delete queue entries
// Examples:
// POST   /queue
// GET    /queue
// GET    /queue/:id
// PUT    /queue/:id/status
// DELETE /queue/:id

app.use("/queue", queueRoutes);


// ========================================
// 10. USER / LOGIN API
// ========================================

// Examples:
// POST /users/register
// POST /users/login

app.use("/users", userRoutes);


// ========================================
// 11. PYTHON AI API
// ========================================

// Node.js sends request to Python
// Python reads actual queue data from MySQL
// Python returns predicted waiting time

// URL:
// GET http://localhost:5000/ai/waiting-time

app.get("/ai/waiting-time", async (req, res) => {

    try {

        // Call Python AI server
        const response = await axios.get(
            "http://127.0.0.1:5001/predict"
        );


        // Send Python's result to frontend
        res.json({

            message: "AI prediction received",

            prediction: response.data

        });

    } catch (error) {

        console.error(
            "Python AI connection failed:",
            error.message
        );


        res.status(500).json({

            message: "Unable to connect to Python AI",

            error: error.message

        });

    }

});


// ========================================
// 12. HANDLE UNKNOWN ROUTES
// ========================================

app.use((req, res) => {

    res.status(404).json({

        message: "API route not found"

    });

});


// ========================================
// 13. START SERVER
// ========================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log("----------------------------------------");

    console.log(
        "Hospital Queue Management Backend"
    );

    console.log("----------------------------------------");

    console.log(
        `Server running at http://localhost:${PORT}`
    );

    console.log(
        "Patient API: http://localhost:5000/patients"
    );

    console.log(
        "Doctor API: http://localhost:5000/doctors"
    );

    console.log(
        "Queue API: http://localhost:5000/queue"
    );

    console.log(
        "User API: http://localhost:5000/users"
    );

    console.log(
        "AI API: http://localhost:5000/ai/waiting-time"
    );

    console.log("----------------------------------------");

});
