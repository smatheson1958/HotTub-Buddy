import { useState } from "react";

export function useMonthNavigation() {
  const [viewMonth, setViewMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setViewMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    const currentMonth = new Date();
    const nextMonth = new Date(viewMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (nextMonth <= currentMonth) {
      setViewMonth(nextMonth);
    }
  };

  const goToCurrentMonth = () => {
    setViewMonth(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      viewMonth.getMonth() === now.getMonth() &&
      viewMonth.getFullYear() === now.getFullYear()
    );
  };

  return {
    viewMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  };
}
