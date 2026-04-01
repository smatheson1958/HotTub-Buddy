import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import {
  createHotTubLog,
  updateHotTubLog,
  deleteHotTubLog,
} from "@/utils/offlineStorage";
import { validateDailyLog, validateField } from "@/utils/formValidation";

export function useLogEntryForm() {
  const router = useRouter();
  const { editData } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    chlorine_1: "",
    chlorine_2: "",
    chlorine_3: "",
    ph: "",
    water_temperature: null,
    notes: "",
    added_chlorine: "",
    added_ph_up: "",
    added_ph_down: "",
  });

  // Load edit data if provided
  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);
        setFormData({
          id: data.id,
          log_date: data.log_date,
          log_time: data.log_time?.slice(0, 5) || "",
          chlorine_1: data.chlorine_1?.toString() || "",
          chlorine_2: data.chlorine_2?.toString() || "",
          chlorine_3: data.chlorine_3?.toString() || "",
          ph: data.ph?.toString() || "",
          water_temperature: data.water_temperature || null,
          notes: data.notes || "",
          added_chlorine: data.added_chlorine?.toString() || "",
          added_ph_up: data.added_ph_up?.toString() || "",
          added_ph_down: data.added_ph_down?.toString() || "",
        });
        setIsEditMode(true);
      } catch (e) {
        console.error("Failed to parse editData", e);
      }
    }
  }, [editData]);

  const resetForm = () => {
    setFormData({
      log_date: new Date().toISOString().split("T")[0],
      log_time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      chlorine_1: "",
      chlorine_2: "",
      chlorine_3: "",
      ph: "",
      water_temperature: null,
      notes: "",
      added_chlorine: "",
      added_ph_up: "",
      added_ph_down: "",
    });
    setIsEditMode(false);
    setFieldErrors({});
  };

  const validateFieldOnBlur = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "log_date":
        error = validateField.date(value);
        break;
      case "ph":
        error = validateField.ph(value);
        break;
      case "chlorine_1":
      case "chlorine_2":
      case "chlorine_3":
        error = validateField.chlorine(value);
        break;
      case "added_chlorine":
      case "added_ph_up":
      case "added_ph_down":
        error = validateField.addedChemical(value);
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const setQuickDate = (daysAgo) => {
    const date = subDays(new Date(), daysAgo);
    handleInputChange("log_date", date.toISOString().split("T")[0]);
  };

  const setNowTime = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    handleInputChange("log_time", now);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate chlorine/bromine values
      const free = parseFloat(updated.chlorine_1) || 0;
      const combined = parseFloat(updated.chlorine_2) || 0;
      const total = parseFloat(updated.chlorine_3) || 0;

      // For chlorine, auto-calculate between free, combined, and total
      if (name === "chlorine_1" || name === "chlorine_2") {
        // If Free or Combined changed, calculate Total (rounded to 1 decimal)
        if (updated.chlorine_1 && updated.chlorine_2) {
          updated.chlorine_3 = (
            Math.round((free + combined) * 10) / 10
          ).toString();
        }
      } else if (name === "chlorine_3") {
        // If Total changed and Free exists, calculate Combined (rounded to 1 decimal)
        if (updated.chlorine_1 && updated.chlorine_3) {
          updated.chlorine_2 = (
            Math.round((total - free) * 10) / 10
          ).toString();
        }
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    // Validate form data before submission
    const validation = validateDailyLog(formData);

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n\n"), [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      const logData = {
        ...formData,
        chlorine_1: formData.chlorine_1
          ? parseFloat(formData.chlorine_1)
          : null,
        chlorine_2: formData.chlorine_2
          ? parseFloat(formData.chlorine_2)
          : null,
        chlorine_3: formData.chlorine_3
          ? parseFloat(formData.chlorine_3)
          : null,
        ph: formData.ph ? parseFloat(formData.ph) : null,
        water_temperature: formData.water_temperature,
        added_chlorine: formData.added_chlorine
          ? parseFloat(formData.added_chlorine)
          : 0,
        added_ph_up: formData.added_ph_up
          ? parseFloat(formData.added_ph_up)
          : 0,
        added_ph_down: formData.added_ph_down
          ? parseFloat(formData.added_ph_down)
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
          ? "Log updated successfully!"
          : "Hot tub data recorded successfully!",
      );

      if (isEditMode) {
        router.back();
      } else {
        resetForm();
        router.push("/(tabs)/history");
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
      "Delete Log",
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
              Alert.alert("Error", "Could not delete the log.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return {
    formData,
    loading,
    isEditMode,
    fieldErrors,
    handleInputChange,
    validateFieldOnBlur,
    setQuickDate,
    setNowTime,
    handleSubmit,
    handleDelete,
    resetForm,
  };
}
