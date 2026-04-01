import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Clock,
  ChevronRight,
  Waves,
  Zap,
  CheckCircle2,
  Trash2,
  Droplets,
  Plus,
  Sparkles,
} from "lucide-react-native";
import useTheme from "@/utils/useTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { format, parseISO } from "date-fns";
import {
  getSettings,
  getWeeklyChecks,
  deleteWeeklyCheck,
} from "@/utils/offlineStorage";
import { getShockTypeLabel } from "@/utils/shockTypes";

export default function WeeklyHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: getSettings,
  });

  const isMetric = settings?.measurement_system !== "imperial";
  const weightUnit = isMetric ? "g" : "oz";
  const sanitizerType = settings?.sanitizer_type || "Chlorine";

  const {
    data: weeklyLogs = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["weekly-checks"],
    queryFn: getWeeklyChecks,
  });

  const handleDelete = async (item) => {
    Alert.alert(
      "Delete Weekly Check",
      `Are you sure you want to delete this weekly check from ${item.log_date}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWeeklyCheck(item.id);
              queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
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
          height: "88%",
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
    let displayDate = item.log_date;
    let displayTime = item.log_time?.slice(0, 5);

    try {
      if (item.log_date) {
        displayDate = format(parseISO(item.log_date), "dd MMM yy");
      }
    } catch (e) {
      console.error("Error formatting date", e);
    }

    const handlePress = () => {
      router.push({
        pathname: "/(tabs)/weekly",
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
            borderColor: colors.primary + "40",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Calendar
                  size={14}
                  color={colors.textTertiary}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {displayDate}
                </Text>
                {displayTime && (
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
              </View>

              <View style={{ gap: 8 }}>
                {item.total_alkalinity !== null &&
                  item.total_alkalinity !== undefined && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Waves
                        size={16}
                        color={colors.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          width: 120,
                        }}
                      >
                        Total Alkalinity
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.text,
                          fontWeight: "600",
                        }}
                      >
                        {item.total_alkalinity}
                      </Text>
                    </View>
                  )}

                {item.copper !== null && item.copper !== undefined && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Droplets
                      size={16}
                      color={colors.warning}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        width: 120,
                      }}
                    >
                      Copper
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.text,
                        fontWeight: "600",
                      }}
                    >
                      {item.copper}
                    </Text>
                  </View>
                )}

                {item.shock_added !== null &&
                  item.shock_added !== undefined &&
                  item.shock_added > 0 && (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Zap
                          size={16}
                          color={colors.warning}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.textSecondary,
                            width: 120,
                          }}
                        >
                          Shock Added
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontWeight: "600",
                          }}
                        >
                          {item.shock_added} {weightUnit}
                        </Text>
                      </View>
                      {item.shock_type && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 24,
                          }}
                        >
                          <Sparkles
                            size={14}
                            color={colors.textTertiary}
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              color: colors.textSecondary,
                              fontStyle: "italic",
                            }}
                          >
                            {getShockTypeLabel(item.shock_type, sanitizerType)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}

                {item.filter_cleaned && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CheckCircle2
                      size={16}
                      color={colors.success}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.success,
                        fontWeight: "600",
                      }}
                    >
                      Filter Cleaned
                    </Text>
                  </View>
                )}

                {item.notes && (
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: colors.textSecondary,
                      fontStyle: "italic",
                    }}
                    numberOfLines={2}
                  >
                    "{item.notes}"
                  </Text>
                )}
              </View>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
      </Swipeable>
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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
            Weekly Checks
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            All your weekly maintenance history
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/weekly")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={weeklyLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => `weekly-${item.id}`}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
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
              <Waves size={64} color={colors.border} />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: colors.textSecondary,
                }}
              >
                No weekly checks found yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
