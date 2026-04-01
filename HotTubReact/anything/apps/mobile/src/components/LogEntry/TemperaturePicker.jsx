import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HelpCircle, Minus, Plus } from "lucide-react-native";

export default function TemperaturePicker({
  value,
  onChange,
  temperatureOptions,
  tempUnit,
  onHelp,
  colors,
}) {
  const minTemp = temperatureOptions[0];
  const maxTemp = temperatureOptions[temperatureOptions.length - 1];
  const currentValue = value || minTemp;

  const handleDecrement = () => {
    if (currentValue > minTemp) {
      onChange(currentValue - 1);
    }
  };

  const handleIncrement = () => {
    if (currentValue < maxTemp) {
      onChange(currentValue + 1);
    }
  };

  const isAtMin = currentValue <= minTemp;
  const isAtMax = currentValue >= maxTemp;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: colors.textSecondary,
          }}
        >
          Water Temperature
        </Text>
        <TouchableOpacity
          onPress={onHelp}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <HelpCircle size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* +/- Controls */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* Minus Button */}
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={isAtMin}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isAtMin ? colors.surfaceHighest : colors.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: isAtMin ? 0.4 : 1,
          }}
        >
          <Minus size={24} color={isAtMin ? colors.textSecondary : "#FFFFFF"} />
        </TouchableOpacity>

        {/* Temperature Display */}
        <View
          style={{
            minWidth: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {currentValue}°{tempUnit}
          </Text>
        </View>

        {/* Plus Button */}
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={isAtMax}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isAtMax ? colors.surfaceHighest : colors.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: isAtMax ? 0.4 : 1,
          }}
        >
          <Plus size={24} color={isAtMax ? colors.textSecondary : "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
