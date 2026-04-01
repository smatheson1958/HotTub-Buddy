import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  HelpCircle,
  AlertCircle,
} from "lucide-react-native";

export const SanitizerConsumptionCard = ({
  currentRate,
  avgRate,
  weightUnit,
  colors,
  onHelp,
  latestChlorine, // Need current chlorine level for prediction
}) => {
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

  // Check if current rate was excluded due to shock
  const isExcluded = currentRate?.excludedFromCalc;

  // Calculate future sanitizer requirement (36 hours from now)
  const hoursAhead = 36;
  let futureGramsNeeded = null;
  let futurePpmNeeded = null;
  let predictedChlorine = null;

  if (avgRate && latestChlorine != null) {
    // Calculate how much ppm will be consumed in 36 hours based on historical average
    const ppmConsumedIn36Hours = (avgRate.avgPpmPerDay / 24) * hoursAhead;
    predictedChlorine = Math.max(0, latestChlorine - ppmConsumedIn36Hours);

    // Calculate grams consumed based on historical average
    const gramsConsumedIn36Hours = (avgRate.avgGramsPerDay / 24) * hoursAhead;
    futureGramsNeeded = Math.round(gramsConsumedIn36Hours * 100) / 100;
    futurePpmNeeded = Math.round(ppmConsumedIn36Hours * 100) / 100;
  }

  return (
    <View
      style={{
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
        {onHelp && (
          <TouchableOpacity
            onPress={onHelp}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HelpCircle size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {!currentRate ? (
        // Empty state when no data available
        <View style={{ alignItems: "center", paddingVertical: 16 }}>
          <View
            style={{
              backgroundColor: colors.primary + "10",
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Info size={24} color={colors.primary} />
          </View>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Add at least 2 daily logs with{"\n"}sanitizer readings to see
            consumption data
          </Text>
        </View>
      ) : (
        <>
          {isExcluded && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                backgroundColor: colors.warning + "10",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <AlertCircle
                size={16}
                color={colors.warning}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                Latest period excluded: {currentRate.exclusionReason}
              </Text>
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
            <>
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

              {futureGramsNeeded !== null && (
                <View
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                      marginBottom: 8,
                    }}
                  >
                    Historical 36-hour consumption (based on last 7 days)
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {futureGramsNeeded} {weightUnit}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {futurePpmNeeded} ppm over 36 hours
                      </Text>
                    </View>
                    {predictedChlorine !== null && (
                      <View
                        style={{
                          backgroundColor: colors.primary + "10",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.textTertiary,
                            marginBottom: 2,
                          }}
                        >
                          Trend suggests
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: colors.primary,
                          }}
                        >
                          {predictedChlorine.toFixed(1)} ppm
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};
