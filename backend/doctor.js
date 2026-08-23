const express = require("express");
const router = express.Router();

const db = require("../db");

// ========================================
// ADD A NEW DOCTOR
// POST /doctors
// ========================================

router.post("/", (req, res) => {

    const {
        doctor_name,
        specialization,
        department
    } = req.body;

    // Check required information
    if (!doctor_name) {
        return res.status(400).json({
            message: "Doctor name is required"
        });
    }

    const sql = `
        INSERT INTO doctors
        (doctor_name, specialization, department)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [doctor_name, specialization, department],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add doctor"
                });
            }

            res.status(201).json({
                message: "Doctor added successfully",
                doctor_id: result.insertId
            });
        }
    );
});


// ========================================
// GET ALL DOCTORS
// GET /doctors
// ========================================

router.get("/", (req, res) => {

    const sql = "SELECT * FROM doctors";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get doctors"
            });
        }

        res.json(results);
    });
});


// ========================================
// GET ONE DOCTOR
// GET /doctors/:id
// ========================================

router.get("/:id", (req, res) => {

    const doctorId = req.params.id;

    const sql = `
        SELECT *
        FROM doctors
        WHERE doctor_id = ?
    `;

    db.query(sql, [doctorId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get doctor"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json(results[0]);
    });
});


// ========================================
// UPDATE DOCTOR
// PUT /doctors/:id
// ========================================

router.put("/:id", (req, res) => {

    const doctorId = req.params.id;

    const {
        doctor_name,
        specialization,
        department
    } = req.body;

    const sql = `
        UPDATE doctors
        SET
            doctor_name = ?,
            specialization = ?,
            department = ?
        WHERE doctor_id = ?
    `;

    db.query(
        sql,
        [
            doctor_name,
            specialization,
            department,
            doctorId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update doctor"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            res.json({
                message: "Doctor updated successfully"
            });
        }
    );
});


// ========================================
// DELETE DOCTOR
// DELETE /doctors/:id
// ========================================

router.delete("/:id", (req, res) => {

    const doctorId = req.params.id;

    const sql = `
        DELETE FROM doctors
        WHERE doctor_id = ?
    `;

    db.query(sql, [doctorId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete doctor"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            message: "Doctor deleted successfully"
        });
    });
});


module.exports = router;
