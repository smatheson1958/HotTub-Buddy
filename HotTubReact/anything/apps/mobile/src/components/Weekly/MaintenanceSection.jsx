import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HelpCircle, Zap, Droplets, ChevronDown } from "lucide-react-native";
import { InputField } from "./InputField";

export const MaintenanceSection = ({
  formData,
  onInputChange,
  onHelp,
  weightUnit,
  shouldShowShockType,
  selectedShockType,
  onShockTypePickerOpen,
  colors,
}) => {
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
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          Maintenance
        </Text>
      </View>

      <InputField
        label={`Shock Added (${weightUnit})`}
        value={formData.shock_added}
        onChangeText={(v) => onInputChange("shock_added", v)}
        placeholder={`0.0 ${weightUnit}`}
        keyboardType="numeric"
        icon={Zap}
        colors={colors}
        onHelp={() => onHelp("shock")}
      />

      {shouldShowShockType && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            Shock Type
          </Text>
          <TouchableOpacity
            onPress={onShockTypePickerOpen}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.surfaceElevated,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: selectedShockType ? colors.text : colors.textTertiary,
                flex: 1,
                fontSize: 16,
              }}
            >
              {selectedShockType
                ? selectedShockType.label
                : "Select shock type..."}
            </Text>
            <ChevronDown size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      <InputField
        label={`Alkalinity Up Added (${weightUnit})`}
        value={formData.alkalinity_up_added}
        onChangeText={(v) => onInputChange("alkalinity_up_added", v)}
        placeholder={`0.0 ${weightUnit}`}
        keyboardType="numeric"
        icon={Droplets}
        colors={colors}
        onHelp={() => onHelp("alkalinity")}
      />
    </View>
  );
};
