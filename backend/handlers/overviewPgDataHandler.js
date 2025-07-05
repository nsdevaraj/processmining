import { getProcessMetrics } from "../utils/helper.js";

export const getOverview = async (req, h) => {
  try {
    const tableName = req.query?.tableName;
    const { processMetrics } = await getProcessMetrics(tableName);
    return h.response({ processMetrics }).code(200);
  } catch (err) {
    console.error("Error:", err);
    return h.response({ success: false, error: err.message }).code(500);
  }
};

export const overviewWithFilters = async (req, h) => {
  try {
    // console.log("Getting process metrics with trends and filters...");

    // 1️⃣ Get filters
    const filters = req.payload?.filters || [];
    const tableName = req.query?.tableName;

    if (!tableName) {
      return h
        .response({
          message: "Missing tableName in query",
        })
        .code(400);
    }
    // console.log(tableName);
    // return;
    // console.log("Applied filters:", filters);

    const { processMetrics } = await getProcessMetrics(tableName, filters);
    return h.response({ processMetrics }).code(200);
  } catch (err) {
    console.error("Error calculating process metrics:", err);
    return h
      .response({
        success: false,
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      })
      .code(500);
  }
};
