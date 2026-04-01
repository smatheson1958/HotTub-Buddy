import { useState } from "react";

export function useChartFilters() {
  const [chartFilters, setChartFilters] = useState({
    showChlorine: true,
    showPH: true,
    showUsers: true,
  });

  const toggleFilter = (filterName) => {
    setChartFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return {
    chartFilters,
    toggleFilter,
  };
}
