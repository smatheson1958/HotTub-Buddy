import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Droplet, HelpCircle } from "lucide-react-native";
import InputField from "./InputField";

const PlusCircle = ({ size, color, style }) => (
  <View style={style}>
    <Droplet size={size} color={color} />
  </View>
);

export default function ChemicalsAddedSection({
  isBromine,
  weightUnit,
  formData,
  onInputChange,
  onFieldBlur,
  fieldErrors,
  onHelp,
  colors,
}) {
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
          Chemicals Added
        </Text>
        <TouchableOpacity
          onPress={() => onHelp("chemicals-added")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <HelpCircle size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <InputField
        label={`${isBromine ? "Bromine" : "Chlorine"} Added (${weightUnit})`}
        value={formData.added_chlorine}
        onChangeText={(v) => onInputChange("added_chlorine", v)}
        placeholder={`0.0 ${weightUnit}`}
        keyboardType="numeric"
        icon={PlusCircle}
        colors={colors}
        onBlur={() => onFieldBlur("added_chlorine", formData.added_chlorine)}
        error={fieldErrors.added_chlorine}
        onHelp={() => onHelp("chemicals-added")}
      />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <InputField
            label={`PH Up (${weightUnit})`}
            value={formData.added_ph_up}
            onChangeText={(v) => onInputChange("added_ph_up", v)}
            placeholder={weightUnit}
            keyboardType="numeric"
            colors={colors}
            onBlur={() => onFieldBlur("added_ph_up", formData.added_ph_up)}
            error={fieldErrors.added_ph_up}
            onHelp={() => onHelp("ph")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            label={`PH Down (${weightUnit})`}
            value={formData.added_ph_down}
            onChangeText={(v) => onInputChange("added_ph_down", v)}
            placeholder={weightUnit}
            keyboardType="numeric"
            colors={colors}
            onBlur={() => onFieldBlur("added_ph_down", formData.added_ph_down)}
            error={fieldErrors.added_ph_down}
            onHelp={() => onHelp("ph")}
          />
        </View>
      </View>
    </View>
  );
}
