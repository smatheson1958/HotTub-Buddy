import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Settings,
  Save,
  Info,
  Ruler,
  Droplets,
  Beaker,
  Database,
  FileUp,
  FileDown,
  AlertTriangle,
  ShieldAlert,
  FileText,
} from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { getSettings, saveSettings } from "@/utils/offlineStorage";
import { exportAllDataToCSV, importDataFromCSV } from "@/utils/csvExportImport";
import DisclaimerModal, {
  DISCLAIMER_VERSION,
} from "@/components/DisclaimerModal";
import useDisclaimerAcceptance from "@/utils/useDisclaimerAcceptance";

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();
  const { acceptedVersion } = useDisclaimerAcceptance();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState("liters");
  const [system, setSystem] = useState("metric");
  const [sanitizer, setSanitizer] = useState("chlorine");
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  useEffect(() => {
    if (settings) {
      setCapacity(settings.capacity?.toString() || "");
      setCapacityUnit(settings.capacity_unit || "liters");
      setSystem(settings.measurement_system || "metric");
      setSanitizer(settings.sanitizer_type || "chlorine");
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        capacity: parseFloat(capacity) || 0,
        capacity_unit: capacityUnit,
        measurement_system: system,
        sanitizer_type: sanitizer,
        temperature_unit: system === "metric" ? "celsius" : "fahrenheit",
      });
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
      Alert.alert("Success", "Settings saved successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllDataToCSV();
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const success = await importDataFromCSV();
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
        queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
        queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
        queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
        queryClient.invalidateQueries({ queryKey: ["all-history"] });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.surfaceHighest,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.surfaceHighest }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <DisclaimerModal
        visible={showDisclaimerModal}
        onAccept={() => setShowDisclaimerModal(false)}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            App Setup
          </Text>
          <Text
            style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}
          >
            Configure your hot tub capacity and units
          </Text>
        </View>

        {/* Combined Measurement System & Temperature Toggle */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Ruler size={24} color={colors.primary} />
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: colors.text }}
            >
              Measurement System
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
              backgroundColor: colors.surfaceHighest,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color:
                  system === "metric" ? colors.primary : colors.textTertiary,
                fontWeight: "600",
              }}
            >
              Metric
            </Text>
            <Switch
              value={system === "imperial"}
              onValueChange={(val) => setSystem(val ? "imperial" : "metric")}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
            <Text
              style={{
                color:
                  system === "imperial" ? colors.primary : colors.textTertiary,
                fontWeight: "600",
              }}
            >
              Imperial
            </Text>
          </View>

          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Metric uses Celsius (°C), grams (g), and liters. Imperial uses
            Fahrenheit (°F), ounces (oz), and gallons.
          </Text>
        </View>

        {/* Sanitizer Type Toggle */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Beaker size={24} color={colors.primary} />
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: colors.text }}
            >
              Sanitizer Type
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
              backgroundColor: colors.surfaceHighest,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color:
                  sanitizer === "chlorine"
                    ? colors.primary
                    : colors.textTertiary,
                fontWeight: "600",
              }}
            >
              Chlorine
            </Text>
            <Switch
              value={sanitizer === "bromine"}
              onValueChange={(val) =>
                setSanitizer(val ? "bromine" : "chlorine")
              }
              trackColor={{ false: colors.border, true: colors.primary }}
            />
            <Text
              style={{
                color:
                  sanitizer === "bromine"
                    ? colors.primary
                    : colors.textTertiary,
                fontWeight: "600",
              }}
            >
              Bromine
            </Text>
          </View>

          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            {sanitizer === "chlorine"
              ? "Chlorine is the most common sanitizer. Ideal range: 1-3 ppm (free), 3-5 ppm (total)."
              : "Bromine works better in hot water and has less odor. Ideal range: 3-5 ppm."}
          </Text>
        </View>

        {/* Capacity Settings */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Droplets size={24} color={colors.primary} />
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: colors.text }}
            >
              Hot Tub Capacity
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Total Volume
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.surfaceHighest,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              placeholder="Enter capacity"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Capacity Unit
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {["liters", "gallons"].map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() => setCapacityUnit(unit)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor:
                    capacityUnit === unit ? colors.primary : colors.border,
                  backgroundColor:
                    capacityUnit === unit
                      ? colors.primary + "10"
                      : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color:
                      capacityUnit === unit
                        ? colors.primary
                        : colors.textSecondary,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.primary + "10",
            padding: 16,
            borderRadius: 16,
            marginBottom: 32,
            gap: 12,
          }}
        >
          <Info size={20} color={colors.primary} />
          <Text
            style={{
              flex: 1,
              color: colors.primary,
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            These settings help calculate chemical dosages and ensure your logs
            use the correct units and sanitizer labels for your setup.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 18,
            borderRadius: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            marginBottom: 32,
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text
                style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}
              >
                Save Settings
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Data Management Section */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Database size={24} color={colors.primary} />
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: colors.text }}
            >
              Data Management
            </Text>
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            Export your logs to a CSV file for backup, or import data from a
            previous export.
          </Text>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleExport}
              disabled={isExporting}
              style={{
                backgroundColor: colors.primary + "10",
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                borderWidth: 1,
                borderColor: colors.primary,
              }}
            >
              {isExporting ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <FileDown size={20} color={colors.primary} />
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Export All Data
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleImport}
              disabled={isImporting}
              style={{
                backgroundColor: colors.surfaceHighest,
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isImporting ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <FileUp size={20} color={colors.text} />
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Import Data
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.primary + "10",
              padding: 12,
              borderRadius: 12,
              marginTop: 16,
              gap: 12,
            }}
          >
            <Info size={16} color={colors.primary} style={{ marginTop: 2 }} />
            <Text
              style={{
                flex: 1,
                color: colors.primary,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              Importing will replace all existing data. Make sure to export
              first if you want to keep a backup.
            </Text>
          </View>
        </View>

        {/* About This App Section */}
        {/* <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 40, textAlign: "center" }}>☕</Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              textAlign: "center",
              marginBottom: 16,
              lineHeight: 24,
            }}
          >
            This app is free and built as a hobby project.
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 8,
            }}
          >
            If it helps you keep your hot tub water perfect, you'll be able to
            buy me a coffee ☕ in a future update.
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            For now, just enjoy!
          </Text>
        </View> */}

        {/* Disclaimer Section */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <ShieldAlert size={24} color="#F59E0B" />
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: colors.text }}
            >
              Important Disclaimer
            </Text>
          </View>

          {acceptedVersion && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                Accepted version {acceptedVersion} • Last updated February 20,
                2026
              </Text>
            </View>
          )}

          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 22,
              marginBottom: 12,
            }}
          >
            This is a{" "}
            <Text style={{ fontWeight: "700", color: colors.text }}>
              free, non-commercial informational app
            </Text>{" "}
            provided by Curley Brackets Engineering Ltd for tracking and
            reference purposes only. It does not provide professional advice and
            does not replace manufacturer instructions or professional services.
          </Text>

          <View
            style={{
              backgroundColor: colors.surfaceHighest,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              gap: 12,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                Water Chemistry
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                This app is a{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  logging and tracking tool
                </Text>{" "}
                for recording your hot tub maintenance. Any water chemistry
                values, ranges, or guidance shown are{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  for reference only
                </Text>
                . The app does not calculate or recommend chemical dosages.
                Always follow your hot tub or spa manufacturer's guidance and
                the instructions on chemical products. Users are responsible for{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  testing their own water
                </Text>{" "}
                and making their own decisions about chemical treatment.
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                Safety
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                Pool and spa chemicals can be hazardous if handled incorrectly.
                Always read and follow product labels, safety warnings, and
                safety data sheets.
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                Local Laws
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                Laws, standards, and recommended practices may vary by country
                or region. Users are responsible for ensuring compliance with{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  local regulations
                </Text>{" "}
                and manufacturer guidance.
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                No Warranty / Limitation of Liability
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                This app is provided{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  "as is"
                </Text>
                , without warranties of any kind. To the fullest extent
                permitted by applicable law, Curley Brackets Engineering Ltd
                accepts{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  no liability for loss, damage, or injury
                </Text>{" "}
                arising from use of this app. Use of the app is entirely{" "}
                <Text style={{ fontWeight: "700", color: colors.text }}>
                  at the user's own risk
                </Text>
                .
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#FEF3C7",
              padding: 12,
              borderRadius: 12,
              gap: 12,
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={16} color="#92400E" style={{ marginTop: 2 }} />
            <Text
              style={{
                flex: 1,
                color: "#92400E",
                fontSize: 12,
                lineHeight: 18,
                fontWeight: "500",
              }}
            >
              Always test your water before adding chemicals and{" "}
              <Text style={{ fontWeight: "700" }}>never</Text> exceed
              manufacturer dosing guidelines.
            </Text>
          </View>

          {/* View Full Disclaimer Button */}
          <TouchableOpacity
            onPress={() => setShowDisclaimerModal(true)}
            style={{
              backgroundColor: colors.surfaceHighest,
              paddingVertical: 14,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <FileText size={18} color={colors.text} />
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              View Full Disclaimer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}
