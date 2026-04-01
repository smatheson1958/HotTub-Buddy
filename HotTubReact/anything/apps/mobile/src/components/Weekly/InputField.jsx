import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { HelpCircle } from "lucide-react-native";

export const InputField = React.memo(
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
    onHelp,
    multiline = false,
  }) => (
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
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 12 : 0,
        }}
      >
        {Icon && (
          <Icon
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            height: multiline ? 80 : 48,
            color: colors.text,
            fontSize: 16,
            textAlignVertical: multiline ? "top" : "center",
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          editable={editable && !onPress}
          pointerEvents={onPress ? "none" : "auto"}
          multiline={multiline}
        />
      </TouchableOpacity>
    </View>
  ),
);
