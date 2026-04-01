import React from "react";
import { View, Text } from "react-native";

export function DefaultContent({ colors }) {
  return (
    <View>
      <Text style={{ fontSize: 18, color: colors.text }}>
        Help content not available for this topic.
      </Text>
    </View>
  );
}
