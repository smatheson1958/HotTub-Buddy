import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AlertCircle, HelpCircle } from "lucide-react-native";

const InputField = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    icon: Icon,
    onPress,
    editable = true,
    colors,
    onBlur,
    error,
    onHelp,
  }) => {
    const handleBlur = () => {
      // Round to 1 decimal place for number inputs
      if (keyboardType === "numeric" || keyboardType === "decimal-pad") {
        if (value && value.trim() !== "") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            const rounded = Math.round(numValue * 10) / 10;
            onChangeText(rounded.toString());
          }
        }
      }
      if (onBlur) {
        onBlur();
      }
    };

    return (
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {label}
          </Text>
          {onHelp && (
            <TouchableOpacity
              onPress={onHelp}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HelpCircle size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? colors.notification : colors.border,
            paddingHorizontal: 12,
          }}
        >
          {Icon && (
            <Icon
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 8 }}
            />
          )}
          <TextInput
            style={{ flex: 1, height: 48, color: colors.text, fontSize: 16 }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            keyboardType={keyboardType}
            editable={editable && !onPress}
            pointerEvents={onPress ? "none" : "auto"}
            onBlur={handleBlur}
          />
        </TouchableOpacity>
        {error && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              marginLeft: 4,
            }}
          >
            <AlertCircle
              size={14}
              color={colors.notification}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: colors.notification,
                fontSize: 12,
                flex: 1,
              }}
            >
              {error}
            </Text>
          </View>
        )}
      </View>
    );
  },
);

export default InputField;
