import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import {
  Calendar as CalendarIcon,
  Save,
  FileText,
  Droplets,
  TestTube,
  Zap,
  TrendingUp,
  TrendingDown,
  Waves,
  X,
  Clock,
  Trash2,
  Thermometer,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import useTheme from "@/utils/useTheme";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isValid } from "date-fns";
import {
  getSettings,
  createHotTubLog,
  updateHotTubLog,
  deleteHotTubLog,
  getHotTubLogs,
  getWeeklyChecks,
} from "@/utils/offlineStorage";
import { validateDailyLog } from "@/utils/formValidation";
import HelpModal from "@/components/HelpModal";
// import { TripPlanningCalculator } from "@/components/TripPlanningCalculator";
import { getCurrentRate, getAverageRate } from "@/utils/rateCalculator";

// Helper function to safely format dates
const safeFormatDate = (dateString, formatStr = "dd MMM yy") => {
  if (!dateString) return "";
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString; // Return original if invalid
    return format(parsed, formatStr);
  } catch (e) {
    console.error("Date formatting error:", e, "for date:", dateString);
    return dateString; // Return original if error
  }
};

const InputField = React.memo(
  forwardRef(
    (
      {
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
      },
      ref,
    ) => (
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
            ref={ref}
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
  ),
);

const LogEntryScreen = forwardRef((props, ref) => {
  const { embedded = false } = props;
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { editData } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  // Fetch all logs for consumption calculations
  const { data: allDailyLogs = [] } = useQuery({
    queryKey: ["hot-tub-logs"],
    queryFn: getHotTubLogs,
  });

  const { data: weeklyLogs = [] } = useQuery({
    queryKey: ["weekly-checks"],
    queryFn: getWeeklyChecks,
  });

  const isMetric = settings?.measurement_system !== "imperial";
  const weightUnit = isMetric ? "g" : "oz";
  const sanitizerType = settings?.sanitizer_type || "chlorine";
  const isBromine = sanitizerType === "bromine";
  const isCelsius = settings?.temperature_unit !== "fahrenheit";
  const tempUnit = isCelsius ? "°C" : "°F";

  // Calculate consumption rates
  const volumeLitres = settings?.volume_litres || 1000;
  const currentRate = getCurrentRate(allDailyLogs, volumeLitres, weeklyLogs);
  const avgRate = getAverageRate(allDailyLogs, volumeLitres, 7, weeklyLogs);

  // Generate temperature options based on unit
  const generateTempOptions = () => {
    if (isCelsius) {
      // 15°C to 40°C
      return Array.from({ length: 26 }, (_, i) => 15 + i);
    } else {
      // 59°F to 104°F
      return Array.from({ length: 46 }, (_, i) => 59 + i);
    }
  };

  const tempOptions = generateTempOptions();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [helpTopic, setHelpTopic] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    water_temperature: isCelsius ? 37 : 98,
    ph: "",
    sanitizer_free: "",
    sanitizer_combined_or_total: "",
    added_ph_down: "",
    added_ph_up: "",
    added_sanitizer: "",
    notes: "",
  });

  // Create refs for all input fields
  const phRef = useRef(null);
  const sanitizer1Ref = useRef(null);
  const sanitizerAddedRef = useRef(null);
  const phDownRef = useRef(null);
  const phUpRef = useRef(null);

  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);
        setFormData({
          id: data.id,
          log_date: data.log_date,
          log_time: data.log_time?.slice(0, 5) || "",
          water_temperature: data.water_temperature || (isCelsius ? 37 : 98),
          ph: data.ph?.toString() || "",
          sanitizer_free: data.sanitizer_free?.toString() || "",
          sanitizer_combined_or_total:
            data.sanitizer_combined_or_total?.toString() || "",
          added_ph_down: data.added_ph_down?.toString() || "",
          added_ph_up: data.added_ph_up?.toString() || "",
          added_sanitizer: data.added_sanitizer?.toString() || "",
          notes: data.notes || "",
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
          water_temperature: isCelsius ? 37 : 98,
          ph: "",
          sanitizer_free: "",
          sanitizer_combined_or_total: "",
          added_ph_down: "",
          added_ph_up: "",
          added_sanitizer: "",
          notes: "",
        });
        setIsEditMode(false);
      }
    }, [editData]),
  );

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validation = validateDailyLog(formData);

    if (!validation.isValid) {
      // Focus on first field with error
      const fieldOrder = [
        { name: "ph", ref: phRef },
        { name: "sanitizer_free", ref: sanitizer1Ref },
        { name: "added_sanitizer", ref: sanitizerAddedRef },
        { name: "added_ph_down", ref: phDownRef },
        { name: "added_ph_up", ref: phUpRef },
      ];

      // Find first field mentioned in errors and focus it
      for (const field of fieldOrder) {
        const hasError = validation.errors.some((error) =>
          error.toLowerCase().includes(field.name.replace("_", " ")),
        );
        if (hasError && field.ref.current) {
          field.ref.current.focus();
          break;
        }
      }

      Alert.alert("Validation Error", validation.errors.join("\n\n"), [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      const logData = {
        ...formData,
        water_temperature: formData.water_temperature,
        ph: formData.ph ? parseFloat(formData.ph) : null,
        sanitizer_free: formData.sanitizer_free
          ? parseFloat(formData.sanitizer_free)
          : null,
        sanitizer_combined_or_total: formData.sanitizer_combined_or_total
          ? parseFloat(formData.sanitizer_combined_or_total)
          : null,
        added_ph_down: formData.added_ph_down
          ? parseFloat(formData.added_ph_down)
          : 0,
        added_ph_up: formData.added_ph_up
          ? parseFloat(formData.added_ph_up)
          : 0,
        added_sanitizer: formData.added_sanitizer
          ? parseFloat(formData.added_sanitizer)
          : 0,
      };

      if (isEditMode) {
        await updateHotTubLog(logData);
      } else {
        await createHotTubLog(logData);
      }

      queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      Alert.alert(
        "Success",
        isEditMode
          ? "Log entry updated successfully!"
          : "Log entry recorded successfully!",
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
          water_temperature: isCelsius ? 37 : 98,
          ph: "",
          sanitizer_free: "",
          sanitizer_combined_or_total: "",
          added_ph_down: "",
          added_ph_up: "",
          added_sanitizer: "",
          notes: "",
        });
        router.push("/(tabs)"); // Navigate to dashboard
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save the record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this log entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteHotTubLog(formData.id);
              queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
              Alert.alert("Success", "Log entry deleted successfully!");
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
    getFormData: () => formData,
    hasData: () => {
      // Check if any meaningful data is entered
      return !!(
        formData.ph ||
        formData.sanitizer_free ||
        formData.sanitizer_combined_or_total ||
        formData.added_ph_down ||
        formData.added_ph_up ||
        formData.added_sanitizer ||
        formData.notes
      );
    },
    validate: () => validateDailyLog(formData),
    submit: async () => {
      const validation = validateDailyLog(formData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      try {
        const logData = {
          ...formData,
          water_temperature: formData.water_temperature,
          ph: formData.ph ? parseFloat(formData.ph) : null,
          sanitizer_free: formData.sanitizer_free
            ? parseFloat(formData.sanitizer_free)
            : null,
          sanitizer_combined_or_total: formData.sanitizer_combined_or_total
            ? parseFloat(formData.sanitizer_combined_or_total)
            : null,
          added_ph_down: formData.added_ph_down
            ? parseFloat(formData.added_ph_down)
            : 0,
          added_ph_up: formData.added_ph_up
            ? parseFloat(formData.added_ph_up)
            : 0,
          added_sanitizer: formData.added_sanitizer
            ? parseFloat(formData.added_sanitizer)
            : 0,
        };

        if (isEditMode) {
          await updateHotTubLog(logData);
        } else {
          await createHotTubLog(logData);
        }

        queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
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

      <HelpModal
        visible={showHelpModal}
        onClose={closeHelp}
        topic={helpTopic}
        sanitizerType={sanitizerType}
        isMetric={isMetric}
      />

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
            {isEditMode ? "Edit Log Entry" : "Daily Log"}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {isEditMode
              ? "Update your hot tub readings"
              : "Record your daily hot tub readings"}
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
              Water Temperature
            </Text>
            <TouchableOpacity
              onPress={() => openHelp("temperature")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HelpCircle size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              height: 56,
            }}
          >
            <Thermometer
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 12 }}
            />

            <TouchableOpacity
              onPress={() => {
                const minTemp = isCelsius ? 15 : 59;
                const newTemp = Math.max(
                  minTemp,
                  formData.water_temperature - 1,
                );
                handleInputChange("water_temperature", newTemp);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.surfaceHighest,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: colors.text }}
              >
                {formData.water_temperature}
                {tempUnit}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                const maxTemp = isCelsius ? 40 : 104;
                const newTemp = Math.min(
                  maxTemp,
                  formData.water_temperature + 1,
                );
                handleInputChange("water_temperature", newTemp);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.surfaceHighest,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Chemical Readings
            </Text>
          </View>

          <InputField
            ref={sanitizer1Ref}
            label={`${isBromine ? "Bromine" : "Free Chlorine"} (ppm)`}
            value={formData.sanitizer_free}
            onChangeText={(v) => handleInputChange("sanitizer_free", v)}
            placeholder={isBromine ? "3.0-5.0" : "1.0-3.0"}
            keyboardType="numeric"
            icon={Droplets}
            colors={colors}
            onHelp={() => openHelp("sanitizer")}
          />

          <InputField
            ref={phRef}
            label="pH"
            value={formData.ph}
            onChangeText={(v) => handleInputChange("ph", v)}
            placeholder="7.2-7.8"
            keyboardType="numeric"
            icon={TestTube}
            colors={colors}
            onHelp={() => openHelp("ph")}
          />
        </View>

        {/* Add Trip Planning Calculator */}
        {/* <TripPlanningCalculator
          avgRate={avgRate}
          currentChlorine={parseFloat(formData.chlorine_1) || null}
          volumeLitres={volumeLitres}
          weightUnit={weightUnit}
          colors={colors}
          isBromine={isBromine}
        /> */}

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Chemicals Added
            </Text>
            <TouchableOpacity
              onPress={() => openHelp("chemicals-added")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HelpCircle size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <InputField
            ref={sanitizerAddedRef}
            label={`${isBromine ? "Bromine" : "Chlorine"} Added (${weightUnit})`}
            value={formData.added_sanitizer}
            onChangeText={(v) => handleInputChange("added_sanitizer", v)}
            placeholder={`0.0 ${weightUnit}`}
            keyboardType="numeric"
            icon={Zap}
            colors={colors}
          />

          <InputField
            ref={phDownRef}
            label={`pH Down Added (${weightUnit})`}
            value={formData.added_ph_down}
            onChangeText={(v) => handleInputChange("added_ph_down", v)}
            placeholder={`0.0 ${weightUnit}`}
            keyboardType="numeric"
            icon={TrendingDown}
            colors={colors}
          />

          <InputField
            ref={phUpRef}
            label={`pH Up Added (${weightUnit})`}
            value={formData.added_ph_up}
            onChangeText={(v) => handleInputChange("added_ph_up", v)}
            placeholder={`0.0 ${weightUnit}`}
            keyboardType="numeric"
            icon={TrendingUp}
            colors={colors}
          />
        </View>

        <InputField
          label="Notes"
          value={formData.notes}
          onChangeText={(v) => handleInputChange("notes", v)}
          placeholder="Any observations..."
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
                    {isEditMode ? "Update Log Entry" : "Save Log Entry"}
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

export default LogEntryScreen;
