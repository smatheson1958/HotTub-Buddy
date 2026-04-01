import React from "react";
import { View, Text } from "react-native";

export function ChartLegend({ chartFilters, isBromine, colors }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      {chartFilters.showChlorine && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.primary,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            {isBromine ? "Bromine" : "Free Chlorine"}
          </Text>
        </View>
      )}
      {chartFilters.showPH && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.success,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            pH Level
          </Text>
        </View>
      )}
      {chartFilters.showUsers && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: colors.warning + "60",
            }}
          />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            User Count
          </Text>
        </View>
      )}
    </View>
  );
}
