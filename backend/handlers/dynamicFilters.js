import { runQuery } from "../config/duckdb.js";

export const getDuckDBColumnMetadata = async (req, h) => {
  try {
    const tableName = req.payload.tableName;

    if (!req.payload.tableName) {
      return h.response({ message: "Provide Table Name to fetch" });
    }
    const columns = await runQuery(`PRAGMA table_info('${tableName}')`);

    const filterMetadata = [];

    for (const column of columns) {
      const columnName = column.name;

      // Sample data for that column
      const sampleData = await runQuery(
        `SELECT ${columnName} FROM ${tableName} WHERE ${columnName} IS NOT NULL LIMIT 100`
      );

      const uniqueValues = [
        ...new Set(sampleData.map((row) => row[columnName])),
      ];

      const isNumeric = uniqueValues.every((v) => typeof v === "number");
      const isDate = uniqueValues.every((v) =>
        /^\d{4}-\d{2}-\d{2}/.test(String(v))
      );

      if (isNumeric && uniqueValues.length > 1) {
        const stats = await runQuery(
          `SELECT MIN(${columnName}) as min, MAX(${columnName}) as max FROM ${tableName}`
        );
        filterMetadata.push({
          name: columnName,
          type: "range",
          min: stats[0].min,
          max: stats[0].max,
        });
      } else if (isDate) {
        filterMetadata.push({
          name: columnName,
          type: "date-range",
        });
      } else if (uniqueValues.length <= 20) {
        filterMetadata.push({
          name: columnName,
          type: "dropdown",
          options: uniqueValues,
        });
      }
    }

    return h.response(filterMetadata).code(200);
  } catch (error) {
    console.log(error);

    return h.response({ message: "error in fetching filter data" }).code(500);
  }
};
