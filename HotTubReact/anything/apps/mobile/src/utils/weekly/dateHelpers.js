import { format, parseISO, isValid } from "date-fns";

/**
 * Helper function to safely format dates
 * @param {string} dateString - The date string to format
 * @param {string} formatStr - The format string (default: "dd MMM yy")
 * @returns {string} - The formatted date string or the original string if invalid
 */
export const safeFormatDate = (dateString, formatStr = "dd MMM yy") => {
  if (!dateString) return "";
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatStr);
  } catch (e) {
    console.error("Date formatting error:", e, "for date:", dateString);
    return dateString;
  }
};
