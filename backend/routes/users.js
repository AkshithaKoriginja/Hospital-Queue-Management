const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const db = require("../db");


// ========================================
// REGISTER / CREATE USER
// POST /users/register
// ========================================

router.post("/register", async (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;

    // Check required fields
    if (!username || !password || !role) {
        return res.status(400).json({
            message: "Username, password and role are required"
        });
    }

    // Allowed roles
    const allowedRoles = [
        "Admin",
        "Staff",
        "Doctor"
    ];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role"
        });
    }

    try {

        // Check whether username already exists
        const checkSql = `
            SELECT user_id
            FROM users
            WHERE username = ?
        `;

        db.query(
            checkSql,
            [username],
            async (err, results) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        message: "Username already exists"
                    });
                }

                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // Insert user
                const insertSql = `
                    INSERT INTO users
                    (username, password, role)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        username,
                        hashedPassword,
                        role
                    ],
                    (err, result) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                message: "Failed to create user"
                            });
                        }

                        res.status(201).json({
                            message: "User created successfully",
                            user_id: result.insertId
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ========================================
// LOGIN USER
// POST /users/login
// ========================================

router.post("/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    // Check required fields
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
    `;

    db.query(
        sql,
        [username],
        async (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // User doesn't exist
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            const user = results[0];

            try {

                // Compare password
                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: "Invalid username or password"
                    });
                }

                // Login successful
                res.json({
                    message: "Login successful",

                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        role: user.role
                    }
                });

            } catch (error) {

                console.error(error);

                res.status(500).json({
                    message: "Login error"
                });
            }
        }
    );
});


module.exports = router;
