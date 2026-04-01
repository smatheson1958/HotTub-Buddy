import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Copy } from "lucide-react-native";

export default function QuickActionsBar({
  onSetQuickDate,
  onSetNowTime,
  onCopyLastEntry,
  logType,
  hasPastLogs,
  isEditMode,
  colors,
}) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
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
          onPress={() => onSetQuickDate(0)}
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
          onPress={() => onSetQuickDate(1)}
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
          onPress={() => onSetQuickDate(7)}
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
        {logType === "maintenance" && hasPastLogs && !isEditMode && (
          <TouchableOpacity
            onPress={onCopyLastEntry}
            style={{
              flex: 1,
              backgroundColor: colors.textSecondary + "15",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              marginLeft: 6,
            }}
          >
            <Copy size={12} color={colors.textSecondary} />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Copy Last
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
