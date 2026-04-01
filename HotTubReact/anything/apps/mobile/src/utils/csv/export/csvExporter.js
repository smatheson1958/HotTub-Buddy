import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import { Alert, Share } from "react-native";
import {
  getHotTubLogs,
  getUsageLogs,
  getMaintenanceLogs,
  getWeeklyChecks,
} from "@/utils/offlineStorage";
import { arrayToCSV } from "../csvConverter";
import {
  DAILY_LOG_HEADERS,
  USAGE_LOG_HEADERS,
  MAINTENANCE_LOG_HEADERS,
  WEEKLY_CHECK_HEADERS,
} from "../csvHeaders";

/**
 * Export all data to CSV format
 */
export async function exportAllDataToCSV() {
  try {
    const [dailyLogs, usageLogs, maintenanceLogs, weeklyChecks] =
      await Promise.all([
        getHotTubLogs(),
        getUsageLogs(),
        getMaintenanceLogs(),
        getWeeklyChecks(),
      ]);

    // Convert each to CSV (only if there's data)
    const sections = [];

    if (dailyLogs.length > 0) {
      sections.push("=== DAILY_LOGS ===");
      sections.push(arrayToCSV(dailyLogs, DAILY_LOG_HEADERS));
    }

    if (usageLogs.length > 0) {
      sections.push("=== USAGE_LOGS ===");
      sections.push(arrayToCSV(usageLogs, USAGE_LOG_HEADERS));
    }

    if (maintenanceLogs.length > 0) {
      sections.push("=== MAINTENANCE_LOGS ===");
      sections.push(arrayToCSV(maintenanceLogs, MAINTENANCE_LOG_HEADERS));
    }

    if (weeklyChecks.length > 0) {
      sections.push("=== WEEKLY_CHECKS ===");
      sections.push(arrayToCSV(weeklyChecks, WEEKLY_CHECK_HEADERS));
    }

    // If no data at all, show error
    if (sections.length === 0) {
      Alert.alert(
        "No Data to Export",
        "There are no records to export. Add some logs first!",
        [{ text: "OK" }],
      );
      return false;
    }

    // Join sections with blank line separator
    const fullExport = sections.join("\n\n");

    // Generate filename
    const filename = `HTRecords.csv`;

    // Write file to cache directory
    const fileUri = FileSystem.cacheDirectory + filename;

    try {
      await FileSystem.writeAsStringAsync(fileUri, fullExport);
    } catch (writeError) {
      console.error("File write error:", writeError);
      // Try clipboard as fallback if file write fails
      try {
        await Clipboard.setStringAsync(fullExport);
        Alert.alert(
          "Export Successful",
          "Your data has been copied to the clipboard. You can paste it into a file and save as CSV",
          [{ text: "OK" }],
        );
        return true;
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        throw new Error(
          `Failed to save file and clipboard copy failed:\nFile error: ${writeError.message}\nClipboard error: ${clipboardError.message}`,
        );
      }
    }

    // Try to share the file
    try {
      const shareResult = await Share.share({
        url: fileUri,
        title: "Hot Tub Data Export",
      });

      // If share was successful, show success message
      if (shareResult.action === Share.sharedAction) {
        Alert.alert(
          "Export Successful",
          "Your data has been exported successfully!",
          [{ text: "OK" }],
        );
      }
      return true;
    } catch (shareError) {
      console.error("Share error:", shareError);

      // If sharing fails, try to copy to clipboard as fallback
      try {
        await Clipboard.setStringAsync(fullExport);
        Alert.alert(
          "Export Successful",
          "Your data has been copied to the clipboard. You can paste it into a file and save as CSV",
          [{ text: "OK" }],
        );
        return true;
      } catch (clipboardError) {
        console.error("Clipboard fallback error:", clipboardError);
        throw new Error(
          `Failed to share file and clipboard copy failed:\nShare error: ${shareError.message}\nClipboard error: ${clipboardError.message}`,
        );
      }
    }
  } catch (error) {
    console.error("Export error:", error);

    // Determine what failed and show specific error
    let errorMessage = "Unknown error occurred";
    if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert(
      "Export Failed",
      `Could not export data:\n\n${errorMessage}\n\nPlease try again.`,
      [{ text: "OK" }],
    );
    return false;
  }
}
