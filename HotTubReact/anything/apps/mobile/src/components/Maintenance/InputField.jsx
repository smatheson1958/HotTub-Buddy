import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AlertCircle } from "lucide-react-native";

const InputField = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    colors,
    keyboardType = "default",
    icon: Icon,
    onPress,
    editable = true,
    onBlur,
    error,
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          fontWeight: "500",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
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
          onBlur={onBlur}
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
  ),
);

export default InputField;
