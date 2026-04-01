import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";

export function MonthNavigation({
  monthLabel,
  isCurrentMonth,
  onPrevious,
  onNext,
  onCurrentMonth,
  colors,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <TouchableOpacity
        onPress={onPrevious}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          backgroundColor: colors.primary + "15",
        }}
      >
        <ChevronLeft size={18} color={colors.primary} />
        <Text
          style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}
        >
          Prev
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCurrentMonth}
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>
            {monthLabel}
          </Text>
        </View>
        {!isCurrentMonth && (
          <Text
            style={{
              fontSize: 10,
              color: colors.textTertiary,
              marginTop: 2,
            }}
          >
            Tap for today
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        disabled={isCurrentMonth}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          backgroundColor: isCurrentMonth
            ? colors.border
            : colors.primary + "15",
          opacity: isCurrentMonth ? 0.5 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: isCurrentMonth ? colors.textTertiary : colors.primary,
          }}
        >
          Next
        </Text>
        <ChevronRight
          size={18}
          color={isCurrentMonth ? colors.textTertiary : colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
