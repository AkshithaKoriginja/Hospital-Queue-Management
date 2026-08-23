const express = require("express");
const cors = require("cors");

const db = require("./db");

const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const queueRoutes = require("./routes/queues");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());


// Patient API
app.use("/patients", patientRoutes);


// Doctor API
app.use("/doctors", doctorRoutes);


// Queue API
app.use("/queue", queueRoutes);


// User API
app.use("/users", userRoutes);


// Home
app.get("/", (req, res) => {
    res.send("Hospital Queue Management Backend is running!");
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
