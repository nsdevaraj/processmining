// import { runQuery } from "../config/duckdb.js";

//use this for processflow node-edges data for frontend

// export const getNodeData = async (req, h) => {
//   try {
//     const query = `WITH
//   total_cases AS (
//     SELECT COUNT(DISTINCT case_id) AS total FROM event_log_event_log_csv_1750853409024
//   ),
//   activity_counts AS (
//     SELECT
//       activity,
//       COUNT(DISTINCT case_id) AS cases_affected
//     FROM event_log_event_log_csv_1750853409024
//     GROUP BY activity
//   )
// SELECT
//   ROW_NUMBER() OVER (ORDER BY activity) AS id,
//   ac.activity,
//   ac.cases_affected,
//   tc.total AS total_cases
// FROM activity_counts ac, total_cases tc;
// `;
//     const result = await runQuery(query);

//     return h
//       .response({
//         message: "data retrieve success",
//         result: result,
//       })
//       .code(200);
//   } catch (error) {
//     return h
//       .response({
//         message: "data retrieve failed",
//         error,
//       })
//       .code(500);
//   }
// };
