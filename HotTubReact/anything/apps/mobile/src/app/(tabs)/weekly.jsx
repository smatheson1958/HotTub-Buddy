import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Calendar as CalendarIcon, FileText, Clock } from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import HelpModal from "@/components/HelpModal";
import { getShockTypesForSanitizer } from "@/utils/shockTypes";
import { safeFormatDate } from "@/utils/weekly/dateHelpers";
import { useWeeklyForm } from "@/utils/weekly/useWeeklyForm";
import { InputField } from "@/components/Weekly/InputField";
import { DatePickerModal } from "@/components/Weekly/DatePickerModal";
import { ShockTypePickerModal } from "@/components/Weekly/ShockTypePickerModal";
import { ChlorineSection } from "@/components/Weekly/ChlorineSection";
import { WaterChemistrySection } from "@/components/Weekly/WaterChemistrySection";
import { MaintenanceSection } from "@/components/Weekly/MaintenanceSection";
import { FormActions } from "@/components/Weekly/FormActions";

const WeeklyCheckScreen = forwardRef((props, ref) => {
  const { embedded = false } = props;
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const {
    settings,
    loading,
    isEditMode,
    formData,
    handleInputChange,
    handleSubmit,
    handleDelete,
    getFormData,
    hasData,
    validate,
    submit,
  } = useWeeklyForm(embedded);

  const isMetric = settings?.measurement_system !== "imperial";
  const weightUnit = isMetric ? "g" : "oz";
  const sanitizerType = settings?.sanitizer_type || "Chlorine";
  const isBromine = sanitizerType.toLowerCase() === "bromine";

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShockTypePicker, setShowShockTypePicker] = useState(false);

  // Help modal state
  const [helpTopic, setHelpTopic] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const shockTypes = getShockTypesForSanitizer(sanitizerType);
  const selectedShockType = shockTypes.find(
    (t) => t.value === formData.shock_type,
  );
  const shouldShowShockType =
    formData.shock_added && parseFloat(formData.shock_added) > 0;

  const openHelp = (topic) => {
    setHelpTopic(topic);
    setShowHelpModal(true);
  };

  const closeHelp = () => {
    setShowHelpModal(false);
    setHelpTopic(null);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getFormData,
    hasData,
    validate,
    submit,
  }));

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.surfaceHighest }}
      behavior="padding"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Help Modal */}
      <HelpModal
        visible={showHelpModal}
        onClose={closeHelp}
        topic={helpTopic}
        sanitizerType={sanitizerType}
        isMetric={isMetric}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={formData.log_date}
        onDateSelect={(date) => handleInputChange("log_date", date)}
        colors={colors}
      />

      {/* Shock Type Picker Modal */}
      <ShockTypePickerModal
        visible={showShockTypePicker}
        onClose={() => setShowShockTypePicker(false)}
        shockTypes={shockTypes}
        selectedShockType={formData.shock_type}
        onShockTypeSelect={(type) => handleInputChange("shock_type", type)}
        colors={colors}
        insets={insets}
      />

      {!embedded && (
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            {isEditMode ? "Edit Weekly Check" : "Weekly Check"}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {isEditMode
              ? "Update your weekly maintenance tasks"
              : "Record your weekly maintenance tasks"}
          </Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: embedded ? 20 : insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <InputField
              label="Date"
              value={formData.log_date ? safeFormatDate(formData.log_date) : ""}
              onChangeText={(v) => handleInputChange("log_date", v)}
              placeholder="DD MMM YY"
              icon={CalendarIcon}
              onPress={() => setShowDatePicker(true)}
              colors={colors}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label="Time"
              value={formData.log_time}
              onChangeText={(v) => handleInputChange("log_time", v)}
              placeholder="HH:MM"
              icon={Clock}
              colors={colors}
            />
          </View>
        </View>

        <ChlorineSection
          formData={formData}
          onInputChange={handleInputChange}
          onHelp={openHelp}
          colors={colors}
          isBromine={isBromine}
        />

        <WaterChemistrySection
          formData={formData}
          onInputChange={handleInputChange}
          onHelp={openHelp}
          colors={colors}
          isBromine={isBromine}
        />

        <MaintenanceSection
          formData={formData}
          onInputChange={handleInputChange}
          onHelp={openHelp}
          weightUnit={weightUnit}
          shouldShowShockType={shouldShowShockType}
          selectedShockType={selectedShockType}
          onShockTypePickerOpen={() => setShowShockTypePicker(true)}
          colors={colors}
        />

        <InputField
          label="Notes"
          value={formData.notes}
          onChangeText={(v) => handleInputChange("notes", v)}
          placeholder="Any observations..."
          icon={FileText}
          colors={colors}
          multiline={true}
        />

        {!embedded && (
          <FormActions
            loading={loading}
            isEditMode={isEditMode}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            colors={colors}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
});

export default WeeklyCheckScreen;
