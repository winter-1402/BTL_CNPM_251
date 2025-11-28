// ============================================
// config/database.js - Database Configuration
// ============================================

const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:5432/tutor_system",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

class Database {
  constructor(dbName) {
    this.dbName = dbName;
    this.pool = pool;
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  async storeData(table, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

      const query = `INSERT INTO ${table} (${keys.join(
        ", "
      )}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  }

  async updateData(table, recordId, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

      const query = `UPDATE ${table} SET ${setClause} WHERE id = $${
        keys.length + 1
      } RETURNING *`;
      const result = await this.pool.query(query, [...values, recordId]);

      return result.rows[0];
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }

  async deleteData(table, recordId) {
    try {
      const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
      const result = await this.pool.query(query, [recordId]);

      return result.rows[0];
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }

  async queryData(table, filters = {}) {
    try {
      const keys = Object.keys(filters);

      if (keys.length === 0) {
        const query = `SELECT * FROM ${table}`;
        const result = await this.pool.query(query);
        return result.rows;
      }

      const values = Object.values(filters);
      const whereClause = keys
        .map((key, i) => `${key} = $${i + 1}`)
        .join(" AND ");

      const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
      const result = await this.pool.query(query, values);

      return result.rows;
    } catch (error) {
      console.error("Error querying data:", error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const result = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

const db = new Database("tutor_system");

module.exports = { Database, db };
