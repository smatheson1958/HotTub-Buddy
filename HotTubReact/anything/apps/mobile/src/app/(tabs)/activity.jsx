import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import LogEntry from "./log";
import UsageEntry from "./usage";
import WeeklyEntry from "./weekly";
import MaintenanceEntry from "./maintenance";

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("daily");
  const [isSaving, setIsSaving] = useState(false);

  // Create refs for each form
  const dailyLogRef = useRef(null);
  const usageLogRef = useRef(null);
  const weeklyCheckRef = useRef(null);
  const maintenanceLogRef = useRef(null);

  const tabs = [
    { id: "daily", label: "Daily Log" },
    { id: "usage", label: "Usage" },
    { id: "weekly", label: "Weekly" },
    { id: "maintenance", label: screenWidth < 430 ? "Maint." : "Maintenance" },
  ];

  const handleSaveAll = async () => {
    setIsSaving(true);
    const savedRecords = [];
    const errors = [];

    try {
      // Check each form and save if it has data
      const forms = [
        { ref: dailyLogRef, name: "Daily Log" },
        { ref: usageLogRef, name: "Usage Log" },
        { ref: weeklyCheckRef, name: "Weekly Check" },
        { ref: maintenanceLogRef, name: "Maintenance Log" },
      ];

      for (const form of forms) {
        if (form.ref.current) {
          const hasData = form.ref.current.hasData();

          if (hasData) {
            const result = await form.ref.current.submit();

            if (result.success) {
              savedRecords.push(form.name);
            } else {
              errors.push(`${form.name}: ${result.errors.join(", ")}`);
            }
          }
        }
      }

      // Show result
      if (savedRecords.length === 0 && errors.length === 0) {
        Alert.alert(
          "No Changes",
          "Please fill in at least one form before saving.",
          [{ text: "OK" }],
        );
      } else if (errors.length > 0) {
        Alert.alert(
          "Save Failed",
          `Could not save:\n\n${errors.join("\n\n")}`,
          [{ text: "OK" }],
        );
      } else {
        Alert.alert(
          "Success!",
          `Saved ${savedRecords.length} record${savedRecords.length > 1 ? "s" : ""}:\n• ${savedRecords.join("\n• ")}`,
          [
            {
              text: "OK",
              onPress: () => router.push("/(tabs)/history"),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Save all error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.surfaceHighest }}
      behavior="padding"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with Back Button */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 12,
              padding: 8,
              borderRadius: 12,
              backgroundColor: colors.surfaceHighest,
            }}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
            Activity
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor:
                  activeTab === tab.id ? colors.primary : colors.surfaceHighest,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color:
                    activeTab === tab.id ? "#FFFFFF" : colors.textSecondary,
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  fontSize: 13,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* All forms rendered but only active one visible */}
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, display: activeTab === "daily" ? "flex" : "none" }}
        >
          <LogEntry ref={dailyLogRef} embedded={true} />
        </View>
        <View
          style={{ flex: 1, display: activeTab === "usage" ? "flex" : "none" }}
        >
          <UsageEntry ref={usageLogRef} embedded={true} />
        </View>
        <View
          style={{ flex: 1, display: activeTab === "weekly" ? "flex" : "none" }}
        >
          <WeeklyEntry ref={weeklyCheckRef} embedded={true} />
        </View>
        <View
          style={{
            flex: 1,
            display: activeTab === "maintenance" ? "flex" : "none",
          }}
        >
          <MaintenanceEntry ref={maintenanceLogRef} embedded={true} />
        </View>
      </View>

      {/* Save All Button */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleSaveAll}
          disabled={isSaving}
          style={{
            backgroundColor: colors.primary,
            height: 56,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text
                style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}
              >
                Save All Changes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
