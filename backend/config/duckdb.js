import duckdb from "duckdb";
import { convertBigIntToNumber } from "../utils/helper.js";
// import "../my_process_mining.js"; // Ensure the main module is loaded to initialize the database
const DB_PATH = "./config/my_process_mining.duckdb"; // Use in-memory database for testing
// import "../config/";
let db;
let connection;

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new duckdb.Database(DB_PATH, (err) => {
      if (err) {
        console.error("Failed to connect to DuckDB:", err);
        reject(err);
      } else {
        connection = db.connect();
        resolve();
        console.log("DuckDB connection established.");
      }
    });
  });
}

export function createTableFromCSV(csvPath, tableName) {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE OR REPLACE TABLE ${tableName} AS
      SELECT * FROM read_csv_auto('${csvPath}', AUTO_DETECT=TRUE)
    `;

    connection.run(query, (err) => {
      if (err) {
        console.error("Error loading CSV:", err);
        reject(err);
      } else {
        connection.all(
          `SELECT COUNT(*) as count FROM ${tableName}`,
          (countErr, rows) => {
            if (countErr) {
              reject(countErr);
            } else {
              const rowCount = Number(rows[0]?.count || 0);
              resolve(`Table ${tableName} created with ${rowCount} rows`);
            }
          }
        );
      }
    });
  });
}

export function runQuery(sql) {
  //   console.log(`Executing query: ${sql}`);

  return new Promise((resolve, reject) => {
    connection.all(sql, (err, rows) => {
      if (err) {
        console.error("Error running query:", err);
        console.error("SQL was:", sql);
        reject(err);
      } else {
        // console.log(`Query returned ${rows?.length || 0} rows`);

        // Convert BigInt values to regular numbers
        const convertedRows = convertBigIntToNumber(rows || []);

        if (convertedRows && convertedRows.length > 0) {
          //   console.log("First row sample:", convertedRows[0]);
        }

        resolve(convertedRows);
      }
    });
  });
}

export function getTableSchema(tableName = "event_log") {
  return runQuery(`DESCRIBE ${tableName}`);
}

export function getTableInfo(tableName = "event_log") {
  return runQuery(`
    SELECT 
      COUNT(*) as total_rows,
      COUNT(DISTINCT case_id) as unique_cases
    FROM ${tableName}
  `);
}

export function closeDatabase() {
  return new Promise((resolve) => {
    if (connection) {
      connection.close();
    }
    if (db) {
      db.close((err) => {
        if (err) {
          console.error("Error closing database:", err);
        } else {
          console.log("Database connection closed.");
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down...");
  await closeDatabase();
  process.exit(0);
});
