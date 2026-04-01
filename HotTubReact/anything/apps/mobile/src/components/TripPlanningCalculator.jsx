import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import {
  Plane,
  Calendar,
  Droplets,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TestTube,
} from "lucide-react-native";

/**
 * Trip Planning Calculator Component
 * Helps users understand historical consumption patterns before leaving for a trip
 */
export const TripPlanningCalculator = ({
  avgRate,
  currentChlorine,
  volumeLitres,
  weightUnit,
  colors,
  isBromine = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // collapsed by default
  const [tripDays, setTripDays] = useState("");
  const [timeUnit, setTimeUnit] = useState("days"); // "days" or "hours"
  const [targetLevel, setTargetLevel] = useState("3"); // New state for target level

  const sanitizerName = isBromine ? "bromine" : "chlorine";
  const sanitizerNameCap = isBromine ? "Bromine" : "Chlorine";

  // Calculate how long current chlorine will last based on historical consumption
  const calculateDaysUntilEmpty = () => {
    if (!avgRate || !currentChlorine || currentChlorine <= 0) return null;
    const daysUntilEmpty = currentChlorine / avgRate.avgPpmPerDay;
    return daysUntilEmpty;
  };

  // Calculate historical consumption pattern for reference
  const calculatePreTripDosing = (timeValue) => {
    if (!avgRate || !timeValue || timeValue <= 0) return null;

    // Convert to days if in hours
    const daysEquivalent =
      timeUnit === "hours" ? parseFloat(timeValue) / 24 : parseFloat(timeValue);

    const targetAtEnd = parseFloat(targetLevel) || 3; // Use user-specified target
    const consumptionDuringTrip = avgRate.avgPpmPerDay * daysEquivalent;
    const targetNow = targetAtEnd + consumptionDuringTrip;

    // Remove hard cap - let user control target level
    const targetPpm = targetNow;
    const currentPpm = currentChlorine || 0;
    const ppmToAdd = Math.max(0, targetPpm - currentPpm);
    const gramsToAdd = (ppmToAdd * volumeLitres) / 1000 / 0.62;

    // Convert to oz if needed
    const amountToAdd = weightUnit === "oz" ? gramsToAdd / 28.35 : gramsToAdd;

    const willLastDays = targetPpm / avgRate.avgPpmPerDay;
    const willLastHours = willLastDays * 24;

    return {
      targetPpm: Math.round(targetPpm * 100) / 100,
      currentPpm: Math.round(currentPpm * 100) / 100,
      ppmToAdd: Math.round(ppmToAdd * 100) / 100,
      amountToAdd: Math.round(amountToAdd * 100) / 100,
      willLastDays: Math.round(willLastDays * 10) / 10,
      willLastHours: Math.round(willLastHours * 10) / 10,
      targetAtEnd: targetAtEnd,
    };
  };

  const daysUntilEmpty = calculateDaysUntilEmpty();
  const tripCalc = tripDays ? calculatePreTripDosing(tripDays) : null;

  // Determine if user has enough chlorine for the trip
  const hasSufficientChlorine = () => {
    if (!daysUntilEmpty || !tripDays) return false;
    const daysNeeded =
      timeUnit === "hours" ? parseFloat(tripDays) / 24 : parseFloat(tripDays);
    return daysNeeded <= daysUntilEmpty;
  };

  if (!avgRate) {
    return (
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Plane size={20} color={colors.textTertiary} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "600",
              color: colors.textSecondary,
            }}
          >
            Planner
          </Text>
        </View>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: colors.textTertiary,
            lineHeight: 20,
          }}
        >
          Not enough data yet. Log a few more entries to enable planning.
        </Text>
      </View>
    );
  }

  return (
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
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Plane size={20} color={colors.primary} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            Trip Planner (Historical Reference)
          </Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ marginTop: 16 }}>
          {/* Disclaimer Banner */}
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              borderLeftWidth: 3,
              borderLeftColor: "#F59E0B",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#92400E",
                lineHeight: 18,
                fontWeight: "500",
              }}
            >
              ℹ️ This shows historical consumption patterns from your previous
              entries — reference only. Always test your water and follow
              manufacturer guidelines. This is not a dosing recommendation or
              substitute for professional advice.
            </Text>
          </View>

          {/* Current Status */}
          {currentChlorine && daysUntilEmpty && (
            <View
              style={{
                backgroundColor: colors.surfaceHighest,
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Droplets size={16} color={colors.textSecondary} />
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.textSecondary,
                  }}
                >
                  Current Status
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  lineHeight: 20,
                }}
              >
                Based on past usage, at {currentChlorine} ppm, your{" "}
                {sanitizerName} historically lasts{" "}
                <Text style={{ fontWeight: "700", color: colors.primary }}>
                  ~{Math.round(daysUntilEmpty * 10) / 10} days
                </Text>
              </Text>
            </View>
          )}

          {/* Trip Duration Input with Unit Toggle */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Calendar size={16} color={colors.textSecondary} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.textSecondary,
                }}
              >
                Duration
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surfaceHighest,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 48,
                  color: colors.text,
                  fontSize: 16,
                }}
                value={tripDays}
                onChangeText={setTripDays}
                placeholder={`How many ${timeUnit}?`}
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setTimeUnit("days")}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      timeUnit === "days" ? colors.primary : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        timeUnit === "days" ? "#FFFFFF" : colors.textSecondary,
                    }}
                  >
                    days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTimeUnit("hours")}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      timeUnit === "hours" ? colors.primary : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        timeUnit === "hours" ? "#FFFFFF" : colors.textSecondary,
                    }}
                  >
                    hours
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Target Level Input */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <TestTube size={16} color={colors.textSecondary} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.textSecondary,
                }}
              >
                Reference Target Level at End (ppm)
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.surfaceHighest,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                style={{
                  height: 48,
                  color: colors.text,
                  fontSize: 16,
                }}
                value={targetLevel}
                onChangeText={setTargetLevel}
                placeholder="3.0"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Trip Calculation Results */}
          {tripCalc && (
            <View>
              {/* Important Warning */}
              <View
                style={{
                  backgroundColor: "#F59E0B15",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: "#F59E0B",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#F59E0B",
                    marginBottom: 8,
                  }}
                >
                  ⚠️ Important
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  • This calculation is based on{" "}
                  <Text style={{ fontWeight: "600" }}>
                    your past usage patterns only
                  </Text>
                  , not a dosing instruction{"\n"}•{" "}
                  <Text style={{ fontWeight: "600" }}>
                    Always test your water
                  </Text>{" "}
                  and consult product labels{"\n"}• Never exceed manufacturer
                  guidance{"\n"}• You are responsible for all chemical decisions
                </Text>
              </View>

              {/* Historical Consumption Pattern */}
              <View
                style={{
                  backgroundColor: colors.surfaceHighest,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <TrendingUp size={16} color={colors.primary} />
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 13,
                      fontWeight: "600",
                      color: colors.primary,
                    }}
                  >
                    Historical Consumption Pattern (Reference Only)
                  </Text>
                </View>

                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                      marginBottom: 4,
                    }}
                  >
                    Based on your previous entries
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      Calculated starting level:
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.primary,
                      }}
                    >
                      {tripCalc.targetPpm} ppm
                    </Text>
                  </View>

                  {tripCalc.ppmToAdd > 0 && (
                    <>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.border,
                          marginVertical: 4,
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{ fontSize: 14, color: colors.textSecondary }}
                        >
                          Typical past usage over this period:
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.primary,
                          }}
                        >
                          {tripCalc.amountToAdd} {weightUnit}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{ fontSize: 14, color: colors.textSecondary }}
                        >
                          Historical level at end:
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: colors.text,
                          }}
                        >
                          ~{tripCalc.targetAtEnd} ppm
                        </Text>
                      </View>
                    </>
                  )}

                  {tripCalc.ppmToAdd === 0 && (
                    <View
                      style={{
                        backgroundColor: "#10B98130",
                        borderRadius: 8,
                        padding: 8,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#10B981",
                          textAlign: "center",
                        }}
                      >
                        ✓ Based on past usage, current level may be sufficient -
                        always verify with testing
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Safety Note for high dosing */}
              {tripCalc.targetPpm >= (isBromine ? 4.5 : 4.5) && (
                <View
                  style={{
                    marginTop: 12,
                    padding: 10,
                    backgroundColor: colors.surfaceHighest,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: "#F59E0B",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      lineHeight: 16,
                    }}
                  >
                    ⚠️ This calculation suggests a high {sanitizerName} level -
                    common practice is to wait and test before use
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Instructions */}
          {!tripDays && (
            <View
              style={{
                padding: 12,
                backgroundColor: colors.surfaceHighest,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                Enter duration to view historical {sanitizerName} consumption
                pattern
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
