const express = require("express");
const cors = require("cors");
const axios = require("axios");

const db = require("./db");

const patientRoutes =
    require("./routes/patients");

const doctorRoutes =
    require("./routes/doctors");

const queueRoutes =
    require("./routes/queues");

const userRoutes =
    require("./routes/users");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/patients", patientRoutes);

app.use("/doctors", doctorRoutes);

app.use("/queue", queueRoutes);

app.use("/users", userRoutes);


// ========================================
// AI WAITING TIME
// ========================================

app.get("/ai/waiting-time", async (req, res) => {

    try {

        const response = await axios.get(
            "http://127.0.0.1:5001/predict"
        );

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

            message:
                "Unable to connect to Python AI",

            error:
                error.message

        });

    }

});


app.get("/", (req, res) => {

    res.send(
        "Hospital Queue Management Backend is running!"
    );

});


const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
