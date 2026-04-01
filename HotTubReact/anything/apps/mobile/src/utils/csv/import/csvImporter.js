import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { parseCsvSections } from "./csvParser";
import {
  importValidRecordsMerge,
  importValidRecordsReplace,
} from "./importHandler";
import {
  validateImportedData,
  getValidationSummary,
  getDetailedErrorReport,
} from "../validation/importValidator";

/**
 * Import data from CSV file with validation
 */
export async function importDataFromCSV() {
  try {
    // Pick a document
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return false;
    }

    // Read the file
    const response = await fetch(result.assets[0].uri);
    const csvContent = await response.text();

    // Parse CSV sections
    const { dailyLogs, usageLogs, maintenanceLogs, weeklyChecks } =
      parseCsvSections(csvContent);

    // Validate all imported data
    console.log("\n===== STARTING VALIDATION =====");
    const validationResults = validateImportedData(
      dailyLogs,
      usageLogs,
      maintenanceLogs,
      weeklyChecks,
    );

    console.log("Validation complete:", validationResults);

    const totalValid =
      validationResults.dailyLogs.valid.length +
      validationResults.usageLogs.valid.length +
      validationResults.maintenanceLogs.valid.length +
      validationResults.weeklyChecks.valid.length;

    const totalInvalid =
      validationResults.dailyLogs.invalid.length +
      validationResults.usageLogs.invalid.length +
      validationResults.maintenanceLogs.invalid.length +
      validationResults.weeklyChecks.invalid.length;

    console.log(`Total valid: ${totalValid}, Total invalid: ${totalInvalid}`);

    // If all records are invalid
    if (totalValid === 0 && totalInvalid > 0) {
      const errorPreview = getDetailedErrorReport(validationResults);
      Alert.alert("Import Failed - All Records Invalid", errorPreview, [
        { text: "OK" },
      ]);
      return false;
    }

    // If no records at all
    if (totalValid === 0 && totalInvalid === 0) {
      Alert.alert(
        "No Data Found",
        "The file doesn't contain any valid data to import. Please check the file format.",
        [{ text: "OK" }],
      );
      return false;
    }

    // Show validation summary with error preview
    const summary = getValidationSummary(validationResults, true); // Include errors in summary

    return new Promise((resolve) => {
      const buttons = [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
      ];

      // Add "View Errors" button if there are invalid records
      if (totalInvalid > 0) {
        buttons.push({
          text: "View Errors",
          onPress: () => {
            const errorReport = getDetailedErrorReport(validationResults);
            console.log("Showing error report:", errorReport);
            Alert.alert("Validation Errors", errorReport, [{ text: "OK" }]);
            // Don't resolve here - let user continue to see the original alert
          },
        });
      }

      // Add import options
      if (totalValid > 0) {
        buttons.push({
          text: totalInvalid > 0 ? "Skip Invalid" : "Merge",
          onPress: async () => {
            try {
              const { addedCount, skippedCount } =
                await importValidRecordsMerge(validationResults);

              let resultMessage = `Added ${addedCount} new records\nSkipped ${skippedCount} duplicates`;
              if (totalInvalid > 0) {
                resultMessage += `\nSkipped ${totalInvalid} invalid records`;
              }

              Alert.alert("Import Complete", resultMessage);
              resolve(true);
            } catch (error) {
              console.error("Import error:", error);
              Alert.alert(
                "Import Failed",
                "Could not import data. Please try again.",
              );
              resolve(false);
            }
          },
        });

        // Add "Replace All" button
        buttons.push({
          text: "Replace All",
          style: "destructive",
          onPress: async () => {
            try {
              const { totalValid: importedCount } =
                await importValidRecordsReplace(validationResults);

              let resultMessage = `Imported ${importedCount} valid records successfully!`;
              if (totalInvalid > 0) {
                resultMessage += `\n\nSkipped ${totalInvalid} invalid records`;
              }

              Alert.alert("Import Successful", resultMessage);
              resolve(true);
            } catch (error) {
              console.error("Import error:", error);
              Alert.alert(
                "Import Failed",
                "Could not import data. Please try again.",
              );
              resolve(false);
            }
          },
        });
      }

      Alert.alert("Import Validation", summary, buttons);
    });
  } catch (error) {
    console.error("Import error:", error);
    Alert.alert("Import Failed", "Could not read the file. Please try again.");
    return false;
  }
}
