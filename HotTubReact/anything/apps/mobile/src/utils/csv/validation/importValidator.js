import {
  validateDailyLogRecord,
  validateUsageLogRecord,
  validateMaintenanceLogRecord,
  validateWeeklyCheckRecord,
} from "./recordValidators";

/**
 * Validate all imported records before importing
 */
export function validateImportedData(
  dailyLogs,
  usageLogs,
  maintenanceLogs,
  weeklyChecks,
) {
  const validationResults = {
    dailyLogs: { valid: [], invalid: [], errors: [] },
    usageLogs: { valid: [], invalid: [], errors: [] },
    maintenanceLogs: { valid: [], invalid: [], errors: [] },
    weeklyChecks: { valid: [], invalid: [], errors: [] },
  };

  // Validate daily logs
  dailyLogs.forEach((record, index) => {
    const rowNumber = index + 2; // +2 because row 1 is header
    const errors = validateDailyLogRecord(record, rowNumber);
    if (errors.length > 0) {
      validationResults.dailyLogs.invalid.push({ record, rowNumber, errors });
      validationResults.dailyLogs.errors.push(...errors);
    } else {
      validationResults.dailyLogs.valid.push(record);
    }
  });

  // Validate usage logs
  usageLogs.forEach((record, index) => {
    const rowNumber = index + 2;
    const errors = validateUsageLogRecord(record, rowNumber);
    if (errors.length > 0) {
      validationResults.usageLogs.invalid.push({ record, rowNumber, errors });
      validationResults.usageLogs.errors.push(...errors);
    } else {
      validationResults.usageLogs.valid.push(record);
    }
  });

  // Validate maintenance logs
  maintenanceLogs.forEach((record, index) => {
    const rowNumber = index + 2;
    const errors = validateMaintenanceLogRecord(record, rowNumber);
    if (errors.length > 0) {
      validationResults.maintenanceLogs.invalid.push({
        record,
        rowNumber,
        errors,
      });
      validationResults.maintenanceLogs.errors.push(...errors);
    } else {
      validationResults.maintenanceLogs.valid.push(record);
    }
  });

  // Validate weekly checks
  weeklyChecks.forEach((record, index) => {
    const rowNumber = index + 2;
    const errors = validateWeeklyCheckRecord(record, rowNumber);
    if (errors.length > 0) {
      validationResults.weeklyChecks.invalid.push({
        record,
        rowNumber,
        errors,
      });
      validationResults.weeklyChecks.errors.push(...errors);
    } else {
      validationResults.weeklyChecks.valid.push(record);
    }
  });

  return validationResults;
}

/**
 * Generate a validation summary message with error preview
 */
export function getValidationSummary(validationResults, includeErrors = false) {
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

  let summary = `Validation Results:\n\n`;
  summary += `✓ Valid Records: ${totalValid}\n`;
  summary += `✗ Invalid Records: ${totalInvalid}\n\n`;

  if (totalValid > 0) {
    summary += `Valid:\n`;
    if (validationResults.dailyLogs.valid.length > 0) {
      summary += `  • ${validationResults.dailyLogs.valid.length} daily logs\n`;
    }
    if (validationResults.usageLogs.valid.length > 0) {
      summary += `  • ${validationResults.usageLogs.valid.length} usage logs\n`;
    }
    if (validationResults.maintenanceLogs.valid.length > 0) {
      summary += `  • ${validationResults.maintenanceLogs.valid.length} maintenance logs\n`;
    }
    if (validationResults.weeklyChecks.valid.length > 0) {
      summary += `  • ${validationResults.weeklyChecks.valid.length} weekly checks\n`;
    }
  }

  if (totalInvalid > 0) {
    summary += `\nInvalid:\n`;
    if (validationResults.dailyLogs.invalid.length > 0) {
      summary += `  • ${validationResults.dailyLogs.invalid.length} daily logs\n`;
    }
    if (validationResults.usageLogs.invalid.length > 0) {
      summary += `  • ${validationResults.usageLogs.invalid.length} usage logs\n`;
    }
    if (validationResults.maintenanceLogs.invalid.length > 0) {
      summary += `  • ${validationResults.maintenanceLogs.invalid.length} maintenance logs\n`;
    }
    if (validationResults.weeklyChecks.invalid.length > 0) {
      summary += `  • ${validationResults.weeklyChecks.invalid.length} weekly checks\n`;
    }

    // Include error preview if requested
    if (includeErrors) {
      const allErrors = [
        ...validationResults.dailyLogs.errors,
        ...validationResults.usageLogs.errors,
        ...validationResults.maintenanceLogs.errors,
        ...validationResults.weeklyChecks.errors,
      ];

      if (allErrors.length > 0) {
        summary += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        summary += `Error Details:\n\n`;
        // Show first 10 errors
        const errorsToShow = allErrors.slice(0, 10);
        summary += errorsToShow.join("\n");
        if (allErrors.length > 10) {
          summary += `\n\n...and ${allErrors.length - 10} more errors`;
        }
      }
    }
  }

  return summary;
}

/**
 * Get detailed error report
 */
export function getDetailedErrorReport(validationResults) {
  const allErrors = [
    ...validationResults.dailyLogs.errors,
    ...validationResults.usageLogs.errors,
    ...validationResults.maintenanceLogs.errors,
    ...validationResults.weeklyChecks.errors,
  ];

  console.log("All errors:", allErrors);
  console.log("Error count:", allErrors.length);
  console.log(
    "Validation results:",
    JSON.stringify(validationResults, null, 2),
  );

  if (allErrors.length === 0) {
    return "No validation errors found.";
  }

  let report = "Validation Errors:\n\n";

  // Show first 20 errors (to avoid extremely long alerts)
  const errorsToShow = allErrors.slice(0, 20);
  report += errorsToShow.join("\n");

  if (allErrors.length > 20) {
    report += `\n\n... and ${allErrors.length - 20} more errors`;
  }

  console.log("Error report:", report);
  return report;
}
