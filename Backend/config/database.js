// ============================================
// config/mssql.js - Microsoft SQL Server Configuration
// ============================================

const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();
// Build config from environment variables for flexibility
const baseConfig = {
  user: process.env.MSSQL_USER ,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_HOST , // hostname or IP
  port: parseInt(process.env.MSSQL_PORT, 10),
  database: process.env.MSSQL_DB,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true', // required for Azure
    trustServerCertificate: process.env.MSSQL_TRUST_CERT !== 'false', // allow self-signed certs locally
    enableArithAbort: true
  },
  pool: {
    max: parseInt(process.env.MSSQL_POOL_MAX || '10', 10),
    min: 0,
    idleTimeoutMillis: parseInt(process.env.MSSQL_POOL_IDLE || '30000', 10)
  }
};

class MSSQLDatabase {
  constructor(config = baseConfig) {
    this.config = config;
    this.pool = null;
  }

  async connect() {
    if (this.pool) return this.pool; // reuse
    try {
      this.pool = await sql.connect(this.config);
      console.log('MSSQL connected successfully');
      return this.pool;
    } catch (err) {
      console.error('MSSQL connection error:', err);
      throw err;
    }
  }

  // Parameterized query helper
  async query(queryString, params = []) {
    try {
      await this.connect();
      const request = new sql.Request();
      const transformed = this._transformPlaceholders(queryString, params.length ,params);
      params.forEach((val, idx) => {
        // Name parameters sequentially: p0, p1, ...
        request.input(`p${idx}`, val);
      });
      // Replace ? placeholders with parmeter names
      const result = await request.query(transformed);
      return result.recordset;
    } 
    catch (err) {
      console.error('MSSQL query error:', err);
      throw err;
    }
  }

  // Insert helper similar to MySQL version
  async insert(table, data) {
    await this.connect();
    const keys = Object.keys(data);
    const placeholders = keys.map((_, i) => `@p${i}`);
    const values = Object.values(data);
    const sqlText = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}); SELECT SCOPE_IDENTITY() AS id;`;
    const rows = await this.query(sqlText, values);
    return { id: rows[0].id, ...data };
  }

  async update(table, idColumn, idValue, data) {
    await this.connect();
    const keys = Object.keys(data);
    const setClause = keys.map((k, i) => `${k} = @p${i}`).join(', ');
    const values = Object.values(data);
    const sqlText = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = @p${keys.length}`;
    const rows = await this.query(sqlText, [...values, idValue]);
    return rows;
  }

  _transformPlaceholders(text, count ,params=[]) {
    let transformed = text;
    for (let i = 0; i < count; i++) {
      transformed = transformed.replace('?', `@p${i}`);
    }
    return transformed;
  }
}

const mssqlDb = new MSSQLDatabase();

module.exports = { MSSQLDatabase, mssqlDb };
// Test connection (uncomment to test)
// ============================================
// End of mssql.js
// ============================================