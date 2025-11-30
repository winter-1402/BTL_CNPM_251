// Backend/routes/tutor.js
const express = require('express');
const router = express.Router();
const { mssqlDb } = require('../config/database'); // ✅ Correct: This is backend code

// Define the API endpoint
router.get('/dashboard-stats', async (req, res) => {
    try {
        // Run the query here
        const result = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [req.query.userid]);  
        // Send JSON data back to the frontend
        res.json(result); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
router.get('/upcoming-sessions', async (req, res) => {
    try {
        // Run the query here
        const sub = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [req.query.userid]);
        const result = await mssqlDb.query(
            "SELECT username as student_name ,MSSV, thoi_gian, thoi_luong , kieu, topic , notes FROM buoi_hoc JOIN students on studentId = students.id JOIN users on students.users_Id = users.id WHERE tutorId = ? AND thoi_gian >= '2025-10-27 00:00:00' ORDER BY thoi_gian ASC", [sub[0].id]);
        // Send JSON data back to the frontend
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
router.get('/progress', async (req, res) => {
    try {
        // Run the query here
        const sub = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [req.query.userid]);
        const result = await mssqlDb.query(
            "SELECT username as student_name ,topic ,MSSV, tien_do FROM buoi_hoc JOIN students on studentId = students.id JOIN users on students.users_Id = users.id WHERE tutorId = ? AND thoi_gian >= '2025-10-27 00:00:00' ORDER BY thoi_gian ASC", [sub[0].id]);
        // Send JSON data back to the frontend
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
router.get('/pending-requests', async (req, res) => {
    try {
        // Run the query here
        const sub = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [req.query.userid]);
        const result = await mssqlDb.query(
            "SELECT username as student_name ,MSSV, booked_types, topic ,startTime,endTime FROM booked JOIN students on student_id = students.id JOIN available on booked.availability_Id = available.availability_Id JOIN users on students.users_id=  users.id WHERE tutorId = ? ORDER BY booked.id ASC", [sub[0].id]);
        // Send JSON data back to the frontend
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
router.get('/all-sessions', async (req, res) => {
    try {
        // Run the query here
        const sub = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [req.query.userid]);
        const result = await mssqlDb.query(
            "SELECT buoi_hoc.id as session_id, username as student_name ,MSSV, thoi_gian, thoi_luong , kieu,dia_diem , duong_link, topic , notes ,cancelled_at ,cancelled_by, cancellation_reason FROM buoi_hoc JOIN students on studentId = students.id JOIN users on students.users_Id = users.id WHERE tutorId = ? ORDER BY thoi_gian ASC", [sub[0].id]);
        // Send JSON data back to the frontend
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});
router.post('/add', async (req, res) => {
    try {
        sql = require('mssql');
        const {
            id, MSSV,userid ,thoi_gian, thoi_luong , kieu, topic , dia_diem , duong_link 
        } = req.body;
        // Thực hiện Insert
        // Lưu ý: Thay tên cột (title, author...) cho đúng với Database của bạn
        const tutor_id = await mssqlDb.query("SELECT * FROM tutors WHERE users_id = ?", [userid]);
        const studentId = await mssqlDb.query("SELECT * FROM students WHERE MSSV = ?", [MSSV]);
        console.log(tutor_id,studentId);
        await mssqlDb
            .query(`
                INSERT INTO buoi_hoc (buoi_hoc_Id, tutorId, studentId, thoi_gian, thoi_luong , kieu, topic , dia_diem , duong_link , notes,tien_do) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, N'Buổi học đầu tiên', 0)
            `,[id, tutor_id[0].id, studentId[0].id, thoi_gian, thoi_luong, kieu, topic, dia_diem, duong_link]);

        res.json({ success: true, message: "Thêm tài liệu thành công!" });

    } catch (error) {
        console.error("Lỗi Insert:", error);
        res.status(500).json({ error: 'Không thể thêm dữ liệu' });
    }
});
module.exports = router;