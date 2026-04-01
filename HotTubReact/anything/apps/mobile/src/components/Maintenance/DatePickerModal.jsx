import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { X } from "lucide-react-native";

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
  colors,
}) {
  const today = new Date().toISOString().split("T")[0];

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
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            width: "100%",
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
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
              Select Date
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Calendar
            maxDate={today}
            onDayPress={(day) => {
              onSelectDate(day.dateString);
              onClose();
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#ffffff",
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textTertiary,
              dotColor: colors.primary,
              selectedDotColor: "#ffffff",
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontWeight: "400",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
