import { validateField } from "@/utils/formValidation";
import { SHOCK_TYPES_BY_SANITIZER } from "@/utils/shockTypes";

/**
 * Get all valid shock type values
 */
function getAllValidShockTypes() {
  const allTypes = [];
  Object.values(SHOCK_TYPES_BY_SANITIZER).forEach((types) => {
    types.forEach((type) => {
      if (!allTypes.includes(type.value)) {
        allTypes.push(type.value);
      }
    });
  });
  return allTypes;
}

/**
 * Validate a single daily log record
 */
export function validateDailyLogRecord(record, rowNumber) {
  const errors = [];

  // Validate date format
  if (!record.log_date || !/^\d{4}-\d{2}-\d{2}$/.test(record.log_date)) {
    errors.push(`Row ${rowNumber}: Invalid date format (expected YYYY-MM-DD)`);
  }

  // Validate time format (optional)
  if (record.log_time && !/^\d{2}:\d{2}(:\d{2})?$/.test(record.log_time)) {
    errors.push(`Row ${rowNumber}: Invalid time format (expected HH:MM)`);
  }

  // Validate pH
  const phError = validateField.ph(record.ph);
  if (phError && record.ph !== null) {
    errors.push(`Row ${rowNumber}: pH - ${phError}`);
  }

  // Validate sanitizer values
  const sanitizerFreeError = validateField.chlorine(record.sanitizer_free);
  if (sanitizerFreeError && record.sanitizer_free !== null) {
    errors.push(`Row ${rowNumber}: Free Sanitizer - ${sanitizerFreeError}`);
  }

  const sanitizerCombinedError = validateField.chlorine(
    record.sanitizer_combined_or_total,
  );
  if (sanitizerCombinedError && record.sanitizer_combined_or_total !== null) {
    errors.push(
      `Row ${rowNumber}: Combined/Total Sanitizer - ${sanitizerCombinedError}`,
    );
  }

  // Validate added chemicals
  const sanitizerAddedError = validateField.addedChemical(
    record.added_sanitizer,
  );
  if (sanitizerAddedError && record.added_sanitizer !== null) {
    errors.push(`Row ${rowNumber}: Sanitizer Added - ${sanitizerAddedError}`);
  }

  const phUpError = validateField.addedChemical(record.added_ph_up);
  if (phUpError && record.added_ph_up !== null) {
    errors.push(`Row ${rowNumber}: pH Up Added - ${phUpError}`);
  }

  const phDownError = validateField.addedChemical(record.added_ph_down);
  if (phDownError && record.added_ph_down !== null) {
    errors.push(`Row ${rowNumber}: pH Down Added - ${phDownError}`);
  }

  // Validate temperature (reasonable range: 10-50°C or 50-122°F)
  if (record.water_temperature !== null) {
    const temp = parseFloat(record.water_temperature);
    if (isNaN(temp) || temp < 10 || temp > 122) {
      errors.push(
        `Row ${rowNumber}: Water temperature out of reasonable range (10-122)`,
      );
    }
  }

  // Check if at least one measurement is present
  const hasAnyMeasurement =
    record.ph ||
    record.sanitizer_free ||
    record.sanitizer_combined_or_total ||
    record.water_temperature ||
    record.added_sanitizer ||
    record.added_ph_up ||
    record.added_ph_down;

  if (!hasAnyMeasurement) {
    errors.push(`Row ${rowNumber}: No measurements provided`);
  }

  return errors;
}

/**
 * Validate a single usage log record
 */
export function validateUsageLogRecord(record, rowNumber) {
  const errors = [];

  // Validate date format
  if (!record.usage_date || !/^\d{4}-\d{2}-\d{2}$/.test(record.usage_date)) {
    errors.push(`Row ${rowNumber}: Invalid date format (expected YYYY-MM-DD)`);
  }

  // Validate time format
  if (!record.usage_time || !/^\d{2}:\d{2}(:\d{2})?$/.test(record.usage_time)) {
    errors.push(`Row ${rowNumber}: Invalid time format (expected HH:MM)`);
  }

  // Validate num_users (1-10)
  if (record.num_users !== null) {
    const numUsers = parseInt(record.num_users);
    if (isNaN(numUsers) || numUsers < 1 || numUsers > 10) {
      errors.push(`Row ${rowNumber}: Number of users must be between 1 and 10`);
    }
  } else {
    errors.push(`Row ${rowNumber}: Number of users is required`);
  }

  // Validate duration (positive number)
  if (record.duration_minutes !== null) {
    const duration = parseInt(record.duration_minutes);
    if (isNaN(duration) || duration <= 0) {
      errors.push(`Row ${rowNumber}: Duration must be a positive number`);
    }
  } else {
    errors.push(`Row ${rowNumber}: Duration is required`);
  }

  // Validate temperature (optional, reasonable range)
  if (record.water_temperature !== null) {
    const temp = parseFloat(record.water_temperature);
    if (isNaN(temp) || temp < 10 || temp > 122) {
      errors.push(
        `Row ${rowNumber}: Water temperature out of reasonable range (10-122)`,
      );
    }
  }

  return errors;
}

/**
 * Validate a single maintenance log record
 */
export function validateMaintenanceLogRecord(record, rowNumber) {
  const errors = [];

  // Validate date format
  if (!record.log_date || !/^\d{4}-\d{2}-\d{2}$/.test(record.log_date)) {
    errors.push(`Row ${rowNumber}: Invalid date format (expected YYYY-MM-DD)`);
  }

  // Validate time format (optional)
  if (record.log_time && !/^\d{2}:\d{2}(:\d{2})?$/.test(record.log_time)) {
    errors.push(`Row ${rowNumber}: Invalid time format (expected HH:MM)`);
  }

  // Validate action field (required if filter_changed is false)
  if (
    !record.filter_changed &&
    (!record.action || record.action.trim().length === 0)
  ) {
    errors.push(`Row ${rowNumber}: Action is required`);
  }

  return errors;
}

/**
 * Validate a single weekly check record
 */
export function validateWeeklyCheckRecord(record, rowNumber) {
  const errors = [];

  // Validate date format
  if (!record.log_date || !/^\d{4}-\d{2}-\d{2}$/.test(record.log_date)) {
    errors.push(`Row ${rowNumber}: Invalid date format (expected YYYY-MM-DD)`);
  }

  // Validate time format (optional)
  if (record.log_time && !/^\d{2}:\d{2}(:\d{2})?$/.test(record.log_time)) {
    errors.push(`Row ${rowNumber}: Invalid time format (expected HH:MM)`);
  }

  // Validate total alkalinity
  const alkalinityError = validateField.totalAlkalinity(
    record.total_alkalinity,
  );
  if (alkalinityError && record.total_alkalinity !== null) {
    errors.push(`Row ${rowNumber}: Total Alkalinity - ${alkalinityError}`);
  }

  // Validate copper
  const copperError = validateField.copper(record.copper);
  if (copperError && record.copper !== null) {
    errors.push(`Row ${rowNumber}: Copper - ${copperError}`);
  }

  // Validate shock added
  const shockError = validateField.shock(record.shock_added);
  if (shockError && record.shock_added !== null) {
    errors.push(`Row ${rowNumber}: Shock Added - ${shockError}`);
  }

  // Validate alkalinity up added
  const alkalinityUpError = validateField.alkalinityUp(
    record.alkalinity_up_added,
  );
  if (alkalinityUpError && record.alkalinity_up_added !== null) {
    errors.push(`Row ${rowNumber}: Alkalinity Up Added - ${alkalinityUpError}`);
  }

  // Validate shock type (if provided, must be valid)
  if (record.shock_type && record.shock_type.trim().length > 0) {
    const validTypes = getAllValidShockTypes();
    if (!validTypes.includes(record.shock_type)) {
      errors.push(
        `Row ${rowNumber}: Invalid shock type (must be one of: ${validTypes.join(", ")})`,
      );
    }
  }

  // Check if at least one field is present
  const hasAnyField =
    record.total_alkalinity ||
    record.copper ||
    record.shock_added ||
    record.filter_cleaned ||
    record.alkalinity_up_added;

  if (!hasAnyField) {
    errors.push(`Row ${rowNumber}: No data provided`);
  }

  return errors;
}
