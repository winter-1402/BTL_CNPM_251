// ============================================
// routes/tutors.js - Tutor Management Routes
// ============================================
const express = require("express");
const router = express.Router();
const { mssqlDb } = require("../config/database");

// GET /api/tutors - Lấy danh sách giảng viên
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, 
        u.username as name, 
        u.email, 
        t.rating, 
        (SELECT COUNT(*) FROM buoi_hoc b WHERE b.tutorId = t.id AND b.cancelled_at IS NULL) as totalSessions,
        (SELECT COUNT(DISTINCT studentId) FROM buoi_hoc b WHERE b.tutorId = t.id AND b.cancelled_at IS NULL) as totalStudents
      FROM tutors t
      JOIN users u ON t.users_id = u.id
    `;

    const result = await mssqlDb.query(query);

    // Lấy lịch rảnh (availability)
    const tutorsWithDetails = await Promise.all(
      result.map(async (tutor) => {
        const availQuery = `SELECT startTime, endTime FROM available WHERE tutorId = ${tutor.id}`;
        const availResult = await mssqlDb.query(availQuery);

        const availabilityList = availResult.map((slot) => {
          return `${slot.startTime} - ${slot.endTime}`;
        });

        return {
          ...tutor,
          faculty: "Khoa học Máy tính",
          expertise: ["Cấu Trúc Dữ Liệu", "Thuật Toán", "Cơ Sở Dữ Liệu"],
          bio: "Giảng viên nhiệt tình, giàu kinh nghiệm giảng dạy thực tế.",
          availability: availabilityList,
        };
      })
    );

    res.json(tutorsWithDetails);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tutors/search - Tìm kiếm
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const sqlQuery = `
      SELECT 
        t.id, 
        u.username as name, 
        u.email, 
        t.rating,
        (SELECT COUNT(*) FROM buoi_hoc b WHERE b.tutorId = t.id AND b.cancelled_at IS NULL) as totalSessions
      FROM tutors t
      JOIN users u ON t.users_id = u.id
      WHERE u.username LIKE N'%${query}%'
    `;

    const result = await mssqlDb.query(sqlQuery);

    const mapped = result.map((t) => ({
      ...t,
      faculty: "Khoa học Máy tính",
      expertise: [],
      availability: [],
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error searching tutors:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tutors/:id - Chi tiết Tutor
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm theo ID (Tutor hoặc User) và tính toán số liệu luôn
    let query = `
      SELECT 
        t.id, 
        u.username as name, 
        u.email, 
        t.rating, 
        (SELECT COUNT(*) FROM buoi_hoc b WHERE b.tutorId = t.id AND b.cancelled_at IS NULL) as totalSessions
      FROM tutors t
      JOIN users u ON t.users_id = u.id
      WHERE t.id = ${id}
    `;

    let result = await mssqlDb.query(query);

    // Fallback: Nếu không tìm thấy theo TutorID, tìm theo UserID
    if (result.length === 0) {
      query = `
          SELECT 
            t.id, 
            u.username as name, 
            u.email, 
            t.rating, 
            (SELECT COUNT(*) FROM buoi_hoc b WHERE b.tutorId = t.id AND b.cancelled_at IS NULL) as totalSessions
          FROM tutors t
          JOIN users u ON t.users_id = u.id
          WHERE t.users_id = ${id}
        `;
      result = await mssqlDb.query(query);
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const tutor = result[0];

    // Lấy lịch rảnh chi tiết
    const availResult = await mssqlDb.query(
      `SELECT availability_Id as id, startTime, endTime FROM available WHERE tutorId = ${tutor.id}`
    );

    const formattedAvailability = availResult.map((a) => {
      const parts = a.startTime ? a.startTime.split(" ") : [];
      const day = parts.length > 1 ? parts.slice(0, -1).join(" ") : "Ngày";
      const time = parts.length > 0 ? parts[parts.length - 1] : "00:00";

      return {
        id: a.id,
        day: day,
        startTime: time,
        endTime: a.endTime,
        isBooked: false,
      };
    });

    const fullProfile = {
      ...tutor,
      faculty: "Khoa học Máy tính",
      expertise: ["Machine Learning", "Data Science"],
      bio: "Tiến sĩ KHMT với 10 năm kinh nghiệm giảng dạy.",
      availability: availResult.map((a) => `${a.startTime} - ${a.endTime}`),
      availabilitySlots: formattedAvailability,
    };

    res.json(fullProfile);
  } catch (error) {
    console.error("Error fetching tutor details:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tutors/:id/availability/slots
router.post("/:id/availability/slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    let tutorId = id;
    // Resolve TutorID from UserID if needed
    const checkTutor = await mssqlDb.query(
      `SELECT id FROM tutors WHERE users_id = ${id}`
    );
    tutorId = checkTutor[0].id;
    if (checkTutor.length === 0) {
      const findTutor = await mssqlDb.query(
        `SELECT id FROM tutors WHERE users_id = ${id}`
      );
      if (findTutor.length > 0) {
        tutorId = findTutor[0].id;
      } else {
        // Auto-create profile if missing
        const createTutor = await mssqlDb.query(`
                INSERT INTO tutors (users_id, rating, tong_hoc_sinh, tong_buoi_thang_nay) 
                OUTPUT inserted.id 
                VALUES (${id}, 5.0, 0, 0)
            `);
        tutorId = createTutor[0].id;
      }
    }

    const startString = `${day} ${startTime}`;

    const query = `
      INSERT INTO available (tutorId, startTime, endTime)
      VALUES (${tutorId}, N'${startString}', '${endTime}')
    `;

    await mssqlDb.query(query);

    res.status(201).json({ message: "Slot added successfully" });
  } catch (error) {
    console.error("Error adding slot:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tutors/:id/availability/slots/:slotId
router.delete("/:id/availability/slots/:slotId", async (req, res) => {
  try {
    const { slotId } = req.params;
    const query = `DELETE FROM available WHERE availability_Id = ${slotId}`;
    await mssqlDb.query(query);
    res.json({ message: "Slot removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
});

module.exports = router;
