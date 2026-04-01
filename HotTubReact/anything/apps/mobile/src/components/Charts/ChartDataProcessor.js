export function processChartData(
  filteredLogs,
  userCountByDay,
  chartFilters,
  isBromine,
) {
  // Combine all dates from both sources
  const allDates = new Set();
  filteredLogs.forEach((l) => allDates.add(l.log_date));
  Object.keys(userCountByDay).forEach((d) => allDates.add(d));

  const sortedDates = Array.from(allDates).sort();

  if (sortedDates.length < 1) {
    return null;
  }

  // Build data points
  const dataPoints = sortedDates.map((date) => {
    const logEntry = filteredLogs.find((l) => l.log_date === date);
    const userCount = userCountByDay[date] || 0;

    return {
      date,
      chlorine: logEntry?.sanitizer_free || null,
      ph: logEntry?.ph || null,
      users: userCount,
    };
  });

  // Scale for chemical levels (left axis)
  let chemicalValues = [];
  if (chartFilters.showChlorine) {
    chemicalValues.push(
      ...dataPoints.map((d) => d.chlorine).filter((v) => v !== null),
    );
  }
  if (chartFilters.showPH) {
    chemicalValues.push(
      ...dataPoints.map((d) => d.ph).filter((v) => v !== null),
    );
  }

  // Add ideal ranges to ensure they're visible
  if (chartFilters.showChlorine) {
    chemicalValues.push(isBromine ? 3.0 : 1.0);
    chemicalValues.push(isBromine ? 5.0 : 3.0);
  }
  if (chartFilters.showPH) {
    chemicalValues.push(7.2, 7.8);
  }

  const chemicalMax =
    chemicalValues.length > 0 ? Math.max(...chemicalValues, 1) : 10;
  const chemicalMin =
    chemicalValues.length > 0 ? Math.max(0, Math.min(...chemicalValues, 0)) : 0;
  const chemicalRange = chemicalMax - chemicalMin || 1;

  // Scale for user count (right axis)
  const userValues = dataPoints.map((d) => d.users).filter((v) => v > 0);
  const userMax = userValues.length > 0 ? Math.max(...userValues) : 10;

  return {
    dataPoints,
    chemicalMax,
    chemicalMin,
    chemicalRange,
    userMax,
  };
}
