import React from "react";
import { View, Text } from "react-native";
import { Droplet, Beaker, Users, Plus } from "lucide-react-native";

export function GuideSection({ type, isBromine, colors }) {
  const guides = {
    chlorine: {
      icon: Droplet,
      title: isBromine ? "Bromine Guide" : "Chlorine Guide",
      color: colors.primary,
      content: `• Ideal ${isBromine ? "Bromine" : "Free Chlorine"}: ${isBromine ? "3.0 - 5.0" : "1.0 - 3.0"} ppm\n• ${isBromine ? "Bromine" : "Free Chlorine"} is the active sanitizer in your water.\n• If levels are low, add ${isBromine ? "bromine" : "chlorine"} immediately.\n• If levels are high, wait for them to drop before using.`,
    },
    ph: {
      icon: Beaker,
      title: "pH Guide",
      color: colors.success,
      content:
        "• Ideal pH: 7.2 - 7.8\n• pH affects sanitizer effectiveness and water comfort.\n• Too low (acidic): Add pH Up to raise levels.\n• Too high (basic): Add pH Down to lower levels.",
    },
    sanitization: {
      icon: Plus,
      title: isBromine ? "Bromine Added" : "Sanitizer Added",
      color: "#8B5CF6",
      content: `• This shows how much ${isBromine ? "bromine" : "chlorine"} you added each day (in grams).\n• Track consumption patterns to predict when you'll need to reorder.\n• Higher usage days typically require more sanitizer.\n• Regular additions keep water safe and clear.`,
    },
    users: {
      icon: Users,
      title: "Usage Guide",
      color: colors.warning,
      content:
        "• Track how many people use your hot tub daily.\n• Higher usage may require more frequent chemical adjustments.\n• Test water quality after heavy use sessions.",
    },
  };

  const guide = guides[type];
  if (!guide) return null;

  const Icon = guide.icon;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Icon size={20} color={guide.color} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {guide.title}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 20,
        }}
      >
        {guide.content}
      </Text>
    </View>
  );
}
