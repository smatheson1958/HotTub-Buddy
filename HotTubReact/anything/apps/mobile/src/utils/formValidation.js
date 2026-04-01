// Validation utility for hot tub log forms

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

/**
 * Validate a numeric value is within range
 */
export const isInRange = (value, min, max) => {
  if (value === null || value === undefined || value === "") return true; // Allow empty
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (num < min || num > max) return false;
  return true;
};

/**
 * Validate a numeric value is non-negative
 */
export const isNonNegative = (value) => {
  if (value === null || value === undefined || value === "") return true; // Allow empty
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= 0;
};

/**
 * Individual field validators - return error message or null
 */

export const validateField = {
  // Date validation
  date: (value) => {
    if (!value) return null;
    if (isFutureDate(value)) {
      return "Cannot log data for a future date";
    }
    return null;
  },

  // pH validation (0-14)
  ph: (value) => {
    if (!value) return null;
    if (!isInRange(value, 0, 14)) {
      return "pH must be between 0 and 14";
    }
    return null;
  },

  // Chlorine/Bromine validation (0-20 ppm)
  chlorine: (value) => {
    if (!value) return null;
    if (!isInRange(value, 0, 20)) {
      return "Value must be between 0 and 20 ppm";
    }
    return null;
  },

  // Added chemicals validation (non-negative)
  addedChemical: (value) => {
    if (!value) return null;
    if (!isNonNegative(value)) {
      return "Amount cannot be negative";
    }
    return null;
  },

  // Total alkalinity validation (0-300 ppm)
  totalAlkalinity: (value) => {
    if (!value) return null;
    if (!isInRange(value, 0, 300)) {
      return "Total alkalinity must be between 0 and 300 ppm";
    }
    return null;
  },

  // Copper validation (0-5 ppm)
  copper: (value) => {
    if (!value) return null;
    if (!isInRange(value, 0, 5)) {
      return "Copper must be between 0 and 5 ppm";
    }
    return null;
  },

  // Shock added validation (non-negative)
  shock: (value) => {
    if (!value) return null;
    if (!isNonNegative(value)) {
      return "Shock amount cannot be negative";
    }
    return null;
  },

  // Shock type validation
  shockType: (value, shockAdded) => {
    // Optional if no shock added
    if (!shockAdded || parseFloat(shockAdded) === 0) return null;

    // Suggest selecting type if shock was added (not required, just a suggestion)
    if (!value) {
      return null; // We won't make this a hard error, just a suggestion in UI
    }
    return null;
  },

  // Alkalinity Up added validation (non-negative)
  alkalinityUp: (value) => {
    if (!value) return null;
    if (!isNonNegative(value)) {
      return "Alkalinity Up amount cannot be negative";
    }
    return null;
  },

  // Maintenance action validation
  action: (value) => {
    if (!value || value.trim().length === 0) {
      return "Please enter a maintenance action";
    }
    return null;
  },
};

/**
 * Validate daily log form
 */
export const validateDailyLog = (formData) => {
  const errors = [];

  // Check for future date
  if (isFutureDate(formData.log_date)) {
    errors.push("Cannot log data for a future date");
  }

  // Validate pH (0-14)
  if (!isInRange(formData.ph, 0, 14)) {
    errors.push("pH must be between 0 and 14");
  }

  // Validate chlorine values (0-20 ppm)
  if (!isInRange(formData.chlorine_1, 0, 20)) {
    errors.push("Free chlorine/Bromine must be between 0 and 20 ppm");
  }
  if (!isInRange(formData.chlorine_2, 0, 20)) {
    errors.push("Combined chlorine must be between 0 and 20 ppm");
  }
  if (!isInRange(formData.chlorine_3, 0, 20)) {
    errors.push("Total chlorine must be between 0 and 20 ppm");
  }

  // Validate added chemicals (non-negative)
  if (!isNonNegative(formData.added_chlorine)) {
    errors.push("Added chlorine/bromine cannot be negative");
  }
  if (!isNonNegative(formData.added_ph_up)) {
    errors.push("pH Up amount cannot be negative");
  }
  if (!isNonNegative(formData.added_ph_down)) {
    errors.push("pH Down amount cannot be negative");
  }

  // Require at least one measurement field
  const hasAnyMeasurement =
    formData.ph ||
    formData.chlorine_1 ||
    formData.chlorine_2 ||
    formData.chlorine_3 ||
    formData.water_temperature ||
    formData.added_chlorine ||
    formData.added_ph_up ||
    formData.added_ph_down;

  if (!hasAnyMeasurement) {
    errors.push(
      "Please enter at least one measurement (pH, chlorine, temperature, or chemicals added)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate usage log form
 */
export const validateUsageLog = (formData) => {
  const errors = [];

  // Check for future date
  if (isFutureDate(formData.usage_date)) {
    errors.push("Cannot log usage for a future date");
  }

  // num_users and duration_minutes are already validated by picker (always valid values)

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate weekly check form
 */
export const validateWeeklyCheck = (formData) => {
  const errors = [];

  // Check for future date
  if (isFutureDate(formData.log_date)) {
    errors.push("Cannot log data for a future date");
  }

  // Validate total alkalinity (0-300 ppm typical range)
  if (!isInRange(formData.total_alkalinity, 0, 300)) {
    errors.push("Total alkalinity must be between 0 and 300 ppm");
  }

  // Validate copper (0-5 ppm)
  if (!isInRange(formData.copper, 0, 5)) {
    errors.push("Copper must be between 0 and 5 ppm");
  }

  // Validate shock added (non-negative)
  if (!isNonNegative(formData.shock_added)) {
    errors.push("Shock amount cannot be negative");
  }

  // Require at least one field
  const hasAnyField =
    formData.total_alkalinity ||
    formData.copper ||
    formData.shock_added ||
    formData.filter_cleaned;

  if (!hasAnyField) {
    errors.push(
      "Please enter at least one value (alkalinity, copper, shock, or filter cleaned)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate maintenance log form
 */
export const validateMaintenanceLog = (formData) => {
  const errors = [];

  // Check for future date
  if (isFutureDate(formData.log_date)) {
    errors.push("Cannot log maintenance for a future date");
  }

  // Require action field
  if (!formData.action || formData.action.trim().length === 0) {
    errors.push("Please enter a maintenance action");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
