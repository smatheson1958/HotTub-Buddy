import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { subDays } from "date-fns";
import {
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  createWeeklyCheck,
  updateWeeklyCheck,
  deleteWeeklyCheck,
} from "@/utils/offlineStorage";
import {
  validateMaintenanceLog,
  validateWeeklyCheck,
  validateField,
} from "@/utils/formValidation";

export function useMaintenanceForm(editData) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [logType, setLogType] = useState("weekly");
  const [editType, setEditType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field-level error tracking
  const [maintenanceErrors, setMaintenanceErrors] = useState({});
  const [weeklyErrors, setWeeklyErrors] = useState({});

  const [maintenanceForm, setMaintenanceForm] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    action: "",
    notes: "",
    filter_changed: false,
  });

  const [weeklyForm, setWeeklyForm] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    total_alkalinity: "",
    copper: "",
    shock_added: "",
    shock_type: "",
    filter_cleaned: false,
    notes: "",
  });

  // Field validation functions
  const validateMaintenanceField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "log_date":
        error = validateField.date(value);
        break;
      case "action":
        error = validateField.action(value);
        break;
      default:
        break;
    }

    setMaintenanceErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateWeeklyField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "log_date":
        error = validateField.date(value);
        break;
      case "total_alkalinity":
        error = validateField.totalAlkalinity(value);
        break;
      case "copper":
        error = validateField.copper(value);
        break;
      case "shock_added":
        error = validateField.shock(value);
        break;
      case "shock_type":
        error = validateField.shockType(value, weeklyForm.shock_added);
        break;
      default:
        break;
    }

    setWeeklyErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Clear all errors
  const clearErrors = () => {
    setMaintenanceErrors({});
    setWeeklyErrors({});
  };

  // Reset forms when screen gains focus (unless in edit mode)
  useFocusEffect(
    React.useCallback(() => {
      if (!editData) {
        setMaintenanceForm({
          log_date: new Date().toISOString().split("T")[0],
          log_time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          action: "",
          notes: "",
          filter_changed: false,
        });
        setWeeklyForm({
          log_date: new Date().toISOString().split("T")[0],
          log_time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          total_alkalinity: "",
          copper: "",
          shock_added: "",
          shock_type: "",
          filter_cleaned: false,
          notes: "",
        });
        setIsEditMode(false);
        setEditType(null);
        clearErrors();
      }
    }, [editData]),
  );

  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);

        if (
          data.total_alkalinity !== undefined ||
          data.shock_added !== undefined
        ) {
          setWeeklyForm({
            id: data.id,
            log_date: data.log_date,
            log_time: data.log_time?.slice(0, 5) || "",
            total_alkalinity: data.total_alkalinity?.toString() || "",
            copper: data.copper?.toString() || "",
            shock_added: data.shock_added?.toString() || "",
            shock_type: data.shock_type || "",
            filter_cleaned: !!data.filter_cleaned,
            notes: data.notes || "",
          });
          setLogType("weekly");
          setEditType("weekly");
        } else {
          setMaintenanceForm({
            id: data.id,
            log_date: data.log_date,
            log_time: data.log_time?.slice(0, 5) || "",
            action: data.action || "",
            notes: data.notes || "",
            filter_changed: data.filter_changed || false,
          });
          setLogType("maintenance");
          setEditType("maintenance");
        }
        setIsEditMode(true);
        clearErrors();
      } catch (e) {
        console.error("Failed to parse editData", e);
      }
    }
  }, [editData]);

  const setQuickDate = (daysAgo) => {
    const date = subDays(new Date(), daysAgo);
    const dateString = date.toISOString().split("T")[0];
    if (logType === "maintenance") {
      setMaintenanceForm({ ...maintenanceForm, log_date: dateString });
    } else {
      setWeeklyForm({ ...weeklyForm, log_date: dateString });
    }
  };

  const setNowTime = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    if (logType === "maintenance") {
      setMaintenanceForm({ ...maintenanceForm, log_time: now });
    } else {
      setWeeklyForm({ ...weeklyForm, log_time: now });
    }
  };

  const copyLastEntry = (pastLogs) => {
    if (pastLogs.length === 0) {
      Alert.alert(
        "No Previous Logs",
        "There are no previous logs to copy from.",
      );
      return;
    }

    const lastLog = pastLogs[0];
    Alert.alert(
      "Copy Last Entry",
      `Copy data from: ${lastLog.action || "Last maintenance"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy",
          onPress: () => {
            setMaintenanceForm({
              ...maintenanceForm,
              action: lastLog.action || "",
              notes: lastLog.notes || "",
              filter_changed: lastLog.filter_changed || false,
            });
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (logType === "maintenance") {
        const submissionForm = { ...maintenanceForm };
        if (!submissionForm.action && submissionForm.filter_changed) {
          submissionForm.action = "Filter changed";
        }

        // Validate maintenance log before submission
        const validation = validateMaintenanceLog(submissionForm);
        if (!validation.isValid) {
          Alert.alert("Validation Error", validation.errors.join("\n\n"), [
            { text: "OK" },
          ]);
          setIsSubmitting(false);
          return;
        }

        if (isEditMode && editType === "maintenance") {
          await updateMaintenanceLog(submissionForm);
        } else {
          await createMaintenanceLog(submissionForm);
        }

        queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
      } else {
        const submissionForm = {
          ...weeklyForm,
          total_alkalinity: weeklyForm.total_alkalinity
            ? parseFloat(weeklyForm.total_alkalinity)
            : null,
          copper: weeklyForm.copper ? parseFloat(weeklyForm.copper) : null,
          shock_added: weeklyForm.shock_added
            ? parseFloat(weeklyForm.shock_added)
            : 0,
          shock_type: weeklyForm.shock_type || null,
        };

        // Validate weekly check before submission
        const validation = validateWeeklyCheck(weeklyForm);
        if (!validation.isValid) {
          Alert.alert("Validation Error", validation.errors.join("\n\n"), [
            { text: "OK" },
          ]);
          setIsSubmitting(false);
          return;
        }

        if (isEditMode && editType === "weekly") {
          await updateWeeklyCheck(submissionForm);
        } else {
          await createWeeklyCheck(submissionForm);
        }

        queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
      }

      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      Alert.alert(
        "Success",
        isEditMode
          ? `${logType === "maintenance" ? "Maintenance log" : "Weekly check"} updated successfully!`
          : `${logType === "maintenance" ? "Maintenance log" : "Weekly check"} saved successfully!`,
      );

      if (isEditMode) {
        router.back();
      } else {
        if (logType === "maintenance") {
          setMaintenanceForm({
            log_date: new Date().toISOString().split("T")[0],
            log_time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            action: "",
            notes: "",
            filter_changed: false,
          });
        } else {
          setWeeklyForm({
            log_date: new Date().toISOString().split("T")[0],
            log_time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            total_alkalinity: "",
            copper: "",
            shock_added: "",
            shock_type: "",
            filter_cleaned: false,
            notes: "",
          });
        }
        clearErrors();
        router.push("/(tabs)/history");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save the log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Log",
      `Are you sure you want to delete this ${logType === "maintenance" ? "maintenance log" : "weekly check"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsSubmitting(true);
            try {
              if (editType === "maintenance") {
                await deleteMaintenanceLog(maintenanceForm.id);
                queryClient.invalidateQueries({
                  queryKey: ["maintenance-logs"],
                });
              } else {
                await deleteWeeklyCheck(weeklyForm.id);
                queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
              }
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
              Alert.alert(
                "Success",
                `${editType === "maintenance" ? "Maintenance log" : "Weekly check"} deleted successfully!`,
              );
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete the log.");
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return {
    maintenanceForm,
    setMaintenanceForm,
    weeklyForm,
    setWeeklyForm,
    logType,
    setLogType,
    editType,
    isEditMode,
    isSubmitting,
    showDatePicker,
    setShowDatePicker,
    showSuggestions,
    setShowSuggestions,
    filteredSuggestions,
    setFilteredSuggestions,
    setQuickDate,
    setNowTime,
    copyLastEntry,
    handleSubmit,
    handleDelete,
    // New field validation exports
    maintenanceErrors,
    weeklyErrors,
    validateMaintenanceField,
    validateWeeklyField,
    clearErrors,
  };
}
