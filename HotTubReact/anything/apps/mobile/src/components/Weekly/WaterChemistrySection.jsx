import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HelpCircle, Waves, Droplets } from "lucide-react-native";
import { InputField } from "./InputField";

export const WaterChemistrySection = ({
  formData,
  onInputChange,
  onHelp,
  colors,
  isBromine,
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
          Water Chemistry
        </Text>
      </View>

      <InputField
        label="Total Alkalinity (ppm)"
        value={formData.total_alkalinity}
        onChangeText={(v) => onInputChange("total_alkalinity", v)}
        placeholder="80-120"
        keyboardType="numeric"
        icon={Waves}
        colors={colors}
        onHelp={() => onHelp("alkalinity")}
      />

      <InputField
        label="Copper (ppm)"
        value={formData.copper}
        onChangeText={(v) => onInputChange("copper", v)}
        placeholder="0.0-0.5"
        keyboardType="numeric"
        icon={Droplets}
        colors={colors}
        onHelp={() => onHelp("copper")}
      />
    </View>
  );
};
