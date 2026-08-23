const express = require("express");
const cors = require("cors");

const db = require("./db");

const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");

const app = express();

app.use(cors());
app.use(express.json());


// Patient API
app.use("/patients", patientRoutes);


// Doctor API
app.use("/doctors", doctorRoutes);


// Home
app.get("/", (req, res) => {
    res.send("Hospital Queue Management Backend is running!");
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
