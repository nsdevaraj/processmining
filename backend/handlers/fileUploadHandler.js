import { createTableFromCSV } from "../config/duckdb.js";
import path from "path";
// export const handleFileUpload = async (request, h) => {
//   try {
//     const file = request.payload.file; // field name must match <input name="file">

//     if (!file || !file.path) {
//       return h.response({ error: "No file uploaded" }).code(400);
//     }

//     // console.log(`Received CSV: ${JSON.stringify(file)}`);
//     const fileName = file.path;
//     // console.log(fileName);

//     // console.log(`Received CSV: ${fileName} -> ${tempPath}`);
//     // console.log(`Received CSV: ${JSON.stringify(file.fileName)}`);

//     // Pass the temp path to your existing DuckDB function
//     const result = await createTableFromCSV(fileName);

//     return h
//       .response({
//         message: result,
//         fileName,
//       })
//       .code(200);
//   } catch (error) {
//     console.error("Upload error:", error);
//     return h.response({ error: "Failed to process CSV" }).code(500);
//   }
// };

export const handleFileUpload = async (request, h) => {
  try {
    const file = request.payload.file;

    if (!file || !file.path) {
      return h.response({ error: "No file uploaded" }).code(400);
    }

    const timestamp = Date.now(); // Unique identifier
    const baseName = path.basename(file.filename || "event_log");
    const safeName = baseName.replace(/\W+/g, "_").toLowerCase();
    const tableName = `event_log_${safeName}_${timestamp}`;

    const result = await createTableFromCSV(file.path, tableName);

    return h
      .response({
        message: result,
        tableName,
      })
      .code(200);
  } catch (error) {
    console.error("Upload error:", error);
    return h.response({ error: "Failed to process CSV" }).code(500);
  }
};
