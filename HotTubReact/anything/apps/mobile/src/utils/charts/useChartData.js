import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHotTubLogs,
  getUsageLogs,
  getSettings,
} from "@/utils/offlineStorage";

export function useChartData(viewMonth) {
  const {
    data: logs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
    isRefetching: isRefetchingLogs,
  } = useQuery({
    queryKey: ["hot-tub-logs"],
    queryFn: async () => {
      const data = await getHotTubLogs();
      return data.sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
    },
  });

  const {
    data: usageLogs = [],
    isLoading: isLoadingUsage,
    refetch: refetchUsage,
    isRefetching: isRefetchingUsage,
  } = useQuery({
    queryKey: ["usage-logs"],
    queryFn: getUsageLogs,
  });

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const sanitizerType = settings?.sanitizer_type || "chlorine";
  const isBromine = sanitizerType === "bromine";

  // Helper function to get month range
  const getMonthRange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
      label: new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date),
    };
  };

  // Filter logs by selected month
  const filteredLogs = useMemo(() => {
    const { start, end } = getMonthRange(viewMonth);
    return logs.filter((log) => {
      return log.log_date >= start && log.log_date <= end;
    });
  }, [logs, viewMonth]);

  const filteredUsageLogs = useMemo(() => {
    const { start, end } = getMonthRange(viewMonth);
    return usageLogs.filter((log) => {
      return log.usage_date >= start && log.usage_date <= end;
    });
  }, [usageLogs, viewMonth]);

  // Aggregate user count by day
  const userCountByDay = useMemo(() => {
    const counts = {};
    filteredUsageLogs.forEach((log) => {
      const date = log.usage_date;
      counts[date] = (counts[date] || 0) + (log.num_users || 0);
    });
    return counts;
  }, [filteredUsageLogs]);

  const isLoading = isLoadingLogs || isLoadingUsage;
  const isRefetching = isRefetchingLogs || isRefetchingUsage;

  const refetchAll = () => {
    refetchLogs();
    refetchUsage();
  };

  const hasDataInMonth =
    filteredLogs.length > 0 || filteredUsageLogs.length > 0;
  const { label: monthLabel } = getMonthRange(viewMonth);

  return {
    filteredLogs,
    filteredUsageLogs,
    userCountByDay,
    isLoading,
    isRefetching,
    refetchAll,
    hasDataInMonth,
    monthLabel,
    isBromine,
  };
}
