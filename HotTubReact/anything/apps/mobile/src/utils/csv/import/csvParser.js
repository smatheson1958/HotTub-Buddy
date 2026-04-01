import { parseCSV } from "../csvConverter";
import {
  DAILY_LOG_HEADERS,
  USAGE_LOG_HEADERS,
  MAINTENANCE_LOG_HEADERS,
  WEEKLY_CHECK_HEADERS,
} from "../csvHeaders";

/**
 * Parse CSV content into separate data sections
 */
export function parseCsvSections(csvContent) {
  console.log("===== CSV IMPORT STARTED =====");
  console.log("File length:", csvContent.length);
  console.log("First 500 chars:", csvContent.substring(0, 500));

  // Parse sections - split on section markers
  const sections = csvContent.split(/===\s*(\w+)\s*===/);
  console.log("Sections found:", sections.length);
  console.log(
    "Section array:",
    sections.map((s, i) => `[${i}]: ${s.substring(0, 50)}...`),
  );

  let dailyLogs = [];
  let usageLogs = [];
  let maintenanceLogs = [];
  let weeklyChecks = [];

  // Process each section
  for (let i = 1; i < sections.length; i += 2) {
    const sectionName = sections[i].trim();
    const sectionData = sections[i + 1] ? sections[i + 1].trim() : "";

    console.log(`\n===== Processing section: ${sectionName} =====`);
    console.log("Section data length:", sectionData.length);
    console.log("Section data:", sectionData.substring(0, 300));

    if (!sectionData || sectionData.length === 0) {
      console.log(`Skipping empty section: ${sectionName}`);
      continue;
    }

    switch (sectionName) {
      case "DAILY_LOGS":
        console.log("Parsing DAILY_LOGS...");
        dailyLogs = parseCSV(sectionData, DAILY_LOG_HEADERS);
        console.log("DAILY_LOGS parsed count:", dailyLogs.length);
        break;
      case "USAGE_LOGS":
        console.log("Parsing USAGE_LOGS...");
        usageLogs = parseCSV(sectionData, USAGE_LOG_HEADERS);
        console.log("USAGE_LOGS parsed count:", usageLogs.length);
        break;
      case "MAINTENANCE_LOGS":
        console.log("Parsing MAINTENANCE_LOGS...");
        maintenanceLogs = parseCSV(sectionData, MAINTENANCE_LOG_HEADERS);
        console.log("MAINTENANCE_LOGS parsed count:", maintenanceLogs.length);
        break;
      case "WEEKLY_CHECKS":
        console.log("Parsing WEEKLY_CHECKS...");
        weeklyChecks = parseCSV(sectionData, WEEKLY_CHECK_HEADERS);
        console.log("WEEKLY_CHECKS parsed count:", weeklyChecks.length);
        break;
      default:
        console.log("Unknown section name:", sectionName);
    }
  }

  console.log("\n===== PARSED RESULTS =====");
  console.log("Daily logs:", dailyLogs.length);
  console.log("Usage logs:", usageLogs.length);
  console.log("Maintenance logs:", maintenanceLogs.length);
  console.log("Weekly checks:", weeklyChecks.length);

  return {
    dailyLogs,
    usageLogs,
    maintenanceLogs,
    weeklyChecks,
  };
}
