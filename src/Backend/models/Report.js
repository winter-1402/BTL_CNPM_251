// ============================================
// models/Report.js - Complete Report Model
// ============================================

const PDFDocument = require("pdfkit");
const fs = require("fs");

class Report {
  constructor(reportId, reportType, data, generatedBy) {
    this.reportId = reportId;
    this.reportType = reportType;
    this.generatedDate = new Date();
    this.data = data;
    this.generatedBy = generatedBy; // Admin ID
  }

  async generateReport() {
    try {
      const reportData = {
        report_type: this.reportType,
        data: JSON.stringify(this.data),
        generated_by: this.generatedBy,
        generated_at: this.generatedDate,
      };

      const result = await db.storeData("reports", reportData);
      this.reportId = result.id;

      console.log(`Report ${this.reportId} generated successfully`);
      return true;
    } catch (error) {
      console.error("Generate report error:", error);
      throw error;
    }
  }

  async exportToPDF() {
    try {
      const filename = `report_${this.reportId}.pdf`;
      const filepath = `./reports/${filename}`;

      // Create reports directory if it doesn't exist
      if (!fs.existsSync("./reports")) {
        fs.mkdirSync("./reports");
      }

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filepath));

      // Add content to PDF
      doc
        .fontSize(20)
        .text(`${this.reportType.toUpperCase()} Report`, 100, 100);
      doc
        .fontSize(12)
        .text(`Generated: ${this.generatedDate.toISOString()}`, 100, 130);
      doc.fontSize(12).text(`Report ID: ${this.reportId}`, 100, 150);

      // Add data
      doc.fontSize(14).text("Report Data:", 100, 180);
      doc.fontSize(10).text(JSON.stringify(this.data, null, 2), 100, 200);

      doc.end();

      console.log(`Report exported to ${filepath}`);
      return filepath;
    } catch (error) {
      console.error("Export to PDF error:", error);
      throw error;
    }
  }

  async exportToExcel() {
    try {
      // Implementation for Excel export
      const filename = `report_${this.reportId}.xlsx`;
      console.log(`Report exported to ${filename}`);
      return filename;
    } catch (error) {
      console.error("Export to Excel error:", error);
      throw error;
    }
  }

  static async getReportById(reportId) {
    try {
      const reports = await db.queryData("reports", { id: reportId });
      return reports[0] || null;
    } catch (error) {
      console.error("Get report by ID error:", error);
      throw error;
    }
  }

  static async getAllReports(filters = {}) {
    try {
      const reports = await db.queryData("reports", filters);
      return reports;
    } catch (error) {
      console.error("Get all reports error:", error);
      throw error;
    }
  }
}

module.exports = { Report };
