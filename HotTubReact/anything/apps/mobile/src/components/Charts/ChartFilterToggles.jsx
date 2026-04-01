import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, User } from "lucide-react-native";

export function ChartFilterToggles({
  chartFilters,
  onToggleFilter,
  isBromine,
  colors,
}) {
  const filters = [
    {
      key: "showChlorine",
      label: isBromine ? "BR" : "CL",
      color: colors.primary,
    },
    {
      key: "showPH",
      label: "PH",
      color: colors.success,
    },
    {
      key: "showUsers",
      label: null,
      color: colors.warning,
      isSquare: true,
      icon: true,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 24,
      }}
    >
      {filters.map((filter) => {
        const isActive = chartFilters[filter.key];
        return (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onToggleFilter(filter.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.surface,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isActive ? filter.color : colors.border,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: isActive ? filter.color : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isActive && <Check size={14} color="#FFFFFF" />}
            </View>
            {filter.icon ? (
              <User size={16} color={colors.text} />
            ) : (
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: colors.text }}
              >
                {filter.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
