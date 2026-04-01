/**
 * CSV headers for each data type
 */
export const DAILY_LOG_HEADERS = [
  "log_date",
  "log_time",
  "water_temperature",
  "ph",
  "sanitizer_free",
  "sanitizer_combined_or_total",
  "added_sanitizer",
  "added_ph_up",
  "added_ph_down",
  "notes",
];

export const USAGE_LOG_HEADERS = [
  "usage_date",
  "usage_time",
  "num_users",
  "duration_minutes",
  "water_temperature",
];

export const MAINTENANCE_LOG_HEADERS = [
  "log_date",
  "log_time",
  "action",
  "notes",
  "filter_changed",
];

export const WEEKLY_CHECK_HEADERS = [
  "log_date",
  "log_time",
  "total_alkalinity",
  "copper",
  "shock_added",
  "shock_type",
  "alkalinity_up_added",
  "filter_cleaned",
  "notes",
];
