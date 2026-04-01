import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";

export function CollapsibleSection({
  title,
  children,
  colors,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surfaceHighest,
          padding: 12,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: colors.text,
            flex: 1,
          }}
        >
          {title}
        </Text>
        {isOpen ? (
          <ChevronDown size={20} color={colors.primary} />
        ) : (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      {isOpen && <View style={{ padding: 12, paddingTop: 8 }}>{children}</View>}
    </View>
  );
}
