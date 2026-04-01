import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { IdealRange, WarningBox, InfoBox } from "../InfoBoxes";

export function TemperatureContent({ colors }) {
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
        Water Temperature Guide
      </Text>

      <CollapsibleSection
        title="Ideal Temperature Range"
        colors={colors}
        defaultOpen={true}
      >
        <IdealRange
          label="Recommended range"
          value="37–40°C (98–104°F)"
          colors={colors}
        />
        <HelpText colors={colors} marginTop={8}>
          Most people find 38–39°C (100–102°F) most comfortable for extended
          soaking.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Energy Efficiency Tips" colors={colors}>
        <BulletPoint colors={colors}>
          Keep your cover on when not in use
        </BulletPoint>
        <BulletPoint colors={colors}>
          Lower temperature by 2°C when away for extended periods
        </BulletPoint>
        <BulletPoint colors={colors}>
          Maintain consistent temperature rather than large swings
        </BulletPoint>
        <BulletPoint colors={colors}>
          Check cover condition regularly for heat loss
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Temperature & Chemistry" colors={colors}>
        <InfoBox colors={colors}>
          Higher temperatures increase chemical consumption. You may need to
          test and adjust more frequently in warmer weather or if you prefer
          hotter water.
        </InfoBox>
        <BulletPoint colors={colors}>
          Chlorine/Bromine evaporates faster in hot water
        </BulletPoint>
        <BulletPoint colors={colors}>
          pH can drift more quickly at higher temperatures
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Safety Considerations" colors={colors}>
        <WarningBox colors={colors}>
          Temperatures above 40°C (104°F) can be dangerous, especially for
          pregnant women, young children, and those with heart conditions.
        </WarningBox>
        <BulletPoint colors={colors}>
          Limit soaking time to 15-20 minutes at maximum temperature
        </BulletPoint>
        <BulletPoint colors={colors}>Stay hydrated</BulletPoint>
        <BulletPoint colors={colors}>
          Exit immediately if feeling dizzy or uncomfortable
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
          ℹ️ This information is for educational purposes only. Always follow
          your hot tub manufacturer's specific instructions. When in doubt about
          safe temperature ranges, consult your manufacturer or a qualified
          pool/spa professional.
        </Text>
      </View>
    </View>
  );
}
