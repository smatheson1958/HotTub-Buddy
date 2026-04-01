import React from "react";
import { View, Text } from "react-native";

export function HelpText({ children, colors, bold = false, marginTop = 0 }) {
  return (
    <Text
      style={{
        fontSize: 14,
        lineHeight: 20,
        color: colors.text,
        fontWeight: bold ? "600" : "400",
        marginTop,
      }}
    >
      {children}
    </Text>
  );
}

export function BulletPoint({ children, colors }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 6, paddingLeft: 12 }}>
      <Text style={{ color: colors.primary, marginRight: 8 }}>•</Text>
      <Text
        style={{ fontSize: 14, lineHeight: 20, color: colors.text, flex: 1 }}
      >
        {children}
      </Text>
    </View>
  );
}
