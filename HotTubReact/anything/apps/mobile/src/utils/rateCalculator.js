import { isChlorineBasedShock } from "./shockTypes";

/**
 * Find the most recent water change date from maintenance logs
 * @param {Array} maintenanceLogs - Maintenance log entries
 * @returns {string|null} - ISO date string of most recent water change, or null
 */
function getMostRecentWaterChange(maintenanceLogs = []) {
  if (!maintenanceLogs || maintenanceLogs.length === 0) return null;

  const waterChanges = maintenanceLogs
    .filter((log) => log.water_change === true)
    .sort((a, b) => {
      // Sort by date descending (most recent first)
      if (a.log_date !== b.log_date) {
        return b.log_date.localeCompare(a.log_date);
      }
      // If same date, sort by time
      const timeA = a.log_time || "00:00:00";
      const timeB = b.log_time || "00:00:00";
      return timeB.localeCompare(timeA);
    });

  return waterChanges.length > 0 ? waterChanges[0].log_date : null;
}

/**
 * Calculate sanitizer consumption rates between consecutive log entries
 * Excludes periods where chlorine-based shock was applied
 * Excludes all logs before the most recent water change
 * @param {Array} logs - Daily log entries
 * @param {number} volumeLitres - Hot tub volume in litres
 * @param {Array} weeklyChecks - Weekly check entries (optional)
 * @param {Array} maintenanceLogs - Maintenance log entries (optional)
 * @returns {Array} - Array of consumption rate objects
 */
export function calculateUsageRates(
  logs,
  volumeLitres,
  weeklyChecks = [],
  maintenanceLogs = [],
) {
  if (!logs || logs.length < 2) return [];

  // Find the most recent water change
  const waterChangeDate = getMostRecentWaterChange(maintenanceLogs);

  // Filter logs to only include those after the water change
  let filteredLogs = logs;
  if (waterChangeDate) {
    filteredLogs = logs.filter((log) => log.log_date > waterChangeDate);
  }

  // Need at least 2 logs after filtering for water changes
  if (filteredLogs.length < 2) return [];

  // Reverse to get oldest-first order for chronological calculations
  const sortedLogs = [...filteredLogs].reverse();

  const rates = [];

  for (let i = 1; i < sortedLogs.length; i++) {
    const before = sortedLogs[i - 1];
    const after = sortedLogs[i];

    if (!before.chlorine_1 || !after.chlorine_1) continue;

    const beforeTime = new Date(
      `${before.log_date}T${before.log_time || "00:00"}`,
    );
    const afterTime = new Date(
      `${after.log_date}T${after.log_time || "00:00"}`,
    );

    const hoursElapsed = (afterTime - beforeTime) / (1000 * 60 * 60);
    if (hoursElapsed <= 0) continue;

    // Check if chlorine-based shock was applied in this period
    const chlorineShockInPeriod = weeklyChecks.some((check) => {
      const checkDate = check.log_date || check.usage_date;
      return (
        checkDate >= before.log_date &&
        checkDate <= after.log_date &&
        check.shock_added > 0 &&
        isChlorineBasedShock(check.shock_type)
      );
    });

    const ppmChange = before.chlorine_1 - after.chlorine_1;
    const ppmAdded = after.added_chlorine || 0;
    const totalConsumed = ppmChange + ppmAdded;

    const ppmPerHour = totalConsumed / hoursElapsed;
    const ppmPerDay = ppmPerHour * 24;
    const gramsPerDay = (ppmPerDay * volumeLitres) / 1000 / 0.62;

    rates.push({
      periodStart: before.log_date,
      periodEnd: after.log_date,
      hoursElapsed: Math.round(hoursElapsed * 10) / 10,
      daysElapsed: Math.round((hoursElapsed / 24) * 10) / 10,
      startPpm: before.chlorine_1,
      endPpm: after.chlorine_1,
      naturalDecay: ppmChange,
      ppmAdded: ppmAdded,
      totalConsumed: Math.round(totalConsumed * 100) / 100,
      ppmPerHour: Math.round(ppmPerHour * 1000) / 1000,
      ppmPerDay: Math.round(ppmPerDay * 100) / 100,
      gramsPerDay: Math.round(gramsPerDay * 100) / 100,
      beforeLogId: before.id,
      afterLogId: after.id,
      excludedFromCalc: chlorineShockInPeriod,
      exclusionReason: chlorineShockInPeriod
        ? "Chlorine-based shock applied in this period"
        : null,
    });
  }

  return rates;
}

export function getCurrentRate(
  logs,
  volumeLitres,
  weeklyChecks = [],
  maintenanceLogs = [],
) {
  const rates = calculateUsageRates(
    logs,
    volumeLitres,
    weeklyChecks,
    maintenanceLogs,
  );
  // Get the most recent non-excluded rate
  const validRates = rates.filter((r) => !r.excludedFromCalc);
  return validRates.length > 0 ? validRates[validRates.length - 1] : null;
}

export function getAverageRate(
  logs,
  volumeLitres,
  days = 7,
  weeklyChecks = [],
  maintenanceLogs = [],
) {
  const rates = calculateUsageRates(
    logs,
    volumeLitres,
    weeklyChecks,
    maintenanceLogs,
  );
  if (rates.length === 0) return null;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];

  // Filter to recent rates AND exclude chlorine shock periods
  const recentRates = rates.filter(
    (r) => r.periodEnd >= cutoffStr && !r.excludedFromCalc,
  );
  if (recentRates.length === 0) return null;

  const avgPpmPerDay =
    recentRates.reduce((sum, r) => sum + r.ppmPerDay, 0) / recentRates.length;
  const avgGramsPerDay =
    recentRates.reduce((sum, r) => sum + r.gramsPerDay, 0) / recentRates.length;

  return {
    days,
    sampleSize: recentRates.length,
    avgPpmPerDay: Math.round(avgPpmPerDay * 100) / 100,
    avgGramsPerDay: Math.round(avgGramsPerDay * 100) / 100,
  };
}

/**
 * Get data quality/confidence metadata for consumption calculations
 * @param {Array} logs - Daily log entries
 * @param {Array} maintenanceLogs - Maintenance log entries
 * @returns {Object} - Confidence metadata
 */
export function getDataConfidence(logs, maintenanceLogs = []) {
  const waterChangeDate = getMostRecentWaterChange(maintenanceLogs);

  if (!waterChangeDate) {
    // No water change detected, full confidence
    return {
      hasRecentWaterChange: false,
      waterChangeDate: null,
      daysSinceWaterChange: null,
      readingsSinceWaterChange: logs.length,
      confidence:
        logs.length >= 7 ? "high" : logs.length >= 3 ? "medium" : "low",
      warningMessage: null,
    };
  }

  // Count logs after water change
  const logsAfterWaterChange = logs.filter(
    (log) => log.log_date > waterChangeDate,
  );

  // Calculate days since water change
  const waterChangeTime = new Date(waterChangeDate);
  const now = new Date();
  const daysSinceWaterChange = Math.floor(
    (now - waterChangeTime) / (1000 * 60 * 60 * 24),
  );

  // Determine confidence level
  let confidence = "low";
  let warningMessage = null;

  if (logsAfterWaterChange.length < 2) {
    confidence = "insufficient";
    warningMessage =
      "Need at least 2 readings after water change for consumption estimates";
  } else if (daysSinceWaterChange < 7 || logsAfterWaterChange.length < 5) {
    confidence = "low";
    warningMessage =
      "Recent water change - consumption rates may be less stable than normal";
  } else {
    confidence = "medium";
  }

  return {
    hasRecentWaterChange: true,
    waterChangeDate,
    daysSinceWaterChange,
    readingsSinceWaterChange: logsAfterWaterChange.length,
    confidence,
    warningMessage,
  };
}

/**
 * Get detailed analytics for consumption rates
 */
export function getRateAnalytics(
  logs,
  volumeLitres,
  days = 30,
  weeklyChecks = [],
) {
  const rates = calculateUsageRates(logs, volumeLitres, weeklyChecks);
  if (rates.length === 0) return null;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];

  // Filter to recent rates AND exclude chlorine shock periods
  const recentRates = rates.filter(
    (r) => r.periodEnd >= cutoffStr && !r.excludedFromCalc,
  );
  if (recentRates.length === 0) return null;

  // Sort for median and percentile calculations
  const sortedPpmRates = [...recentRates]
    .map((r) => r.ppmPerDay)
    .sort((a, b) => a - b);
  const sortedGramRates = [...recentRates]
    .map((r) => r.gramsPerDay)
    .sort((a, b) => a - b);

  // Calculate min/max
  const minPpm = sortedPpmRates[0];
  const maxPpm = sortedPpmRates[sortedPpmRates.length - 1];
  const minGrams = sortedGramRates[0];
  const maxGrams = sortedGramRates[sortedGramRates.length - 1];

  // Calculate median
  const medianPpm = getMedian(sortedPpmRates);
  const medianGrams = getMedian(sortedGramRates);

  // Calculate average
  const avgPpm =
    recentRates.reduce((sum, r) => sum + r.ppmPerDay, 0) / recentRates.length;
  const avgGrams =
    recentRates.reduce((sum, r) => sum + r.gramsPerDay, 0) / recentRates.length;

  // Calculate 25th and 75th percentiles
  const p25Ppm = getPercentile(sortedPpmRates, 25);
  const p75Ppm = getPercentile(sortedPpmRates, 75);
  const p25Grams = getPercentile(sortedGramRates, 25);
  const p75Grams = getPercentile(sortedGramRates, 75);

  return {
    days,
    sampleSize: recentRates.length,
    ppm: {
      min: Math.round(minPpm * 100) / 100,
      max: Math.round(maxPpm * 100) / 100,
      avg: Math.round(avgPpm * 100) / 100,
      median: Math.round(medianPpm * 100) / 100,
      p25: Math.round(p25Ppm * 100) / 100,
      p75: Math.round(p75Ppm * 100) / 100,
    },
    grams: {
      min: Math.round(minGrams * 100) / 100,
      max: Math.round(maxGrams * 100) / 100,
      avg: Math.round(avgGrams * 100) / 100,
      median: Math.round(medianGrams * 100) / 100,
      p25: Math.round(p25Grams * 100) / 100,
      p75: Math.round(p75Grams * 100) / 100,
    },
  };
}

function getMedian(sortedArray) {
  const mid = Math.floor(sortedArray.length / 2);
  if (sortedArray.length % 2 === 0) {
    return (sortedArray[mid - 1] + sortedArray[mid]) / 2;
  }
  return sortedArray[mid];
}

function getPercentile(sortedArray, percentile) {
  const index = (percentile / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sortedArray[lower];
  }

  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}
