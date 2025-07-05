import dotenv from "dotenv";
import server from "./server.js";
import { initializeDatabase } from "./config/duckdb.js";
dotenv.config();

(async () => {
  try {
    await initializeDatabase();
    await server.start();
    console.log("Server listening %s/ ", server.info.uri);
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
})();
