import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HelpCircle, Zap, Waves } from "lucide-react-native";
import { InputField } from "./InputField";

export const ChlorineSection = ({
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
          {isBromine ? "Bromine Levels" : "Chlorine Levels"}
        </Text>
      </View>

      <InputField
        label={`${isBromine ? "Combined Bromine" : "Combined Chlorine"} (ppm)`}
        value={formData.combined_chlorine}
        onChangeText={(v) => onInputChange("combined_chlorine", v)}
        placeholder="0.0-0.5"
        keyboardType="numeric"
        icon={Zap}
        colors={colors}
        onHelp={() => onHelp("sanitizer")}
      />

      <InputField
        label={`${isBromine ? "Total Bromine" : "Total Chlorine"} (ppm)`}
        value={formData.total_chlorine}
        onChangeText={(v) => onInputChange("total_chlorine", v)}
        placeholder={isBromine ? "3.0-5.0" : "1.0-3.0"}
        keyboardType="numeric"
        icon={Waves}
        colors={colors}
        onHelp={() => onHelp("sanitizer")}
      />
    </View>
  );
};
