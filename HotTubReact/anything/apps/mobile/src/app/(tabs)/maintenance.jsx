import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import {
  Wrench,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Save,
  Trash2,
  X,
  CheckCircle2,
  HelpCircle,
  Droplet,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import useTheme from "@/utils/useTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { format, parseISO, isValid } from "date-fns";
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
} from "@/utils/offlineStorage";
import { validateMaintenanceLog } from "@/utils/formValidation";

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
    onBlur,
    showSuggestions = false,
    suggestions = [],
    onSelectSuggestion,
  }) => (
    <View style={{ marginBottom: 16, zIndex: showSuggestions ? 1000 : 1 }}>
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
          onBlur={onBlur}
        />
      </TouchableOpacity>

      {showSuggestions && suggestions.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 76,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: 200,
            zIndex: 1001,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <ScrollView nestedScrollEnabled>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectSuggestion(suggestion)}
                style={{
                  padding: 12,
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14 }}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  ),
);

const MaintenanceScreen = forwardRef((props, ref) => {
  const { embedded = false } = props;
  const insets = useSafeAreaInsets();
  const { editData } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();

  const { data: pastLogs = [] } = useQuery({
    queryKey: ["maintenance-logs"],
    queryFn: getMaintenanceLogs,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    action: "",
    notes: "",
    filter_changed: false,
    water_change: false,
  });

  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);
        setFormData({
          id: data.id,
          log_date: data.log_date,
          log_time: data.log_time?.slice(0, 5) || "",
          action: data.action || "",
          notes: data.notes || "",
          filter_changed: data.filter_changed || false,
          water_change: data.water_change || false,
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
          log_date: new Date().toISOString().split("T")[0],
          log_time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          action: "",
          notes: "",
          filter_changed: false,
          water_change: false,
        });
        setIsEditMode(false);
      }
    }, [editData]),
  );

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "action") {
      if (value.trim().length > 0) {
        const uniqueActions = [
          ...new Set(pastLogs.map((log) => log.action).filter(Boolean)),
        ];
        const filtered = uniqueActions.filter((action) =>
          action.toLowerCase().includes(value.toLowerCase()),
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, action: suggestion }));
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    const submissionForm = { ...formData };
    if (!submissionForm.action) {
      const actions = [];
      if (submissionForm.water_change) {
        actions.push("Water change");
      }
      if (submissionForm.filter_changed) {
        actions.push("Filter changed");
      }
      if (actions.length > 0) {
        submissionForm.action = actions.join(", ");
      }
    }

    const validation = validateMaintenanceLog(submissionForm);
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n\n"), [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await updateMaintenanceLog(submissionForm);
      } else {
        await createMaintenanceLog(submissionForm);
      }

      queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      Alert.alert(
        "Success",
        isEditMode
          ? "Maintenance log updated successfully!"
          : "Maintenance log recorded successfully!",
      );

      if (isEditMode) {
        router.back();
      } else {
        setFormData({
          log_date: new Date().toISOString().split("T")[0],
          log_time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          action: "",
          notes: "",
          filter_changed: false,
          water_change: false,
        });
        router.push("/(tabs)"); // Navigate to dashboard
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save the log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this maintenance log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteMaintenanceLog(formData.id);
              queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
              Alert.alert("Success", "Maintenance log deleted successfully!");
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete the record.");
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
      // Check if any meaningful data is entered
      return !!(
        formData.action ||
        formData.notes ||
        formData.filter_changed ||
        formData.water_change
      );
    },
    validate: () => {
      const submissionForm = { ...formData };
      if (!submissionForm.action) {
        const actions = [];
        if (submissionForm.water_change) {
          actions.push("Water change");
        }
        if (submissionForm.filter_changed) {
          actions.push("Filter changed");
        }
        if (actions.length > 0) {
          submissionForm.action = actions.join(", ");
        }
      }
      return validateMaintenanceLog(submissionForm);
    },
    submit: async () => {
      const submissionForm = { ...formData };
      if (!submissionForm.action) {
        const actions = [];
        if (submissionForm.water_change) {
          actions.push("Water change");
        }
        if (submissionForm.filter_changed) {
          actions.push("Filter changed");
        }
        if (actions.length > 0) {
          submissionForm.action = actions.join(", ");
        }
      }

      const validation = validateMaintenanceLog(submissionForm);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      try {
        if (isEditMode) {
          await updateMaintenanceLog(submissionForm);
        } else {
          await createMaintenanceLog(submissionForm);
        }

        queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
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
              onDayPress={(day) => {
                handleInputChange("log_date", day.dateString);
                setShowDatePicker(false);
              }}
              markedDates={{
                [formData.log_date]: {
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
            {isEditMode ? "Edit Maintenance Log" : "Maintenance"}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {isEditMode
              ? "Update your maintenance record"
              : "Record maintenance actions and filter changes"}
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

        <InputField
          label="Action"
          value={formData.action}
          onChangeText={(v) => handleInputChange("action", v)}
          placeholder="What maintenance was performed?"
          icon={Wrench}
          colors={colors}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          showSuggestions={showSuggestions}
          suggestions={filteredSuggestions}
          onSelectSuggestion={selectSuggestion}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 4,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckCircle2
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: colors.text, fontSize: 16 }}>
              Filter Changed?
            </Text>
          </View>
          <Switch
            value={formData.filter_changed}
            onValueChange={(v) => handleInputChange("filter_changed", v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 4,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Droplet
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: colors.text, fontSize: 16 }}>
              Water Changed?
            </Text>
          </View>
          <Switch
            value={formData.water_change}
            onValueChange={(v) => handleInputChange("water_change", v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <InputField
          label="Notes"
          value={formData.notes}
          onChangeText={(v) => handleInputChange("notes", v)}
          placeholder="Additional details..."
          icon={FileText}
          colors={colors}
        />

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
                    {isEditMode ? "Update Maintenance" : "Save Maintenance"}
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

export default MaintenanceScreen;
