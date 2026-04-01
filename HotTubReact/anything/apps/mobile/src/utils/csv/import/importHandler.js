import { Alert } from "react-native";
import {
  getHotTubLogs,
  getUsageLogs,
  getMaintenanceLogs,
  getWeeklyChecks,
  createHotTubLog,
  createUsageLog,
  createMaintenanceLog,
  createWeeklyCheck,
  clearAllData,
} from "@/utils/offlineStorage";

/**
 * Helper function to check if record exists
 */
function isDuplicate(newRecord, existingRecords, dateField, timeField) {
  return existingRecords.some((existing) => {
    const sameDate = existing[dateField] === newRecord[dateField];
    const sameTime = existing[timeField] === newRecord[timeField];
    return sameDate && sameTime;
  });
}

/**
 * Import valid records by merging with existing data
 */
export async function importValidRecordsMerge(validationResults) {
  try {
    // Get existing records
    const [existingDaily, existingUsage, existingMaintenance, existingWeekly] =
      await Promise.all([
        getHotTubLogs(),
        getUsageLogs(),
        getMaintenanceLogs(),
        getWeeklyChecks(),
      ]);

    let addedCount = 0;
    let skippedCount = 0;

    // Import only valid daily logs
    for (const log of validationResults.dailyLogs.valid) {
      if (!isDuplicate(log, existingDaily, "log_date", "log_time")) {
        await createHotTubLog(log);
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    // Import only valid usage logs
    for (const log of validationResults.usageLogs.valid) {
      if (!isDuplicate(log, existingUsage, "usage_date", "usage_time")) {
        await createUsageLog(log);
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    // Import only valid maintenance logs
    for (const log of validationResults.maintenanceLogs.valid) {
      if (!isDuplicate(log, existingMaintenance, "log_date", "log_time")) {
        await createMaintenanceLog(log);
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    // Import only valid weekly checks
    for (const log of validationResults.weeklyChecks.valid) {
      if (!isDuplicate(log, existingWeekly, "log_date", "log_time")) {
        await createWeeklyCheck(log);
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    return { addedCount, skippedCount };
  } catch (error) {
    console.error("Import merge error:", error);
    throw error;
  }
}

/**
 * Import valid records by replacing all existing data
 */
export async function importValidRecordsReplace(validationResults) {
  try {
    // Clear existing data
    await clearAllData();

    // Import only valid new data
    for (const log of validationResults.dailyLogs.valid) {
      await createHotTubLog(log);
    }
    for (const log of validationResults.usageLogs.valid) {
      await createUsageLog(log);
    }
    for (const log of validationResults.maintenanceLogs.valid) {
      await createMaintenanceLog(log);
    }
    for (const log of validationResults.weeklyChecks.valid) {
      await createWeeklyCheck(log);
    }

    const totalValid =
      validationResults.dailyLogs.valid.length +
      validationResults.usageLogs.valid.length +
      validationResults.maintenanceLogs.valid.length +
      validationResults.weeklyChecks.valid.length;

    return { totalValid };
  } catch (error) {
    console.error("Import replace error:", error);
    throw error;
  }
}
