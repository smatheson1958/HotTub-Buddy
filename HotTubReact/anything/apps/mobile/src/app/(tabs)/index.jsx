import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Droplet,
  Beaker,
  Plus,
  History,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Waves,
  Wrench,
  Timer,
  ChevronRight,
  Calendar,
  Clock,
  BarChart2,
  Trash2,
  ClipboardList,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "@/utils/useTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isValid } from "date-fns";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
import {
  getCurrentRate,
  getAverageRate,
  getDataConfidence,
} from "@/utils/rateCalculator";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const sanitizerType = settings?.sanitizer_type || "chlorine";
  const isBromine = sanitizerType === "bromine";
  const volumeLitres = settings?.volume_litres || 1000;
  const isMetric = settings?.measurement_system !== "imperial";
  const weightUnit = isMetric ? "g" : "oz";

  const {
    data: dailyLogs = [],
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ["hot-tub-logs"],
    queryFn: getHotTubLogs,
  });

  const { data: weeklyLogs = [] } = useQuery({
    queryKey: ["weekly-checks"],
    queryFn: getWeeklyChecks,
  });

  const { data: maintenanceLogs = [] } = useQuery({
    queryKey: ["maintenance-logs"],
    queryFn: getMaintenanceLogs,
  });

  const { data: usageLogs = [] } = useQuery({
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
  ]
    .sort((a, b) => {
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
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .slice(0, 4);

  const latestLog = dailyLogs[0];

  // Calculate consumption rates - now passing maintenanceLogs
  const currentRate = getCurrentRate(
    dailyLogs,
    volumeLitres,
    weeklyLogs,
    maintenanceLogs,
  );
  const avgRate = getAverageRate(
    dailyLogs,
    volumeLitres,
    7,
    weeklyLogs,
    maintenanceLogs,
  );

  // Get data confidence
  const dataConfidence = getDataConfidence(dailyLogs, maintenanceLogs);

  // Calculate trend
  let trendPercent = null;
  let TrendIcon = Minus;
  if (currentRate && avgRate && avgRate.avgGramsPerDay > 0) {
    trendPercent =
      ((currentRate.gramsPerDay - avgRate.avgGramsPerDay) /
        avgRate.avgGramsPerDay) *
      100;
    if (trendPercent > 5) {
      TrendIcon = TrendingUp;
    } else if (trendPercent < -5) {
      TrendIcon = TrendingDown;
    }
  }

  const onRefresh = () => {
    refetchDaily();
  };

  const getStatusColor = (ph, sanitizer) => {
    if (!ph && !sanitizer) return colors.textTertiary;
    const phOk = ph >= 7.2 && ph <= 7.8;
    const clOk = isBromine
      ? sanitizer >= 3.0 && sanitizer <= 5.0
      : sanitizer >= 1.0 && sanitizer <= 3.0;
    if (phOk && clOk) return colors.success;
    return colors.notification;
  };

  const getStatusText = (ph, sanitizer) => {
    if (!ph && !sanitizer) return "No data";
    const phOk = ph >= 7.2 && ph <= 7.8;
    const clOk = isBromine
      ? sanitizer >= 3.0 && sanitizer <= 5.0
      : sanitizer >= 1.0 && sanitizer <= 3.0;

    if (phOk && clOk) return "Balanced";
    if (!phOk && !clOk)
      return `Check pH & ${isBromine ? "Bromine" : "Chlorine"}`;
    if (!phOk) return "Check pH Level";
    return `Check ${isBromine ? "Bromine" : "Chlorine"}`;
  };

  const handleDelete = async (item) => {
    const typeName =
      item.type === "daily"
        ? "Daily Log"
        : item.type === "weekly"
          ? "Weekly Check"
          : item.type === "maintenance"
            ? "Maintenance Log"
            : "Usage Log";

    Alert.alert(
      `Delete ${typeName}`,
      `Are you sure you want to delete this ${typeName.toLowerCase()} from ${item.log_date}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.type === "daily") {
                await deleteHotTubLog(item.id);
                queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
              } else if (item.type === "weekly") {
                await deleteWeeklyCheck(item.id);
                queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
              } else if (item.type === "maintenance") {
                await deleteMaintenanceLog(item.id);
                queryClient.invalidateQueries({
                  queryKey: ["maintenance-logs"],
                });
              } else if (item.type === "usage") {
                await deleteUsageLog(item.id);
                queryClient.invalidateQueries({ queryKey: ["usage-logs"] });
              }
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

  // Helper function to safely format dates
  const safeFormatDate = (dateString, formatStr = "dd MMM yy") => {
    if (!dateString) return "Invalid date";
    try {
      const parsed = parseISO(dateString);
      if (!isValid(parsed)) return "Invalid date";
      return format(parsed, formatStr);
    } catch (e) {
      console.error("Date formatting error:", e, "for date:", dateString);
      return "Invalid date";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceHighest }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingDaily}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              fontWeight: "500",
            }}
          >
            Welcome back
          </Text>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            Hot Tub Monitor
          </Text>
        </View>

        {/* Status Card */}
        <LinearGradient
          colors={
            latestLog
              ? [colors.primaryGradientStart, colors.primaryGradientEnd]
              : ["#6B9BD1", "#8BA8C7"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginHorizontal: 20,
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Droplet size={24} color="#FFFFFF" />
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}
              >
                {latestLog
                  ? `Last checked: ${safeFormatDate(latestLog.log_date)}`
                  : "No records yet"}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Current Status
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: "800",
              marginBottom: 16,
            }}
          >
            {latestLog
              ? getStatusText(latestLog.ph, latestLog.sanitizer_free)
              : "Ready to start?"}
          </Text>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <View>
              <Text
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {isBromine ? "Bromine" : "Chlorine"}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}
                >
                  {latestLog?.sanitizer_free || "--"} ppm
                </Text>
                {latestLog &&
                  (isBromine
                    ? latestLog.sanitizer_free < 3.0 ||
                      latestLog.sanitizer_free > 5.0
                    : latestLog.sanitizer_free < 1.0 ||
                      latestLog.sanitizer_free > 3.0) && (
                    <AlertCircle size={16} color="#FFD700" />
                  )}
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                pH Level
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}
                >
                  {latestLog?.ph || "--"}
                </Text>
                {latestLog && (latestLog.ph < 7.2 || latestLog.ph > 7.8) && (
                  <AlertCircle size={16} color="#FFD700" />
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Consumption Rate Card - only show if we have enough data */}
        {currentRate && dataConfidence.confidence !== "insufficient" && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 24,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 20,
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: colors.warning + "15",
                    padding: 8,
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                >
                  <Zap size={20} color={colors.warning} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Sanitizer Consumption
                </Text>
              </View>
            </View>

            {/* Warning banner if recent water change */}
            {dataConfidence.warningMessage && (
              <View
                style={{
                  backgroundColor: colors.warning + "15",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.warning,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AlertCircle
                    size={16}
                    color={colors.warning}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.text,
                        fontWeight: "600",
                        marginBottom: 4,
                      }}
                    >
                      Limited Data Available
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        lineHeight: 16,
                      }}
                    >
                      {dataConfidence.warningMessage}
                    </Text>
                    {dataConfidence.hasRecentWaterChange && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textTertiary,
                          marginTop: 4,
                        }}
                      >
                        Water changed {dataConfidence.daysSinceWaterChange} days
                        ago • {dataConfidence.readingsSinceWaterChange} readings
                        since
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            <View style={{ alignItems: "center", marginVertical: 8 }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "700",
                  color: colors.text,
                }}
              >
                {currentRate.gramsPerDay} {weightUnit}/day
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {currentRate.ppmPerDay} ppm/day • Last {currentRate.daysElapsed}{" "}
                days
              </Text>
            </View>

            {avgRate && (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                      marginBottom: 2,
                    }}
                  >
                    7-day average
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    {avgRate.avgGramsPerDay} {weightUnit}/day
                  </Text>
                </View>
                {trendPercent !== null && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor:
                        trendPercent > 5
                          ? colors.notification + "15"
                          : trendPercent < -5
                            ? colors.success + "15"
                            : colors.textTertiary + "15",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <TrendIcon
                      size={16}
                      color={
                        trendPercent > 5
                          ? colors.notification
                          : trendPercent < -5
                            ? colors.success
                            : colors.textTertiary
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color:
                          trendPercent > 5
                            ? colors.notification
                            : trendPercent < -5
                              ? colors.success
                              : colors.textTertiary,
                      }}
                    >
                      {Math.abs(Math.round(trendPercent))}%
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/activity")}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 20,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary + "15",
                  padding: 10,
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <ClipboardList size={24} color={colors.primary} />
              </View>
              <Text
                style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}
              >
                Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/charts")}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 20,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.success + "15",
                  padding: 10,
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <BarChart2 size={24} color={colors.success} />
              </View>
              <Text
                style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}
              >
                Charts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: "500",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {combinedLogs.length > 0 ? (
            combinedLogs.map((item, index) => {
              const isWeekly = item.type === "weekly";
              const isMaint = item.type === "maintenance";
              const isUsage = item.type === "usage";

              const displayDate = safeFormatDate(item.log_date);

              const Icon = isWeekly
                ? CalendarCheck
                : isMaint
                  ? Wrench
                  : isUsage
                    ? Timer
                    : Droplet;
              const iconColor = isWeekly
                ? colors.primary
                : isMaint
                  ? colors.warning
                  : isUsage
                    ? colors.success
                    : colors.primary;

              return (
                <Swipeable
                  key={`${item.type}-${item.id}`}
                  renderRightActions={() => renderRightActions(item)}
                  friction={2}
                  rightThreshold={40}
                >
                  <TouchableOpacity
                    onPress={() => {
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
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.surface,
                      padding: 12,
                      borderRadius: 16,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: iconColor + "15",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Icon size={20} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {isWeekly
                          ? "Weekly Check"
                          : isMaint
                            ? item.action
                            : isUsage
                              ? "Hot Tub Usage"
                              : "Daily Log"}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 12,
                          }}
                        >
                          <Calendar
                            size={12}
                            color={colors.textTertiary}
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.textSecondary,
                            }}
                          >
                            {displayDate}
                          </Text>
                        </View>
                        {item.log_time && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Clock
                              size={12}
                              color={colors.textTertiary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                              }}
                            >
                              {item.log_time.slice(0, 5)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                </Swipeable>
              );
            })
          ) : (
            <View
              style={{
                padding: 20,
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                No recent activity
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
