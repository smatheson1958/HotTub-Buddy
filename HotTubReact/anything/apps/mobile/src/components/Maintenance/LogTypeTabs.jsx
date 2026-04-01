import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wrench, Calendar as CalendarIcon } from "lucide-react-native";

export default function LogTypeTabs({ logType, onChangeLogType, colors }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <TouchableOpacity
        onPress={() => onChangeLogType("weekly")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor:
            logType === "weekly" ? colors.primary : "transparent",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <CalendarIcon
          size={18}
          color={logType === "weekly" ? "#FFFFFF" : colors.textSecondary}
        />
        <Text
          style={{
            color: logType === "weekly" ? "#FFFFFF" : colors.textSecondary,
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          Weekly Check
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeLogType("maintenance")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor:
            logType === "maintenance" ? colors.primary : "transparent",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Wrench
          size={18}
          color={logType === "maintenance" ? "#FFFFFF" : colors.textSecondary}
        />
        <Text
          style={{
            color: logType === "maintenance" ? "#FFFFFF" : colors.textSecondary,
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          Maintenance
        </Text>
      </TouchableOpacity>
    </View>
  );
}
