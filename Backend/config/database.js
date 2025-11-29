// ============================================
// config/database.js - Database Configuration
// ============================================

const mysql = require("mysql2/promise");

class Database {
  constructor(dbName) {
    this.dbName = dbName;
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "cuongbui789tuan",
      database: dbName,
      waitForConnections: true,
      connectionLimit: 20,
      idleTimeout: 30000,
    });
  }

  async connect() {
    try {
      const conn = await this.pool.getConnection();
      console.log("MySQL connected successfully");
      conn.release();
    } catch (error) {
      console.error("MySQL connection error:", error);
      throw error;
    }
  }

  async storeData(table, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => "?").join(", ");

      const query = `INSERT INTO ${table} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;
      const [result] = await this.pool.query(query, values);

      return { id: result.insertId, ...data };
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  }

  async updateData(table, recordId, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
      const [result] = await this.pool.query(query, [...values, recordId]);

      return result;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }

  async deleteData(table, recordId) {
    try {
      const query = `DELETE FROM ${table} WHERE id = ?`;
      const [result] = await this.pool.query(query, [recordId]);

      return result;
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }

  async queryData(table, filters = {}) {
    try {
      const keys = Object.keys(filters);

      if (keys.length === 0) {
        const [rows] = await this.pool.query(`SELECT * FROM ${table}`);
        return rows;
      }

      const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
      const values = Object.values(filters);

      const [rows] = await this.pool.query(
        `SELECT * FROM ${table} WHERE ${whereClause}`,
        values
      );

      return rows;
    } catch (error) {
      console.error("Error querying data:", error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

const db = new Database("tutor_system");

module.exports = { Database, db };
