import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { X } from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import { PhContent } from "./HelpModal/content/PhContent";
import { SanitizerContent } from "./HelpModal/content/SanitizerContent";
import { TemperatureContent } from "./HelpModal/content/TemperatureContent";
import { ChemicalsAddedContent } from "./HelpModal/content/ChemicalsAddedContent";
import { ShockContent } from "./HelpModal/content/ShockContent";
import { CopperContent } from "./HelpModal/content/CopperContent";
import { AlkalinityContent } from "./HelpModal/content/AlkalinityContent";
import { DefaultContent } from "./HelpModal/content/DefaultContent";
import { ConsumptionContent } from "./HelpModal/content/ConsumptionContent";

export default function HelpModal({
  visible,
  onClose,
  topic,
  sanitizerType = "chlorine",
  isMetric = true,
}) {
  const { colors } = useTheme();
  const isBromine = sanitizerType === "bromine";
  const weightUnit = isMetric ? "g" : "oz";

  const getTitle = () => {
    switch (topic) {
      case "ph":
        return "pH & Alkalinity Guide";
      case "sanitizer":
      case "chlorine":
        return "Chlorine Guide";
      case "bromine":
        return "Bromine Guide";
      case "copper":
        return "Copper (Cu) Guide";
      case "alkalinity":
        return "Total Alkalinity Guide";
      case "temperature":
        return "Temperature Guide";
      case "chemicals-added":
        return "Chemicals Added Guide";
      case "shock":
        return "Shock Treatment Guide";
      case "consumption":
        return "Sanitizer Consumption Guide";
      default:
        return "Help & Guide";
    }
  };

  const renderContent = () => {
    switch (topic) {
      case "ph":
        return <PhContent colors={colors} />;

      case "sanitizer":
      case "chlorine":
      case "bromine":
        return <SanitizerContent colors={colors} isBromine={isBromine} />;

      case "copper":
        return <CopperContent colors={colors} />;

      case "alkalinity":
        return <AlkalinityContent colors={colors} />;

      case "temperature":
        return <TemperatureContent colors={colors} />;

      case "chemicals-added":
        return (
          <ChemicalsAddedContent
            colors={colors}
            isBromine={isBromine}
            weightUnit={weightUnit}
          />
        );

      case "shock":
        return (
          <ShockContent
            colors={colors}
            isBromine={isBromine}
            weightUnit={weightUnit}
          />
        );

      case "consumption":
        return (
          <ConsumptionContent
            colors={colors}
            sanitizerType={sanitizerType}
            isMetric={isMetric}
          />
        );

      default:
        return <DefaultContent colors={colors} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
            {getTitle()}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
