import React from "react";
import { View, Text } from "react-native";
import { Info, Calendar } from "lucide-react-native";

const GRAPH_HEIGHT = 250;

export function EmptyChartState({ type, monthLabel, colors }) {
  if (type === "no-filters") {
    return (
      <View
        style={{
          height: GRAPH_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 32,
        }}
      >
        <Info size={24} color={colors.textTertiary} />
        <Text
          style={{
            color: colors.textTertiary,
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          Select at least one filter to view data
        </Text>
      </View>
    );
  }

  if (type === "no-data") {
    return (
      <View
        style={{
          height: GRAPH_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 32,
        }}
      >
        <Calendar size={48} color={colors.textTertiary} />
        <Text
          style={{
            color: colors.textTertiary,
            marginTop: 8,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          No data for {monthLabel}
        </Text>
        <Text
          style={{ color: colors.textTertiary, marginTop: 4, fontSize: 12 }}
        >
          Add logs to see charts
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: GRAPH_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 32,
      }}
    >
      <Info size={24} color={colors.textTertiary} />
      <Text style={{ color: colors.textTertiary, marginTop: 8 }}>
        Need data to show graph
      </Text>
    </View>
  );
}
