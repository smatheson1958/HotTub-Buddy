import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import {
  getSettings,
  createWeeklyCheck,
  updateWeeklyCheck,
  deleteWeeklyCheck,
  getHotTubLogs,
  getWeeklyChecks,
} from "@/utils/offlineStorage";
import { validateWeeklyCheck } from "@/utils/formValidation";

/**
 * Custom hook to manage weekly check form state and operations
 */
export const useWeeklyForm = (embedded = false) => {
  const router = useRouter();
  const { editData } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const { data: dailyLogs = [] } = useQuery({
    queryKey: ["hot-tub-logs"],
    queryFn: getHotTubLogs,
  });

  const { data: weeklyChecks = [] } = useQuery({
    queryKey: ["weekly-checks"],
    queryFn: getWeeklyChecks,
  });

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    log_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    combined_chlorine: "",
    total_chlorine: "",
    total_alkalinity: "",
    copper: "",
    shock_added: "",
    shock_type: "",
    alkalinity_up_added: "",
    notes: "",
  });

  useEffect(() => {
    if (editData) {
      try {
        const data = JSON.parse(editData);
        setFormData({
          id: data.id,
          log_date: data.log_date,
          log_time: data.log_time?.slice(0, 5) || "",
          combined_chlorine: data.combined_chlorine?.toString() || "",
          total_chlorine: data.total_chlorine?.toString() || "",
          total_alkalinity: data.total_alkalinity?.toString() || "",
          copper: data.copper?.toString() || "",
          shock_added: data.shock_added?.toString() || "",
          shock_type: data.shock_type || "",
          alkalinity_up_added: data.alkalinity_up_added?.toString() || "",
          notes: data.notes || "",
        });
        setIsEditMode(true);
      } catch (e) {
        console.error("Failed to parse editData", e);
      }
    }
  }, [editData]);

  // Reset form when screen gains focus (unless in edit mode)
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
          combined_chlorine: "",
          total_chlorine: "",
          total_alkalinity: "",
          copper: "",
          shock_added: "",
          shock_type: "",
          alkalinity_up_added: "",
          notes: "",
        });
        setIsEditMode(false);
      }
    }, [editData]),
  );

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // No auto-calculation for weekly page - combined and total are independent
      return updated;
    });
  };

  const handleSubmit = async () => {
    const validation = validateWeeklyCheck(formData);

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n\n"), [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      const checkData = {
        ...formData,
        combined_chlorine: formData.combined_chlorine
          ? parseFloat(formData.combined_chlorine)
          : null,
        total_chlorine: formData.total_chlorine
          ? parseFloat(formData.total_chlorine)
          : null,
        total_alkalinity: formData.total_alkalinity
          ? parseFloat(formData.total_alkalinity)
          : null,
        copper: formData.copper ? parseFloat(formData.copper) : null,
        shock_added: formData.shock_added
          ? parseFloat(formData.shock_added)
          : 0,
        shock_type: formData.shock_type || null,
        alkalinity_up_added: formData.alkalinity_up_added
          ? parseFloat(formData.alkalinity_up_added)
          : 0,
      };

      if (isEditMode) {
        await updateWeeklyCheck(checkData);
      } else {
        await createWeeklyCheck(checkData);
      }

      queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      Alert.alert(
        "Success",
        isEditMode
          ? "Weekly check updated successfully!"
          : "Weekly check recorded successfully!",
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
          combined_chlorine: "",
          total_chlorine: "",
          total_alkalinity: "",
          copper: "",
          shock_added: "",
          shock_type: "",
          alkalinity_up_added: "",
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
      "Are you sure you want to delete this weekly check?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteWeeklyCheck(formData.id);
              queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
              Alert.alert("Success", "Weekly check deleted successfully!");
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

  const getFormData = () => formData;

  const hasData = () => {
    return !!(
      formData.combined_chlorine ||
      formData.total_chlorine ||
      formData.total_alkalinity ||
      formData.copper ||
      formData.shock_added ||
      formData.alkalinity_up_added ||
      formData.notes
    );
  };

  const validate = () => validateWeeklyCheck(formData);

  const submit = async () => {
    const validation = validateWeeklyCheck(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const checkData = {
        ...formData,
        combined_chlorine: formData.combined_chlorine
          ? parseFloat(formData.combined_chlorine)
          : null,
        total_chlorine: formData.total_chlorine
          ? parseFloat(formData.total_chlorine)
          : null,
        total_alkalinity: formData.total_alkalinity
          ? parseFloat(formData.total_alkalinity)
          : null,
        copper: formData.copper ? parseFloat(formData.copper) : null,
        shock_added: formData.shock_added
          ? parseFloat(formData.shock_added)
          : 0,
        shock_type: formData.shock_type || null,
        alkalinity_up_added: formData.alkalinity_up_added
          ? parseFloat(formData.alkalinity_up_added)
          : 0,
      };

      if (isEditMode) {
        await updateWeeklyCheck(checkData);
      } else {
        await createWeeklyCheck(checkData);
      }

      queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
      queryClient.invalidateQueries({ queryKey: ["all-history"] });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, errors: [error.message] };
    }
  };

  return {
    settings,
    dailyLogs,
    weeklyChecks,
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
  };
};
