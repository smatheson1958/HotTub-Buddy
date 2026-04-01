import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Droplet, Beaker, HelpCircle } from "lucide-react-native";
import InputField from "./InputField";

export default function ChemicalReadingsSection({
  isBromine,
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
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            {isBromine ? "Bromine" : "Chlorine"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            {isBromine
              ? "Ideal range: 3-5 ppm"
              : "Free: 1-3 ppm, Total: 3-5 ppm"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onHelp(isBromine ? "bromine" : "chlorine")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <HelpCircle size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isBromine ? (
        <>
          <InputField
            label="Bromine (ppm)"
            value={formData.chlorine_1}
            onChangeText={(v) => onInputChange("chlorine_1", v)}
            placeholder="0.0"
            keyboardType="numeric"
            icon={Droplet}
            colors={colors}
            onBlur={() => onFieldBlur("chlorine_1", formData.chlorine_1)}
            error={fieldErrors.chlorine_1}
            onHelp={() => onHelp("bromine")}
          />
          <InputField
            label="Total (ppm)"
            value={formData.chlorine_3}
            onChangeText={(v) => onInputChange("chlorine_3", v)}
            placeholder="0.0"
            keyboardType="numeric"
            icon={Droplet}
            colors={colors}
            onBlur={() => onFieldBlur("chlorine_3", formData.chlorine_3)}
            error={fieldErrors.chlorine_3}
            onHelp={() => onHelp("bromine")}
          />
        </>
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Free (ppm)"
                value={formData.chlorine_1}
                onChangeText={(v) => onInputChange("chlorine_1", v)}
                placeholder="0.0"
                keyboardType="numeric"
                icon={Droplet}
                colors={colors}
                onBlur={() => onFieldBlur("chlorine_1", formData.chlorine_1)}
                error={fieldErrors.chlorine_1}
                onHelp={() => onHelp("chlorine")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label="Combined (ppm)"
                value={formData.chlorine_2}
                onChangeText={(v) => onInputChange("chlorine_2", v)}
                placeholder="0.0"
                keyboardType="numeric"
                icon={Droplet}
                colors={colors}
                onBlur={() => onFieldBlur("chlorine_2", formData.chlorine_2)}
                error={fieldErrors.chlorine_2}
                onHelp={() => onHelp("chlorine")}
              />
            </View>
          </View>

          <InputField
            label="Total (ppm)"
            value={formData.chlorine_3}
            onChangeText={(v) => onInputChange("chlorine_3", v)}
            placeholder="0.0"
            keyboardType="numeric"
            icon={Droplet}
            colors={colors}
            onBlur={() => onFieldBlur("chlorine_3", formData.chlorine_3)}
            error={fieldErrors.chlorine_3}
            onHelp={() => onHelp("chlorine")}
          />
        </>
      )}

      <InputField
        label="PH Level"
        value={formData.ph}
        onChangeText={(v) => onInputChange("ph", v)}
        placeholder="7.4"
        keyboardType="numeric"
        icon={Beaker}
        colors={colors}
        onBlur={() => onFieldBlur("ph", formData.ph)}
        error={fieldErrors.ph}
        onHelp={() => onHelp("ph")}
      />
    </View>
  );
}
