import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useTheme from "@/utils/useTheme";
import { useChartData } from "@/utils/charts/useChartData";
import { useMonthNavigation } from "@/utils/charts/useMonthNavigation";
import { useChartFilters } from "@/utils/charts/useChartFilters";
import { MonthNavigation } from "@/components/Charts/MonthNavigation";
import { ChartFilterToggles } from "@/components/Charts/ChartFilterToggles";
import { CombinedChart } from "@/components/Charts/CombinedChart";
import { GuideSection } from "@/components/Charts/GuideSection";

export default function ChartsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const {
    viewMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  } = useMonthNavigation();

  const { chartFilters, toggleFilter } = useChartFilters();

  const {
    filteredLogs,
    filteredUsageLogs,
    userCountByDay,
    isLoading,
    isRefetching,
    refetchAll,
    hasDataInMonth,
    monthLabel,
    isBromine,
  } = useChartData(viewMonth);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceHighest }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchAll}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              fontWeight: "500",
            }}
          >
            Analytics
          </Text>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            Water Quality Trends
          </Text>
        </View>

        <MonthNavigation
          monthLabel={monthLabel}
          isCurrentMonth={isCurrentMonth()}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          onCurrentMonth={goToCurrentMonth}
          colors={colors}
        />

        <ChartFilterToggles
          chartFilters={chartFilters}
          onToggleFilter={toggleFilter}
          isBromine={isBromine}
          colors={colors}
        />

        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <CombinedChart
              filteredLogs={filteredLogs}
              filteredUsageLogs={filteredUsageLogs}
              userCountByDay={userCountByDay}
              chartFilters={chartFilters}
              isBromine={isBromine}
              hasDataInMonth={hasDataInMonth}
              monthLabel={monthLabel}
              colors={colors}
            />

            {chartFilters.showChlorine && (
              <GuideSection
                type="chlorine"
                isBromine={isBromine}
                colors={colors}
              />
            )}

            {chartFilters.showPH && <GuideSection type="ph" colors={colors} />}

            {chartFilters.showUsers && (
              <GuideSection type="users" colors={colors} />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
