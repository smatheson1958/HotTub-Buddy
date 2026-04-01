import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const KEYS = {
  HOT_TUB_LOGS: "@hot_tub_logs",
  WEEKLY_CHECKS: "@weekly_checks",
  MAINTENANCE_LOGS: "@maintenance_logs",
  USAGE_LOGS: "@usage_logs",
  SETTINGS: "@settings",
};

// Default settings
const DEFAULT_SETTINGS = {
  capacity: 1000,
  capacity_unit: "liters",
  measurement_system: "metric",
};

// Helper to get next ID
const getNextId = (items) => {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id || 0)) + 1;
};

// Helper to add timestamps
const addTimestamp = (item) => ({
  ...item,
  created_at: item.created_at || new Date().toISOString(),
});

// Settings Operations
export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error getting settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(
      KEYS.SETTINGS,
      JSON.stringify({
        ...settings,
        updated_at: new Date().toISOString(),
      }),
    );
    return settings;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

// Hot Tub Logs Operations
export const getHotTubLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HOT_TUB_LOGS);
    const logs = data ? JSON.parse(data) : [];
    // Sort by date descending, then by time descending
    return logs.sort((a, b) => {
      if (a.log_date !== b.log_date) {
        return b.log_date.localeCompare(a.log_date);
      }
      const timeA = a.log_time || "00:00:00";
      const timeB = b.log_time || "00:00:00";
      return timeB.localeCompare(timeA);
    });
  } catch (error) {
    console.error("Error getting hot tub logs:", error);
    return [];
  }
};

export const createHotTubLog = async (log) => {
  try {
    const logs = await getHotTubLogs();
    const newLog = addTimestamp({
      ...log,
      id: getNextId(logs),
    });
    logs.push(newLog);
    await AsyncStorage.setItem(KEYS.HOT_TUB_LOGS, JSON.stringify(logs));
    return newLog;
  } catch (error) {
    console.error("Error creating hot tub log:", error);
    throw error;
  }
};

export const updateHotTubLog = async (log) => {
  try {
    const logs = await getHotTubLogs();
    const index = logs.findIndex((l) => l.id === log.id);
    if (index === -1) throw new Error("Log not found");
    logs[index] = { ...logs[index], ...log };
    await AsyncStorage.setItem(KEYS.HOT_TUB_LOGS, JSON.stringify(logs));
    return logs[index];
  } catch (error) {
    console.error("Error updating hot tub log:", error);
    throw error;
  }
};

export const deleteHotTubLog = async (id) => {
  try {
    const logs = await getHotTubLogs();
    const filtered = logs.filter((l) => l.id !== id);
    await AsyncStorage.setItem(KEYS.HOT_TUB_LOGS, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error("Error deleting hot tub log:", error);
    throw error;
  }
};

// Weekly Checks Operations
export const getWeeklyChecks = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WEEKLY_CHECKS);
    const checks = data ? JSON.parse(data) : [];
    return checks.sort((a, b) => {
      if (a.log_date !== b.log_date) {
        return b.log_date.localeCompare(a.log_date);
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  } catch (error) {
    console.error("Error getting weekly checks:", error);
    return [];
  }
};

export const createWeeklyCheck = async (check) => {
  try {
    const checks = await getWeeklyChecks();
    const newCheck = addTimestamp({
      ...check,
      id: getNextId(checks),
    });
    checks.push(newCheck);
    await AsyncStorage.setItem(KEYS.WEEKLY_CHECKS, JSON.stringify(checks));
    return newCheck;
  } catch (error) {
    console.error("Error creating weekly check:", error);
    throw error;
  }
};

export const updateWeeklyCheck = async (check) => {
  try {
    const checks = await getWeeklyChecks();
    const index = checks.findIndex((c) => c.id === check.id);
    if (index === -1) throw new Error("Check not found");
    checks[index] = { ...checks[index], ...check };
    await AsyncStorage.setItem(KEYS.WEEKLY_CHECKS, JSON.stringify(checks));
    return checks[index];
  } catch (error) {
    console.error("Error updating weekly check:", error);
    throw error;
  }
};

export const deleteWeeklyCheck = async (id) => {
  try {
    const checks = await getWeeklyChecks();
    const filtered = checks.filter((c) => c.id !== id);
    await AsyncStorage.setItem(KEYS.WEEKLY_CHECKS, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error("Error deleting weekly check:", error);
    throw error;
  }
};

// Maintenance Logs Operations
export const getMaintenanceLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MAINTENANCE_LOGS);
    const logs = data ? JSON.parse(data) : [];
    return logs.sort((a, b) => {
      if (a.log_date !== b.log_date) {
        return b.log_date.localeCompare(a.log_date);
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  } catch (error) {
    console.error("Error getting maintenance logs:", error);
    return [];
  }
};

export const createMaintenanceLog = async (log) => {
  try {
    const logs = await getMaintenanceLogs();
    const newLog = addTimestamp({
      ...log,
      id: getNextId(logs),
    });
    logs.push(newLog);
    await AsyncStorage.setItem(KEYS.MAINTENANCE_LOGS, JSON.stringify(logs));
    return newLog;
  } catch (error) {
    console.error("Error creating maintenance log:", error);
    throw error;
  }
};

export const updateMaintenanceLog = async (log) => {
  try {
    const logs = await getMaintenanceLogs();
    const index = logs.findIndex((l) => l.id === log.id);
    if (index === -1) throw new Error("Log not found");
    logs[index] = { ...logs[index], ...log };
    await AsyncStorage.setItem(KEYS.MAINTENANCE_LOGS, JSON.stringify(logs));
    return logs[index];
  } catch (error) {
    console.error("Error updating maintenance log:", error);
    throw error;
  }
};

export const deleteMaintenanceLog = async (id) => {
  try {
    const logs = await getMaintenanceLogs();
    const filtered = logs.filter((l) => l.id !== id);
    await AsyncStorage.setItem(KEYS.MAINTENANCE_LOGS, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error("Error deleting maintenance log:", error);
    throw error;
  }
};

// Usage Logs Operations
export const getUsageLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USAGE_LOGS);
    const logs = data ? JSON.parse(data) : [];
    return logs.sort((a, b) => {
      if (a.usage_date !== b.usage_date) {
        return b.usage_date.localeCompare(a.usage_date);
      }
      const timeA = a.usage_time || "00:00:00";
      const timeB = b.usage_time || "00:00:00";
      return timeB.localeCompare(timeA);
    });
  } catch (error) {
    console.error("Error getting usage logs:", error);
    return [];
  }
};

export const createUsageLog = async (log) => {
  try {
    const logs = await getUsageLogs();
    const newLog = addTimestamp({
      ...log,
      id: getNextId(logs),
    });
    logs.push(newLog);
    await AsyncStorage.setItem(KEYS.USAGE_LOGS, JSON.stringify(logs));
    return newLog;
  } catch (error) {
    console.error("Error creating usage log:", error);
    throw error;
  }
};

export const updateUsageLog = async (log) => {
  try {
    const logs = await getUsageLogs();
    const index = logs.findIndex((l) => l.id === log.id);
    if (index === -1) throw new Error("Log not found");
    logs[index] = { ...logs[index], ...log };
    await AsyncStorage.setItem(KEYS.USAGE_LOGS, JSON.stringify(logs));
    return logs[index];
  } catch (error) {
    console.error("Error updating usage log:", error);
    throw error;
  }
};

export const deleteUsageLog = async (id) => {
  try {
    const logs = await getUsageLogs();
    const filtered = logs.filter((l) => l.id !== id);
    await AsyncStorage.setItem(KEYS.USAGE_LOGS, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error("Error deleting usage log:", error);
    throw error;
  }
};

// Clear all data (useful for testing/reset)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return { success: true };
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};
