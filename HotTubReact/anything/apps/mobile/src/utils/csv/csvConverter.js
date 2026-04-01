/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data, headers) {
  if (!data || data.length === 0) return "";

  // Create header row
  const headerRow = headers.join(",");

  // Create data rows
  const rows = data.map((item) => {
    return headers
      .map((header) => {
        let value = item[header];

        // Handle null/undefined
        if (value === null || value === undefined) {
          return "";
        }

        // Convert to string
        value = String(value);

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n")
        ) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }

        return value;
      })
      .join(",");
  });

  return [headerRow, ...rows].join("\n");
}

/**
 * Parse CSV string to array of objects
 */
export function parseCSV(csvString, headers) {
  console.log("parseCSV called with headers:", headers);
  console.log("CSV string length:", csvString.length);
  console.log("First 200 chars:", csvString.substring(0, 200));

  // Check if CSV is JSON-encoded (wrapped in quotes with escaped quotes)
  // This happens when the file is saved as a JSON string instead of plain text
  if (csvString.trim().startsWith('"') || csvString.includes('\\"')) {
    console.log("Detected JSON-encoded CSV, unescaping...");
    try {
      // Split by newlines and try to parse each line as JSON
      const lines = csvString.trim().split("\n");
      const unescapedLines = lines.map((line) => {
        const trimmed = line.trim();
        // If line starts and ends with quotes, try to parse as JSON string
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {
            // If JSON parse fails, return original
            return trimmed;
          }
        }
        return trimmed;
      });
      csvString = unescapedLines.join("\n");
      console.log(
        "Unescaped CSV, first 200 chars:",
        csvString.substring(0, 200),
      );
    } catch (e) {
      console.log(
        "Failed to unescape JSON-encoded CSV, continuing with original:",
        e,
      );
    }
  }

  const lines = csvString.trim().split("\n");
  console.log("Total lines after split:", lines.length);

  // First, filter out empty lines and comma-only separator lines
  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim();
    // Filter out empty lines
    if (trimmed.length === 0) return false;
    // Filter out lines that only contain commas (separator lines)
    if (trimmed.replace(/,/g, "").length === 0) return false;
    // Filter out lines that are just whitespace
    if (/^\s*$/.test(trimmed)) return false;
    return true;
  });

  console.log("Cleaned lines count:", cleanedLines.length);
  console.log("Cleaned lines:", cleanedLines);

  if (cleanedLines.length < 2) {
    console.log(
      "Not enough lines (need at least header + 1 data row), returning empty array",
    );
    return [];
  }

  // Now skip the header row (first line after filtering)
  const dataLines = cleanedLines.slice(1);
  console.log("Data lines (after removing header):", dataLines.length);

  const parsedRecords = dataLines
    .map((line, lineIndex) => {
      const values = [];
      let currentValue = "";
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (insideQuotes && line[i + 1] === '"') {
            // Escaped quote
            currentValue += '"';
            i++;
          } else {
            // Toggle quote state
            insideQuotes = !insideQuotes;
          }
        } else if (char === "," && !insideQuotes) {
          // End of field
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      // Add last value
      values.push(currentValue);

      console.log(`Line ${lineIndex + 1} parsed values:`, values);

      // Map values to object
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || "";

        // Convert empty strings to null
        if (value === "") {
          obj[header] = null;
        } else if (value === "true") {
          obj[header] = true;
        } else if (value === "false") {
          obj[header] = false;
        } else if (!isNaN(value) && value !== "") {
          // Try to convert to number
          obj[header] = parseFloat(value);
        } else {
          obj[header] = value;
        }
      });

      console.log(`Line ${lineIndex + 1} object:`, obj);
      return obj;
    })
    .filter((record) => {
      // Filter out records where all values are null (empty rows)
      const hasData = Object.values(record).some((value) => value !== null);
      if (!hasData) {
        console.log("Filtered out empty record:", record);
      }
      return hasData;
    });

  console.log("Final parsed records:", parsedRecords.length);
  return parsedRecords;
}
