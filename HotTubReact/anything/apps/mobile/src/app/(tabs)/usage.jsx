import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import {
  Calendar as CalendarIcon,
  Save,
  X,
  Clock,
  Trash2,
  Timer,
  Users,
  HelpCircle,
} from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import useTheme from "@/utils/useTheme";
import { useQueryClient } from "@tanstack/react-query";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { format, parseISO, isValid } from "date-fns";
import {
  createUsageLog,
  updateUsageLog,
  deleteUsageLog,
} from "@/utils/offlineStorage";
import { validateUsageLog } from "@/utils/formValidation";

// Helper function to safely format dates
const safeFormatDate = (dateString, formatStr = "dd MMM yy") => {
  if (!dateString) return "";
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatStr);
  } catch (e) {
    console.error("Date formatting error:", e, "for date:", dateString);
    return dateString;
  }
};

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
    onHelp,
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
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
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
        />
      </TouchableOpacity>
    </View>
  ),
);

const UsageLogScreen = forwardRef((props, ref) => {
  const { embedded = false } = props;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { editData } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    usage_date: new Date().toISOString().split("T")[0],
    usage_time: new Date().toTimeString().split(" ")[0].slice(0, 5),
    num_users: 1,
    duration_minutes: 15,
  });

  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);
        setFormData({
          id: data.id,
          usage_date: data.usage_date,
          usage_time: data.usage_time?.slice(0, 5) || "16:00",
          num_users: parseInt(data.num_users) || 1,
          duration_minutes: parseInt(data.duration_minutes) || 15,
        });
        setIsEditMode(true);
      } catch (e) {
        console.error("Failed to parse editData", e);
      }
    }
  }, [editData]);

  useFocusEffect(
    React.useCallback(() => {
      if (!editData) {
        setFormData({
          usage_date: new Date().toISOString().split("T")[0],
          usage_time: new Date().toTimeString().split(" ")[0].slice(0, 5),
          num_users: 1,
          duration_minutes: 15,
        });
        setIsEditMode(false);
      }
    }, [editData]),
  );

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validation = validateUsageLog(formData);

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n\n"), [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await updateUsageLog(formData);
      } else {
        await createUsageLog(formData);
      }

      queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      Alert.alert(
        "Success",
        isEditMode
          ? "Usage log updated successfully!"
          : "Usage log recorded successfully!",
      );

      if (isEditMode) {
        router.back();
      } else {
        setFormData({
          usage_date: new Date().toISOString().split("T")[0],
          usage_time: new Date().toTimeString().split(" ")[0].slice(0, 5),
          num_users: 1,
          duration_minutes: 15,
        });
        router.push("/(tabs)"); // Navigate to dashboard
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save the usage log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this usage log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUsageLog(formData.id);
              queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
              Alert.alert("Success", "Usage log deleted successfully!");
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete the log.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    hasData: () => {
      // Usage logs always have date/time/num_users/duration, so check if it differs from defaults
      return formData.num_users !== 1 || formData.duration_minutes !== 15;
    },
    validate: () => validateUsageLog(formData),
    submit: async () => {
      const validation = validateUsageLog(formData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      try {
        if (isEditMode) {
          await updateUsageLog(formData);
        } else {
          await createUsageLog(formData);
        }

        queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
        queryClient.invalidateQueries({ queryKey: ["all-history"] });

        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, errors: [error.message] };
      }
    },
  }));

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.surfaceHighest }}
      behavior="padding"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
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
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Calendar
              current={formData.usage_date}
              onDayPress={(day) => {
                handleInputChange("usage_date", day.dateString);
                setShowDatePicker(false);
              }}
              markedDates={{
                [formData.usage_date]: {
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

      {!embedded && (
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            {isEditMode ? "Edit Usage Log" : "Usage Log"}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {isEditMode
              ? "Update hot tub usage record"
              : "Record when the hot tub was used"}
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
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <InputField
              label="Date"
              value={
                formData.usage_date ? safeFormatDate(formData.usage_date) : ""
              }
              onChangeText={(v) => handleInputChange("usage_date", v)}
              placeholder="DD MMM YY"
              icon={CalendarIcon}
              onPress={() => setShowDatePicker(true)}
              colors={colors}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label="Time"
              value={formData.usage_time}
              onChangeText={(v) => handleInputChange("usage_time", v)}
              placeholder="HH:MM"
              icon={Clock}
              colors={colors}
            />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            Number of Users
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={formData.num_users}
              onValueChange={(itemValue) =>
                handleInputChange("num_users", itemValue)
              }
              style={{ color: colors.text }}
              dropdownIconColor={colors.textSecondary}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Picker.Item
                  key={num}
                  label={`${num} User${num > 1 ? "s" : ""}`}
                  value={num}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            Duration (Minutes)
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={formData.duration_minutes}
              onValueChange={(itemValue) =>
                handleInputChange("duration_minutes", itemValue)
              }
              style={{ color: colors.text }}
              dropdownIconColor={colors.textSecondary}
            >
              {[15, 30, 45, 60, 75, 90, 105, 120].map((mins) => (
                <Picker.Item
                  key={mins}
                  label={`${mins} Minutes`}
                  value={mins}
                />
              ))}
            </Picker>
          </View>
        </View>

        {!embedded && (
          <>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: colors.primary,
                height: 56,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {isEditMode ? "Update Usage Log" : "Save Usage Log"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading}
                style={{
                  backgroundColor: colors.notification + "15",
                  height: 56,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: colors.notification + "30",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Trash2
                  size={20}
                  color={colors.notification}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: colors.notification,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  Delete Record
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
});

export default UsageLogScreen;
