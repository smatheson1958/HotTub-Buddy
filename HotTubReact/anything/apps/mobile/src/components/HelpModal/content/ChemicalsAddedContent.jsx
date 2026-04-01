import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { WarningBox, InfoBox } from "../InfoBoxes";

export function ChemicalsAddedContent({ colors, isBromine, weightUnit }) {
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
        Chemical Addition Guide
      </Text>

      <CollapsibleSection
        title="General Safety Rules"
        colors={colors}
        defaultOpen={true}
      >
        <WarningBox colors={colors}>
          NEVER mix chemicals together before adding to water
        </WarningBox>
        <BulletPoint colors={colors}>Add chemicals one at a time</BulletPoint>
        <BulletPoint colors={colors}>
          Wait at least 30 minutes between additions
        </BulletPoint>
        <BulletPoint colors={colors}>
          Always add chemicals to water, never water to chemicals
        </BulletPoint>
        <BulletPoint colors={colors}>
          Run circulation pump when adding chemicals
        </BulletPoint>
        <BulletPoint colors={colors}>
          Keep chemicals in original containers
        </BulletPoint>
        <BulletPoint colors={colors}>
          Store in a cool, dry place away from sunlight
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title="General Dosing Information (Educational)"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          Basic principle
        </HelpText>
        <InfoBox colors={colors}>
          Start with small doses and retest. It's easier to add more than to
          dilute.
        </InfoBox>

        <HelpText colors={colors} bold marginTop={12}>
          Typical starting doses (adjust based on test results and product
          labels):
        </HelpText>
        <BulletPoint colors={colors}>
          pH adjustment: 10-20{weightUnit} per adjustment (refer to manufacturer
          guidance)
        </BulletPoint>
        <BulletPoint colors={colors}>
          {isBromine ? "Bromine" : "Chlorine"}: Follow manufacturer's directions
          for your tub size
        </BulletPoint>
        <BulletPoint colors={colors}>
          Always measure based on your specific tub capacity
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Typical Timing Considerations" colors={colors}>
        <BulletPoint colors={colors}>
          Best time: Evening, when tub won't be used for several hours
        </BulletPoint>
        <BulletPoint colors={colors}>
          Common practice is to avoid adding chemicals just before use
        </BulletPoint>
        <BulletPoint colors={colors}>
          Commonly, users wait at least 20-30 minutes after adding before
          entering
        </BulletPoint>
        <BulletPoint colors={colors}>Test water before each use</BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Order of Chemical Addition"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          If multiple adjustments are needed:
        </HelpText>
        <BulletPoint colors={colors}>
          1. Adjust Alkalinity first (if needed)
        </BulletPoint>
        <BulletPoint colors={colors}>2. Then adjust pH</BulletPoint>
        <BulletPoint colors={colors}>
          3. Then add sanitizer ({isBromine ? "bromine" : "chlorine"})
        </BulletPoint>
        <BulletPoint colors={colors}>
          4. Wait 30+ minutes between each step
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes" colors={colors}>
        <BulletPoint colors={colors}>❌ Adding too much at once</BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Not waiting between additions
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Adding chemicals with pump off
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Not retesting after adjustments
        </BulletPoint>
        <BulletPoint colors={colors}>❌ Using expired chemicals</BulletPoint>
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
          your hot tub manufacturer's specific instructions and consult product
          labels for proper chemical handling and dosing. When in doubt, seek
          advice from a qualified pool/spa professional.
        </Text>
      </View>
    </View>
  );
}
