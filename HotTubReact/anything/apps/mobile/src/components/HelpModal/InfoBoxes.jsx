import React from "react";
import { View, Text } from "react-native";

export function IdealRange({ label, value, colors }) {
  return (
    <View
      style={{
        backgroundColor: colors.success + "15",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.success,
      }}
    >
      <Text
        style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2 }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "700", color: colors.success }}>
        {value}
      </Text>
    </View>
  );
}

export function WarningBox({ children, colors }) {
  return (
    <View
      style={{
        backgroundColor: colors.notification + "10",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.notification,
      }}
    >
      <Text
        style={{ fontSize: 13, lineHeight: 18, color: colors.notification }}
      >
        {children}
      </Text>
    </View>
  );
}

export function InfoBox({ children, colors }) {
  return (
    <View
      style={{
        backgroundColor: colors.primary + "10",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
      }}
    >
      <Text style={{ fontSize: 13, lineHeight: 18, color: colors.primary }}>
        {children}
      </Text>
    </View>
  );
}
