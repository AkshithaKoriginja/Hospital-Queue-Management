const express = require("express");
const router = express.Router();

const db = require("../db");


// ========================================
// ADD PATIENT TO QUEUE
// POST /queue
// ========================================

router.post("/", (req, res) => {

    const {
        patient_id,
        doctor_id,
        token_number,
        appointment_time
    } = req.body;

    // Check required information
    if (!patient_id || !doctor_id || !token_number) {
        return res.status(400).json({
            message: "Patient ID, Doctor ID and Token Number are required"
        });
    }

    const sql = `
        INSERT INTO queues
        (
            patient_id,
            doctor_id,
            token_number,
            appointment_time,
            status,
            arrival_time
        )
        VALUES (?, ?, ?, ?, 'Waiting', NOW())
    `;

    db.query(
        sql,
        [
            patient_id,
            doctor_id,
            token_number,
            appointment_time
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add patient to queue"
                });
            }

            res.status(201).json({
                message: "Patient added to queue successfully",
                queue_id: result.insertId,
                token_number: token_number
            });
        }
    );
});


// ========================================
// GET CURRENT QUEUE
// GET /queue
// ========================================

router.get("/", (req, res) => {

    const sql = `
        SELECT
            q.queue_id,
            q.token_number,

            p.patient_id,
            p.patient_name,
            p.age,
            p.gender,

            d.doctor_id,
            d.doctor_name,
            d.specialization,
            d.department,

            q.appointment_time,
            q.status,
            q.arrival_time,
            q.start_time,
            q.end_time,
            q.waiting_time

        FROM queues q

        JOIN patients p
            ON q.patient_id = p.patient_id

        JOIN doctors d
            ON q.doctor_id = d.doctor_id

        ORDER BY q.queue_id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get queue"
            });
        }

        res.json(results);
    });
});


// ========================================
// GET ONE QUEUE ENTRY
// GET /queue/:id
// ========================================

router.get("/:id", (req, res) => {

    const queueId = req.params.id;

    const sql = `
        SELECT
            q.queue_id,
            q.token_number,

            p.patient_name,

            d.doctor_name,
            d.specialization,

            q.appointment_time,
            q.status,
            q.arrival_time,
            q.start_time,
            q.end_time,
            q.waiting_time

        FROM queues q

        JOIN patients p
            ON q.patient_id = p.patient_id

        JOIN doctors d
            ON q.doctor_id = d.doctor_id

        WHERE q.queue_id = ?
    `;

    db.query(sql, [queueId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get queue entry"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Queue entry not found"
            });
        }

        res.json(results[0]);
    });
});


// ========================================
// UPDATE QUEUE STATUS
// PUT /queue/:id/status
// ========================================

router.put("/:id/status", (req, res) => {

    const queueId = req.params.id;

    const { status } = req.body;

    const allowedStatuses = [
        "Waiting",
        "In Progress",
        "Served"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }


    // If patient starts consultation
    if (status === "In Progress") {

        const sql = `
            UPDATE queues
            SET
                status = ?,
                start_time = NOW(),

                waiting_time =
                    TIMESTAMPDIFF(
                        MINUTE,
                        arrival_time,
                        NOW()
                    )

            WHERE queue_id = ?
        `;

        db.query(
            sql,
            [status, queueId],
            (err, result) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to update queue status"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Queue entry not found"
                    });
                }

                res.json({
                    message: "Queue status updated",
                    status: status
                });
            }
        );

        return;
    }


    // If patient is served
    if (status === "Served") {

        const sql = `
            UPDATE queues
            SET
                status = ?,
                end_time = NOW()

            WHERE queue_id = ?
        `;

        db.query(
            sql,
            [status, queueId],
            (err, result) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to update queue status"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Queue entry not found"
                    });
                }

                res.json({
                    message: "Patient served successfully",
                    status: status
                });
            }
        );

        return;
    }


    // If status is Waiting
    const sql = `
        UPDATE queues
        SET status = ?
        WHERE queue_id = ?
    `;

    db.query(
        sql,
        [status, queueId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update queue status"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Queue entry not found"
                });
            }

            res.json({
                message: "Queue status updated",
                status: status
            });
        }
    );
});


// ========================================
// DELETE / REMOVE PATIENT FROM QUEUE
// DELETE /queue/:id
// ========================================

router.delete("/:id", (req, res) => {

    const queueId = req.params.id;

    const sql = `
        DELETE FROM queues
        WHERE queue_id = ?
    `;

    db.query(sql, [queueId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to remove patient from queue"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Queue entry not found"
            });
        }

        res.json({
            message: "Patient removed from queue successfully"
        });
    });
});


module.exports = router;
