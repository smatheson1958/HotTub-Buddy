import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { EmptyChartState } from "./EmptyChartState";
import { ChartSvg } from "./ChartSvg";
import { ChartLegend } from "./ChartLegend";
import { MonthStats } from "./MonthStats";
import { processChartData } from "./ChartDataProcessor";

const GRAPH_HEIGHT = 250;
const PADDING = 20;

export function CombinedChart({
  filteredLogs,
  filteredUsageLogs,
  userCountByDay,
  chartFilters,
  isBromine,
  hasDataInMonth,
  monthLabel,
  colors,
}) {
  const { width: screenWidth } = useWindowDimensions();

  const showChemicals = chartFilters.showChlorine || chartFilters.showPH;
  const showUsers = chartFilters.showUsers;

  if (!showChemicals && !showUsers) {
    return <EmptyChartState type="no-filters" colors={colors} />;
  }

  if (!hasDataInMonth) {
    return (
      <EmptyChartState type="no-data" monthLabel={monthLabel} colors={colors} />
    );
  }

  const chartData = processChartData(
    filteredLogs,
    userCountByDay,
    chartFilters,
    isBromine,
  );

  if (!chartData) {
    return <EmptyChartState type="insufficient-data" colors={colors} />;
  }

  const { dataPoints, chemicalMax, chemicalMin, chemicalRange, userMax } =
    chartData;

  const containerWidth = screenWidth - PADDING * 2;

  return (
    <View style={{ marginBottom: 32 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          Water Quality & Usage
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ height: GRAPH_HEIGHT, width: containerWidth }}>
          <ChartSvg
            dataPoints={dataPoints}
            chemicalMax={chemicalMax}
            chemicalMin={chemicalMin}
            chemicalRange={chemicalRange}
            userMax={userMax}
            chartFilters={chartFilters}
            isBromine={isBromine}
            colors={colors}
          />
        </View>

        <ChartLegend
          chartFilters={chartFilters}
          isBromine={isBromine}
          colors={colors}
        />
      </View>

      {hasDataInMonth && (
        <MonthStats
          filteredLogs={filteredLogs}
          filteredUsageLogs={filteredUsageLogs}
          colors={colors}
        />
      )}
    </View>
  );
}
