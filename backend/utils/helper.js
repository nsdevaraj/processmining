import { runQuery } from "../config/duckdb.js";
import { OverviewPageQueries } from "../constants/Overview.queries.js";

export const convertBigIntToNumber = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
  if (typeof obj === "object") {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value);
    }
    return converted;
  }
  return obj;
};

function escapeString(str) {
  return str.replace(/'/g, "''");
}

export function buildWhereClause(filters = []) {
  const conditions = filters
    .map(({ field, value, type }) => {
      switch (type) {
        case "dropdown":
          return `"${field}" = '${escapeString(value)}'`;
        default:
          console.warn("Unknown filter type:", type);
          return null;
      }
    })
    .filter(Boolean);

  return conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
}

export const getProcessMetrics = async (tableName, filters = []) => {
  if (!tableName) throw new Error("Missing tableName");

  const rawWhere = buildWhereClause(filters);
  const filterConditionsOnly = rawWhere.replace(/^WHERE\s*/i, "");

  const dateRangeQuery = `
    SELECT
      MAX(timestamp::DATE)::VARCHAR AS max_date,
      (MAX(timestamp::DATE) - INTERVAL '30 days')::VARCHAR AS current_period_start,
      (MAX(timestamp::DATE) - INTERVAL '60 days')::VARCHAR AS previous_period_start
    FROM ${tableName}
    ${rawWhere}
  `;

  const [dateRangeRaw] = await runQuery(dateRangeQuery);
  // console.log(dateRangeRaw);

  const { max_date, current_period_start, previous_period_start } =
    dateRangeRaw;

  if (!current_period_start || !previous_period_start) {
    throw new Error("Invalid date ranges");
  }

  const replaceFilter = (query, condition) =>
    query.replace(
      /\{\{filterConditions\}\}/g,
      condition ? `AND ${condition}` : ""
    );

  const replacePlaceholders = (query, replacements) => {
    return query.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return replacements[key] !== undefined ? replacements[key] : "";
    });
  };
  const queries = {
    currentMonthMetricsQuery: replacePlaceholders(
      OverviewPageQueries.currentMonthMetricsQuery,
      {
        tableName,
        current_period_start,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ), // use replaceFilter
    previousMonthMetricsQuery: replacePlaceholders(
      OverviewPageQueries.previousMonthMetricsQuery,
      {
        tableName,
        previous_period_start,
        current_period_start,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),
    overallTotalsQuery: replacePlaceholders(
      OverviewPageQueries.overallTotalsQuery,
      {
        tableName,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),
    averageLeadTimeChartData: replacePlaceholders(
      OverviewPageQueries.averageLeadTimeChartData,
      {
        tableName,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),
    processBreakOutChartQuery: replacePlaceholders(
      OverviewPageQueries.processBreakOutChartQuery,
      {
        tableName,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),

    processVariantChartQuery: replacePlaceholders(
      OverviewPageQueries.processVariantChartQuery,
      {
        tableName,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),

    bottleNecksChartQuery: replacePlaceholders(
      OverviewPageQueries.bottleNecksChartQuery,
      {
        tableName,
        filterConditions: filterConditionsOnly
          ? `AND ${filterConditionsOnly}`
          : "",
      }
    ),
  };

  const [
    currentMonthMetrics,
    previousMonthMetrics,
    overallTotals,
    chartData,
    processBreakOutChart,
    processVariantChart,
    bottleNecksChart,
  ] = await Promise.all([
    runQuery(
      replaceFilter(queries.currentMonthMetricsQuery, filterConditionsOnly)
    ),
    runQuery(
      replaceFilter(queries.previousMonthMetricsQuery, filterConditionsOnly)
    ),
    runQuery(replaceFilter(queries.overallTotalsQuery, filterConditionsOnly)),
    runQuery(
      replaceFilter(queries.averageLeadTimeChartData, filterConditionsOnly)
    ),
    runQuery(
      replaceFilter(queries.processBreakOutChartQuery, filterConditionsOnly)
    ),
    runQuery(
      replaceFilter(queries.processVariantChartQuery, filterConditionsOnly)
    ),
    runQuery(
      replaceFilter(queries.bottleNecksChartQuery, filterConditionsOnly)
    ),
  ]);
  // console.log(bottleNecksChart);

  const calculateTrend = (current, previous, inverse = false) => {
    current = parseFloat(current) || 0;
    previous = parseFloat(previous) || 0;
    if (previous === 0)
      return {
        value: current,
        trend: 0,
        trendDirection: "neutral",
        changeText: "No previous data",
      };
    const change = current - previous;
    const percent = (change / previous) * 100;
    const adjusted = inverse ? -percent : percent;
    const direction =
      adjusted > 0.1 ? "up" : adjusted < -0.1 ? "down" : "neutral";
    const sign = adjusted > 0 ? "↑" : adjusted < 0 ? "↓" : "";
    return {
      value: current,
      trend: Math.round(adjusted * 10) / 10,
      trendDirection: direction,
      changeText: sign
        ? `${sign} ${Math.abs(change).toFixed(1)} (${Math.abs(percent).toFixed(
            1
          )}%) vs last month`
        : "No change vs last month",
      previousValue: previous,
    };
  };

  const current = convertBigIntToNumber(currentMonthMetrics[0] || {});
  const previous = convertBigIntToNumber(previousMonthMetrics[0] || {});
  const totals = convertBigIntToNumber(overallTotals[0] || {});
  const chart = chartData.map(convertBigIntToNumber);
  const currentActive =
    (current.total_cases || 0) - (current.completed_cases || 0);
  const previousActive =
    (previous.total_cases || 0) - (previous.completed_cases || 0);

  const processMetrics = {
    avgLeadTime: {
      ...calculateTrend(current.avg_lead_time, previous.avg_lead_time, true),
      unit: "days",
    },
    onTimeDelivery: {
      ...calculateTrend(
        current.on_time_delivery_rate,
        previous.on_time_delivery_rate
      ),
      unit: "%",
    },
    totalCases: {
      ...calculateTrend(
        totals.total_cases,
        (current.total_cases || 0) + (previous.total_cases || 0)
      ),
      unit: "cases",
    },
    activeCases: {
      ...calculateTrend(totals.active_cases, currentActive + previousActive),
      unit: "cases",
    },
    completedCases: {
      ...calculateTrend(
        totals.completed_cases,
        (current.completed_cases || 0) + (previous.completed_cases || 0)
      ),
      unit: "cases",
    },
    chartData: {
      averageLeadTime: chart,
      processBreakOut: processBreakOutChart,
      processVariant: processVariantChart,
      bottleNeck: bottleNecksChart,
    },
  };

  return { processMetrics };
};
