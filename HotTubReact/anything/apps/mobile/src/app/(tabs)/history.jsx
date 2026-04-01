import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Droplet,
  Beaker,
  Calendar,
  Clock,
  ChevronRight,
  Waves,
  Zap,
  CheckCircle2,
  Wrench,
  Users,
  Timer,
  Trash2,
  Check,
  Plus,
} from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { format, parseISO } from "date-fns";
import {
  getSettings,
  getHotTubLogs,
  getWeeklyChecks,
  getMaintenanceLogs,
  getUsageLogs,
  deleteHotTubLog,
  deleteWeeklyCheck,
  deleteMaintenanceLog,
  deleteUsageLog,
} from "@/utils/offlineStorage";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFilters, setSelectedFilters] = useState([
    "daily",
    "usage",
    "weekly",
    "maintenance",
  ]);
  const screenWidth = Dimensions.get("window").width;
  const isSmallScreen = screenWidth < 380;

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const isMetric = settings?.measurement_system !== "imperial";
  const weightUnit = isMetric ? "g" : "oz";
  // Add sanitizer label based on sanitizer_type
  const sanitizerLabel = settings?.sanitizer_type === "bromine" ? "BR" : "CL";

  const {
    data: dailyLogs = [],
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
    isRefetching: isRefetchingDaily,
  } = useQuery({
    queryKey: ["hot-tub-logs"],
    queryFn: getHotTubLogs,
  });

  const {
    data: weeklyLogs = [],
    isLoading: isLoadingWeekly,
    refetch: refetchWeekly,
    isRefetching: isRefetchingWeekly,
  } = useQuery({
    queryKey: ["weekly-checks"],
    queryFn: getWeeklyChecks,
  });

  const {
    data: maintenanceLogs = [],
    isLoading: isLoadingMaint,
    refetch: refetchMaint,
    isRefetching: isRefetchingMaint,
  } = useQuery({
    queryKey: ["maintenance-logs"],
    queryFn: getMaintenanceLogs,
  });

  const {
    data: usageLogs = [],
    isLoading: isLoadingUsage,
    refetch: refetchUsage,
    isRefetching: isRefetchingUsage,
  } = useQuery({
    queryKey: ["usage-logs"],
    queryFn: getUsageLogs,
  });

  const combinedLogs = [
    ...dailyLogs.map((l) => ({ ...l, type: "daily" })),
    ...weeklyLogs.map((l) => ({ ...l, type: "weekly" })),
    ...maintenanceLogs.map((l) => ({ ...l, type: "maintenance" })),
    ...usageLogs.map((l) => ({
      ...l,
      type: "usage",
      log_date: l.usage_date,
      log_time: l.usage_time,
    })),
  ].sort((a, b) => {
    // Sort by date first (latest first)
    const dateA = a.log_date;
    const dateB = b.log_date;
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    // If dates are same, sort by time (latest first)
    const timeA = a.log_time || "00:00:00";
    const timeB = b.log_time || "00:00:00";
    if (timeA !== timeB) {
      return timeB.localeCompare(timeA);
    }
    // Final fallback to creation order
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Filter logs based on selected filters
  const filteredLogs = combinedLogs.filter((log) =>
    selectedFilters.includes(log.type),
  );

  const handleDelete = async (item) => {
    Alert.alert(
      "Delete Record",
      `Are you sure you want to delete this ${item.type} record?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              switch (item.type) {
                case "daily":
                  await deleteHotTubLog(item.id);
                  break;
                case "weekly":
                  await deleteWeeklyCheck(item.id);
                  break;
                case "maintenance":
                  await deleteMaintenanceLog(item.id);
                  break;
                case "usage":
                  await deleteUsageLog(item.id);
                  break;
              }

              // Invalidate all relevant queries
              queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
              queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
              queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
              queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
              queryClient.invalidateQueries({ queryKey: ["all-history"] });
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete the record.");
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{
          backgroundColor: colors.notification,
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: "88%", // Match the item height roughly
          borderRadius: 16,
          marginBottom: 12,
          marginLeft: 8,
        }}
      >
        <Trash2 size={24} color="#FFFFFF" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          }}
        >
          Delete
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLogItem = ({ item }) => {
    const isWeekly = item.type === "weekly";
    const isMaint = item.type === "maintenance";
    const isUsage = item.type === "usage";

    // Format date and time
    let displayDate = item.log_date;
    let displayTime = item.log_time?.slice(0, 5);

    try {
      if (item.log_date) {
        displayDate = format(parseISO(item.log_date), "dd MMM yy");
      }
      if (item.log_time && !isWeekly && !isMaint) {
        displayTime = item.log_time.slice(0, 5);
      }
    } catch (e) {
      console.error("Error formatting date/time", e);
    }

    const isClOutOfRange =
      !isWeekly &&
      !isMaint &&
      !isUsage &&
      item.sanitizer_free !== null &&
      (item.sanitizer_free < 1.0 || item.sanitizer_free > 3.0);
    const isPhOutOfRange =
      !isWeekly &&
      !isMaint &&
      !isUsage &&
      item.ph !== null &&
      (item.ph < 7.2 || item.ph > 7.8);

    // Check if any chemicals were added
    const sanitizerAdded = item.added_sanitizer || 0;
    const phUpAdded = item.added_ph_up || 0;
    const phDownAdded = item.added_ph_down || 0;
    const hasChemicalsAdded =
      sanitizerAdded > 0 || phUpAdded > 0 || phDownAdded > 0;

    const handlePress = () => {
      const route = isWeekly
        ? "/(tabs)/weekly"
        : isMaint
          ? "/(tabs)/maintenance"
          : isUsage
            ? "/(tabs)/usage"
            : "/(tabs)/log";
      router.push({
        pathname: route,
        params: { editData: JSON.stringify(item) },
      });
    };

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isWeekly
              ? colors.primary + "40"
              : isMaint
                ? colors.warning + "40"
                : isUsage
                  ? colors.success + "40"
                  : colors.border,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Calendar
                size={14}
                color={colors.textTertiary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: colors.text }}
              >
                {displayDate}
              </Text>
              {!isWeekly && !isMaint && (
                <>
                  <Clock
                    size={14}
                    color={colors.textTertiary}
                    style={{ marginLeft: 12, marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                    {displayTime}
                  </Text>
                </>
              )}
              {isWeekly && (
                <View
                  style={{
                    marginLeft: 12,
                    backgroundColor: colors.primary + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.primary,
                    }}
                  >
                    WEEKLY
                  </Text>
                </View>
              )}
              {isMaint && (
                <View
                  style={{
                    marginLeft: 12,
                    backgroundColor: colors.warningBackground,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.warning,
                    }}
                  >
                    MAINT
                  </Text>
                </View>
              )}
              {isUsage && (
                <View
                  style={{
                    marginLeft: 12,
                    backgroundColor: colors.success + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: colors.success,
                    }}
                  >
                    USAGE
                  </Text>
                </View>
              )}
            </View>

            {isWeekly ? (
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Waves
                    size={16}
                    color={colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    Alk:{" "}
                    {item.total_alkalinity
                      ? Number(item.total_alkalinity).toFixed(2)
                      : "-"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Zap
                    size={16}
                    color={colors.warning}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    Shock:{" "}
                    {item.shock_added
                      ? Number(item.shock_added).toFixed(2)
                      : "0.00"}{" "}
                    {weightUnit}
                  </Text>
                </View>
                {item.filter_cleaned && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CheckCircle2
                      size={16}
                      color={colors.success}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={{ fontSize: 14, color: colors.success }}>
                      Filter
                    </Text>
                  </View>
                )}
              </View>
            ) : isMaint ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Wrench
                    size={16}
                    color={colors.warning}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.text,
                      fontWeight: "500",
                    }}
                  >
                    {item.action}
                  </Text>
                </View>
                {item.filter_changed && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.success + "15",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <CheckCircle2
                      size={12}
                      color={colors.success}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.success,
                        fontWeight: "600",
                      }}
                    >
                      Filter Changed
                    </Text>
                  </View>
                )}
              </View>
            ) : isUsage ? (
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Users
                    size={16}
                    color={colors.success}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {item.num_users} Users
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Timer
                    size={16}
                    color={colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {item.duration_minutes} mins
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Droplet
                      size={16}
                      color={
                        isClOutOfRange ? colors.notification : colors.primary
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: isClOutOfRange
                          ? colors.notification
                          : colors.text,
                        fontWeight: isClOutOfRange ? "700" : "400",
                      }}
                    >
                      {sanitizerLabel}:{" "}
                      {item.sanitizer_free
                        ? Number(item.sanitizer_free).toFixed(2)
                        : "-"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Beaker
                      size={16}
                      color={
                        isPhOutOfRange ? colors.notification : colors.warning
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: isPhOutOfRange
                          ? colors.notification
                          : colors.text,
                        fontWeight: isPhOutOfRange ? "700" : "400",
                      }}
                    >
                      pH: {item.ph ? Number(item.ph).toFixed(2) : "-"}
                    </Text>
                  </View>
                </View>

                {/* Chemicals Added Section */}
                {hasChemicalsAdded && (
                  <View
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {sanitizerAdded > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: colors.primary + "15",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Plus
                          size={12}
                          color={colors.primary}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.primary,
                            fontWeight: "600",
                          }}
                        >
                          {sanitizerLabel} {Number(sanitizerAdded).toFixed(2)}{" "}
                          {weightUnit}
                        </Text>
                      </View>
                    )}
                    {phUpAdded > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: colors.success + "15",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Plus
                          size={12}
                          color={colors.success}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.success,
                            fontWeight: "600",
                          }}
                        >
                          pH Up {Number(phUpAdded).toFixed(2)} {weightUnit}
                        </Text>
                      </View>
                    )}
                    {phDownAdded > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: colors.warning + "15",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Plus
                          size={12}
                          color={colors.warning}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.warning,
                            fontWeight: "600",
                          }}
                        >
                          pH Down {Number(phDownAdded).toFixed(2)} {weightUnit}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {item.notes && (
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: colors.textSecondary,
                  fontStyle: "italic",
                }}
                numberOfLines={1}
              >
                "{item.notes}"
              </Text>
            )}
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const onRefresh = () => {
    refetchDaily();
    refetchWeekly();
    refetchMaint();
    refetchUsage();
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) {
        // Don't allow deselecting all filters
        if (prev.length === 1) return prev;
        return prev.filter((f) => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const renderFilterButton = (filter, label, color) => {
    const isActive = selectedFilters.includes(filter);
    return (
      <TouchableOpacity
        onPress={() => toggleFilter(filter)}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.surface,
          padding: 10,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isActive ? color : colors.border,
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: isActive ? color : colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isActive && <Check size={12} color="#FFFFFF" />}
        </View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: colors.text,
            flexShrink: 1,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceHighest }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
          History
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          Daily, weekly, and maintenance logs
        </Text>

        {/* Filter Buttons */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 16,
            gap: 8,
          }}
        >
          {renderFilterButton(
            "daily",
            isSmallScreen ? "Daily" : "Daily Log",
            colors.primary,
          )}
          {renderFilterButton("usage", "Usage", colors.success)}
          {renderFilterButton("weekly", "Week", colors.warning)}
          {renderFilterButton(
            "maintenance",
            isSmallScreen ? "Maint" : "Maint.",
            "#FF6B6B",
          )}
        </View>
      </View>

      {isLoadingDaily || isLoadingWeekly || isLoadingMaint || isLoadingUsage ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={
                isRefetchingDaily ||
                isRefetchingWeekly ||
                isRefetchingMaint ||
                isRefetchingUsage
              }
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 100,
              }}
            >
              <Droplet size={64} color={colors.border} />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: colors.textSecondary,
                }}
              >
                No records found yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
