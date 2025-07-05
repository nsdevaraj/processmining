export const OverviewPageQueries = {
  currentMonthMetricsQuery: `
 WITH current_period_data AS (
          SELECT case_id, activity, timestamp, payment_term
          FROM {{tableName}}
          WHERE timestamp::DATE >= '{{current_period_start}}'
             {{filterConditions}}
        ),
        current_lead_times AS (
          SELECT case_id,
            ROUND(DATE_DIFF('minute', MIN(timestamp), MAX(timestamp)) / 1440.0, 1) AS lead_time_days
          FROM current_period_data
          GROUP BY case_id
          HAVING MAX(timestamp) > MIN(timestamp)
        ),
        current_delivery_analysis AS (
          SELECT case_id, payment_term,
            MIN(CASE WHEN activity = 'Receive Purchase Order' THEN timestamp END) AS order_date,
            MAX(CASE WHEN activity = 'Clear Invoice' THEN timestamp END) AS completion_date,
            CASE
              WHEN payment_term LIKE '%30 days%' THEN 30
              WHEN payment_term LIKE '%45 days%' THEN 45
              WHEN payment_term LIKE '%60 days%' THEN 60
              WHEN payment_term LIKE '%90 days%' THEN 90
              ELSE 30
            END AS promised_days
          FROM current_period_data
          GROUP BY case_id, payment_term
          HAVING order_date IS NOT NULL AND completion_date IS NOT NULL
        )
        SELECT
          ROUND(AVG(lead_time_days), 1) AS avg_lead_time,
          COUNT(DISTINCT current_lead_times.case_id) AS cases_with_lead_time,
          (SELECT COUNT(DISTINCT case_id) FROM current_period_data) AS total_cases,
          (SELECT COUNT(DISTINCT case_id) FROM current_period_data WHERE activity = 'Clear Invoice') AS completed_cases,
          ROUND(
            SUM(CASE WHEN DATE_DIFF('day', order_date, completion_date) <= promised_days THEN 1 ELSE 0 END) * 100.0
            / NULLIF(COUNT(*), 0),
            1
          ) AS on_time_delivery_rate,
          COUNT(*) AS delivery_cases
        FROM current_lead_times
        LEFT JOIN current_delivery_analysis USING (case_id);
`,
  previousMonthMetricsQuery: `
     WITH previous_period_data AS (
          SELECT case_id, activity, timestamp, payment_term
          FROM {{tableName}}
          WHERE timestamp::DATE >= '{{previous_period_start}}'
            AND timestamp::DATE < '{{current_period_start}}'
             {{filterConditions}}
        ),
        previous_lead_times AS (
          SELECT case_id,
            ROUND(DATE_DIFF('minute', MIN(timestamp), MAX(timestamp)) / 1440.0, 1) AS lead_time_days
          FROM previous_period_data
          GROUP BY case_id
          HAVING MAX(timestamp) > MIN(timestamp)
        ),
        previous_delivery_analysis AS (
          SELECT case_id, payment_term,
            MIN(CASE WHEN activity = 'Receive Purchase Order' THEN timestamp END) AS order_date,
            MAX(CASE WHEN activity = 'Clear Invoice' THEN timestamp END) AS completion_date,
            CASE
              WHEN payment_term LIKE '%30 days%' THEN 30
              WHEN payment_term LIKE '%45 days%' THEN 45
              WHEN payment_term LIKE '%60 days%' THEN 60
              WHEN payment_term LIKE '%90 days%' THEN 90
              ELSE 30
            END AS promised_days
          FROM previous_period_data
          GROUP BY case_id, payment_term
          HAVING order_date IS NOT NULL AND completion_date IS NOT NULL
        )
        SELECT
          ROUND(AVG(lead_time_days), 1) AS avg_lead_time,
          COUNT(DISTINCT previous_lead_times.case_id) AS cases_with_lead_time,
          (SELECT COUNT(DISTINCT case_id) FROM previous_period_data) AS total_cases,
          (SELECT COUNT(DISTINCT case_id) FROM previous_period_data WHERE activity = 'Clear Invoice') AS completed_cases,
          ROUND(
            SUM(CASE WHEN DATE_DIFF('day', order_date, completion_date) <= promised_days THEN 1 ELSE 0 END) * 100.0
            / NULLIF(COUNT(*), 0),
            1
          ) AS on_time_delivery_rate,
          COUNT(*) AS delivery_cases
        FROM previous_lead_times
        LEFT JOIN previous_delivery_analysis USING (case_id);
    `,
  overallTotalsQuery: `
      SELECT
          COUNT(DISTINCT case_id) AS total_cases,
          COUNT(DISTINCT CASE WHEN activity = 'Clear Invoice' THEN case_id END) AS completed_cases,
          COUNT(DISTINCT case_id) - COUNT(DISTINCT CASE WHEN activity = 'Clear Invoice' THEN case_id END) AS active_cases
        FROM {{tableName}}
        WHERE 1=1
          {{filterConditions}} 
    `,
  averageLeadTimeChartData: `
       WITH filtered_data AS (
          SELECT case_id, activity, timestamp, payment_term
          FROM {{tableName}}
          WHERE 1=1
            {{filterConditions}}
        ),
        case_lead_times AS (
          SELECT case_id,
            MIN(timestamp) AS start_time,
            MAX(timestamp) AS end_time,
            EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) / 86400.0 AS lead_time_days
          FROM filtered_data
          GROUP BY case_id
        )
        SELECT
          STRFTIME(start_time, '%b') AS month,
          COUNT(*) AS volume,
          ROUND(AVG(lead_time_days), 2) AS leadTime,
          EXTRACT(MONTH FROM start_time) AS month_num
        FROM case_lead_times
        GROUP BY month, month_num
        ORDER BY month_num;
    `,
  processBreakOutChartQuery: `
      WITH filtered_data AS (
        SELECT region, case_id
        FROM {{tableName}}
        WHERE region IS NOT NULL
          {{filterConditions}}
      ),
      region_case_counts AS (
        SELECT region AS name, COUNT(DISTINCT case_id) AS count
        FROM filtered_data
        GROUP BY region
      ),
      total AS (
        SELECT SUM(count) AS total_count FROM region_case_counts
      )
      SELECT
        name,
        ROUND((count * 100.0) / NULLIF(total.total_count, 0), 2) AS value
      FROM region_case_counts, total
      ORDER BY value DESC;
    `,
  processVariantChartQuery: `
    WITH variant_counts AS (
  SELECT 
    variant AS name,
    COUNT(*) AS count
  FROM {{tableName}}
     WHERE 1=1
            {{filterConditions}}
  GROUP BY variant
),
ranked_variants AS (
  SELECT 
    name,
    count,
    RANK() OVER (ORDER BY count DESC) AS rnk
  FROM variant_counts
),
labeled_variants AS (
  SELECT 
    CASE 
      WHEN rnk <= 3 THEN name
      ELSE 'Others'
    END AS name,
    count
  FROM ranked_variants
),
grouped_variants AS (
  SELECT 
    name,
    SUM(count) AS total_count
  FROM labeled_variants
  GROUP BY name
),
total AS (
  SELECT SUM(total_count) AS overall_count FROM grouped_variants
)
SELECT 
  name,
  ROUND(100.0 * total_count / overall_count, 2) AS value
FROM grouped_variants, total
ORDER BY 
  CASE WHEN name = 'Others' THEN 99 ELSE total_count * -1 END;

    `,
  bottleNecksChartQuery: `
WITH filtered_data AS (
  SELECT *
  FROM {{tableName}}
  WHERE 1=1
    {{filterConditions}}  -- This applies your dynamic filters like region, company, etc.
),
ordered_events AS (
  SELECT
    case_id,
    activity,
    timestamp,
    LEAD(timestamp) OVER (PARTITION BY case_id ORDER BY timestamp) AS next_timestamp,
    LEAD(activity) OVER (PARTITION BY case_id ORDER BY timestamp) AS next_activity
  FROM filtered_data
),
activity_durations AS (
  SELECT
    next_activity AS activity,
    (EXTRACT(EPOCH FROM next_timestamp) - EXTRACT(EPOCH FROM timestamp)) / 86400.0 AS duration_in_days
  FROM ordered_events
  WHERE next_timestamp IS NOT NULL
),
avg_durations AS (
  SELECT
    activity AS name,
    ROUND(AVG(duration_in_days), 2) AS duration
  FROM activity_durations
  GROUP BY activity
)
SELECT name, duration
FROM avg_durations
ORDER BY duration DESC
LIMIT 5;

    `,
};
