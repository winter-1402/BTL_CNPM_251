// ============================================
// routes/reports.js - Complete Report Routes
// ============================================

const reportRouter = express.Router();
const { ReportService } = require("../services/ReportService");

// Generate usage report (Admin only)
reportRouter.post(
  "/usage",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "Start date and end date required" });
      }

      const report = await ReportService.generateUsageReport(
        new Date(startDate),
        new Date(endDate)
      );

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Generate tutor performance report
reportRouter.post("/tutor/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const report = await ReportService.generateTutorPerformance(
      parseInt(tutorId)
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate student progress report
reportRouter.post("/student/:studentId", authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;

    const report = await ReportService.generateStudentProgress(
      parseInt(studentId)
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate system report (Admin only)
reportRouter.post(
  "/system",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const report = await ReportService.generateSystemReport();

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all reports (Admin only)
reportRouter.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { reportType } = req.query;

    const reports = await db.queryData(
      "reports",
      reportType ? { report_type: reportType } : {}
    );

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get report by ID
reportRouter.get("/:reportId", authenticate, async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await db.queryData("reports", { id: parseInt(reportId) });

    if (report.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = reportRouter;
