import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native";

export const ShockTypePickerModal = ({
  visible,
  onClose,
  shockTypes,
  selectedShockType,
  onShockTypeSelect,
  colors,
  insets,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: insets.bottom + 20,
            maxHeight: "60%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "700", color: colors.text }}
            >
              Select Shock Type
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {shockTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => {
                  onShockTypeSelect(type.value);
                  onClose();
                }}
                style={{
                  padding: 16,
                  backgroundColor:
                    selectedShockType === type.value
                      ? colors.primary + "20"
                      : colors.surfaceElevated,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor:
                    selectedShockType === type.value
                      ? colors.primary
                      : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color:
                      selectedShockType === type.value
                        ? colors.primary
                        : colors.text,
                    fontWeight:
                      selectedShockType === type.value ? "600" : "400",
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
