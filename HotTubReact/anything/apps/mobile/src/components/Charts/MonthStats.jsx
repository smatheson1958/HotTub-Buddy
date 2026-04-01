import React from "react";
import { View, Text } from "react-native";

export function MonthStats({ filteredLogs, filteredUsageLogs, colors }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
        <Text style={{ fontWeight: "600", color: colors.text }}>
          This month:{" "}
        </Text>
        {filteredLogs.length} chemical test
        {filteredLogs.length !== 1 ? "s" : ""} • {filteredUsageLogs.length}{" "}
        usage session
        {filteredUsageLogs.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}
