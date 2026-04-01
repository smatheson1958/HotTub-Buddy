import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import {
  Waves,
  Zap,
  CheckCircle2,
  Droplets,
  ChevronDown,
} from "lucide-react-native";
import InputField from "./InputField";
import { getShockTypesForSanitizer } from "@/utils/shockTypes";

export default function WeeklyCheckFormFields({
  form,
  onChangeField,
  weightUnit,
  colors,
  errors = {},
  onBlurField,
  sanitizerType = "Chlorine",
  onShowShockTypePicker,
}) {
  const shockTypes = getShockTypesForSanitizer(sanitizerType);
  const selectedShockType = shockTypes.find((t) => t.value === form.shock_type);
  const shouldShowShockType =
    form.shock_added && parseFloat(form.shock_added) > 0;

  return (
    <View
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        Water Chemistry
      </Text>

      <InputField
        label="Total Alkalinity (ppm)"
        value={form.total_alkalinity}
        onChangeText={(v) => onChangeField("total_alkalinity", v)}
        placeholder="80-120"
        keyboardType="numeric"
        icon={Waves}
        colors={colors}
        onBlur={() =>
          onBlurField && onBlurField("total_alkalinity", form.total_alkalinity)
        }
        error={errors.total_alkalinity}
      />

      <InputField
        label="Copper (ppm)"
        value={form.copper}
        onChangeText={(v) => onChangeField("copper", v)}
        placeholder="0.0-0.3"
        keyboardType="numeric"
        icon={Waves}
        colors={colors}
        onBlur={() => onBlurField && onBlurField("copper", form.copper)}
        error={errors.copper}
      />

      <InputField
        label={`Shock Added (${weightUnit})`}
        value={form.shock_added}
        onChangeText={(v) => onChangeField("shock_added", v)}
        placeholder={`0.0 ${weightUnit}`}
        keyboardType="numeric"
        icon={Zap}
        colors={colors}
        onBlur={() =>
          onBlurField && onBlurField("shock_added", form.shock_added)
        }
        error={errors.shock_added}
      />

      {shouldShowShockType && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Shock Type
          </Text>
          <TouchableOpacity
            onPress={onShowShockTypePicker}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.surface,
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
              }}
            >
              {selectedShockType
                ? selectedShockType.label
                : "Select shock type..."}
            </Text>
            <ChevronDown size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          {errors.shock_type && (
            <Text style={{ color: colors.warning, fontSize: 12, marginTop: 4 }}>
              {errors.shock_type}
            </Text>
          )}
        </View>
      )}

      <InputField
        label={`Alkalinity Up Added (${weightUnit})`}
        value={form.alkalinity_up_added}
        onChangeText={(v) => onChangeField("alkalinity_up_added", v)}
        placeholder={`0.0 ${weightUnit}`}
        keyboardType="numeric"
        icon={Droplets}
        colors={colors}
        onBlur={() =>
          onBlurField &&
          onBlurField("alkalinity_up_added", form.alkalinity_up_added)
        }
        error={errors.alkalinity_up_added}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckCircle2
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: colors.text, fontSize: 16 }}>
            Filter Cleaned?
          </Text>
        </View>
        <Switch
          value={form.filter_cleaned}
          onValueChange={(v) => onChangeField("filter_cleaned", v)}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
}
