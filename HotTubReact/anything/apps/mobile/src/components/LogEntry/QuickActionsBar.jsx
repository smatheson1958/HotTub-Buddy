import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuickActionsBar({
  onTodayPress,
  onYesterdayPress,
  onLastWeekPress,
  colors,
}) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: colors.textSecondary,
          marginBottom: 8,
        }}
      >
        Quick Actions
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={onTodayPress}
          style={{
            flex: 1,
            backgroundColor: colors.primary + "15",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginRight: 6,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onYesterdayPress}
          style={{
            flex: 1,
            backgroundColor: colors.primary + "15",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginHorizontal: 3,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Yesterday
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLastWeekPress}
          style={{
            flex: 1,
            backgroundColor: colors.primary + "15",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginLeft: 6,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Last Week
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
