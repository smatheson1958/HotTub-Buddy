import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { InfoBox, WarningBox } from "../InfoBoxes";

export function ConsumptionContent({ colors, sanitizerType, isMetric }) {
  const weightUnit = isMetric ? "g" : "oz";
  const sanitizerName = sanitizerType === "bromine" ? "Bromine" : "Chlorine";

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        Sanitizer Consumption Guide
      </Text>

      <HelpText colors={colors} bold>
        The Sanitizer Consumption card shows how quickly your hot tub is using{" "}
        {sanitizerName.toLowerCase()}, helping you predict when to add more
        chemicals.
      </HelpText>

      <CollapsibleSection
        title="How It's Calculated"
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors}>
          The system tracks the natural decay of {sanitizerName.toLowerCase()}{" "}
          between daily log entries:
        </HelpText>
        <BulletPoint colors={colors}>
          Measures {sanitizerName.toLowerCase()} levels at two different times
        </BulletPoint>
        <BulletPoint colors={colors}>
          Calculates the drop in ppm (parts per million)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Factors in any {sanitizerName.toLowerCase()} you added between
          readings
        </BulletPoint>
        <BulletPoint colors={colors}>
          Converts to daily consumption rate in {weightUnit}/day
        </BulletPoint>

        <InfoBox colors={colors}>
          <HelpText colors={colors} bold>
            What You Need:
          </HelpText>
          <BulletPoint colors={colors}>
            At least 2 daily logs with {sanitizerName.toLowerCase()} readings
          </BulletPoint>
          <BulletPoint colors={colors}>
            Readings taken on different days
          </BulletPoint>
          <BulletPoint colors={colors}>
            Accurate recording of any {sanitizerName.toLowerCase()} added
          </BulletPoint>
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="Understanding the Numbers" colors={colors}>
        <HelpText colors={colors} bold>
          Current Rate
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          Shows consumption between your last two daily logs. This is the most
          recent data point.
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          7-day Average
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          Averages all consumption rates from the past week, giving you a more
          stable trend.
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          Trend Indicator
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          Compares current rate to the 7-day average:
        </HelpText>
        <BulletPoint colors={colors}>
          <Text style={{ fontWeight: "600", color: colors.notification }}>
            ↑ Red Arrow:{" "}
          </Text>
          Using more {sanitizerName.toLowerCase()} than usual (5%+ increase)
        </BulletPoint>
        <BulletPoint colors={colors}>
          <Text style={{ fontWeight: "600", color: colors.success }}>
            ↓ Green Arrow:{" "}
          </Text>
          Using less {sanitizerName.toLowerCase()} than usual (5%+ decrease)
        </BulletPoint>
        <BulletPoint colors={colors}>
          <Text style={{ fontWeight: "600", color: colors.textTertiary }}>
            — Gray Dash:{" "}
          </Text>
          Stable consumption (within 5%)
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Smart Exclusions" colors={colors}>
        <HelpText colors={colors}>
          The calculator automatically excludes periods where chlorine-based
          shock was applied:
        </HelpText>
        <BulletPoint colors={colors}>
          Cal-Hypo, Dichlor, Lithium Hypo shocks add{" "}
          {sanitizerName.toLowerCase()}
        </BulletPoint>
        <BulletPoint colors={colors}>
          This would make consumption look artificially low
        </BulletPoint>
        <BulletPoint colors={colors}>
          Non-chlorine shock (MPS) is safe and won't be excluded
        </BulletPoint>

        <WarningBox colors={colors}>
          <HelpText colors={colors} bold>
            If you see "Excluded":
          </HelpText>
          <HelpText colors={colors} marginTop={4}>
            A chlorine-based shock was applied between daily logs, so that
            period can't be used for accurate consumption tracking.
          </HelpText>
        </WarningBox>
      </CollapsibleSection>

      <CollapsibleSection title="Usage Tips" colors={colors}>
        <BulletPoint colors={colors}>Log daily for best accuracy</BulletPoint>
        <BulletPoint colors={colors}>
          Record {sanitizerName.toLowerCase()} additions immediately
        </BulletPoint>
        <BulletPoint colors={colors}>
          Higher usage = more hot tub use or warmer water
        </BulletPoint>
        <BulletPoint colors={colors}>
          Lower usage = less activity or cooler water
        </BulletPoint>
        <BulletPoint colors={colors}>
          Use trends to predict when to buy more chemicals
        </BulletPoint>
      </CollapsibleSection>

      <View
        style={{
          backgroundColor: "#FEF3C7",
          borderRadius: 12,
          padding: 12,
          marginTop: 16,
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
          ℹ️ This information is for educational purposes only. Consumption
          calculations are estimates based on your logged data. Always test your
          water and follow manufacturer guidelines for chemical additions.
        </Text>
      </View>
    </View>
  );
}
