const express = require("express");
const router = express.Router();

const db = require("../db");

// Add a new patient
router.post("/", (req, res) => {

    const { patient_name, age, gender, phone } = req.body;

    const sql = `
        INSERT INTO patients
        (patient_name, age, gender, phone)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patient_name, age, gender, phone],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add patient"
                });
            }

            res.status(201).json({
                message: "Patient added successfully",
                patient_id: result.insertId
            });
        }
    );
});

module.exports = router;
