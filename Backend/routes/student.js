// Backend/routes/tutor.js
const express = require('express');
const router = express.Router();
const { mssqlDb } = require('../config/database'); // ✅ Correct: This is backend code

router.get('/all-information', async (req, res) => {
    try {
        // Run the query here
        const result = await mssqlDb.query("SELECT * FROM students WHERE users_id = ?", [req.query.userid]);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
module.exports = router;

// Define the API endpoint
router.get('/all-sessions', async (req, res) => {
    try {
        // Run the query here
        const sub = await mssqlDb.query("SELECT * FROM students WHERE users_id = ?", [req.query.userid]);
        const result = await mssqlDb.query(
            "SELECT buoi_hoc.id as session_id, username as tutor_name , thoi_gian, thoi_luong , kieu,dia_diem , duong_link, topic , notes ,cancelled_at ,cancelled_by, cancellation_reason FROM buoi_hoc JOIN tutors on tutorId = tutors.id JOIN users on tutors.users_Id = users.id WHERE studentId = ? ORDER BY thoi_gian ASC", [sub[0].id]);
        // Send JSON data back to the frontend
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
module.exports = router;