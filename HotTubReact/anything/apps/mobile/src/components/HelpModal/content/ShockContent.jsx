import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { WarningBox, InfoBox } from "../InfoBoxes";

export function ShockContent({ colors, isBromine, weightUnit }) {
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
        Shock Treatment Guide
      </Text>

      <CollapsibleSection
        title="What is Shocking?"
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          Shocking is adding a large dose of oxidizer to break down contaminants
          and restore water clarity.
        </HelpText>
        <HelpText colors={colors} marginTop={8}>
          It eliminates chloramines/bromamines, organic waste, and bacteria that
          regular sanitizing may miss.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Common Scenarios for Shocking" colors={colors}>
        <HelpText colors={colors} bold>
          Weekly maintenance
        </HelpText>
        <BulletPoint colors={colors}>
          Common practice is at least once per week
        </BulletPoint>
        <BulletPoint colors={colors}>More often with heavy use</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          After heavy use
        </HelpText>
        <BulletPoint colors={colors}>
          After a party or multiple users
        </BulletPoint>
        <BulletPoint colors={colors}>
          Following extended soaking sessions
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          When water quality declines
        </HelpText>
        <BulletPoint colors={colors}>Cloudy or dull water</BulletPoint>
        <BulletPoint colors={colors}>Strong chemical smell</BulletPoint>
        <BulletPoint colors={colors}>Foaming or skin irritation</BulletPoint>
        <BulletPoint colors={colors}>
          Combined {isBromine ? "bromine" : "chlorine"} above 0.5 ppm
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Shock Process (For Reference)"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          Common step-by-step approach
        </HelpText>
        <BulletPoint colors={colors}>
          1. Test and balance pH to 7.2-7.6 first
        </BulletPoint>
        <BulletPoint colors={colors}>
          2. Remove cover and turn on circulation
        </BulletPoint>
        <BulletPoint colors={colors}>
          3. Add shock dose based on tub size (follow product instructions)
        </BulletPoint>
        <BulletPoint colors={colors}>
          4. Run jets/circulation for 15-20 minutes
        </BulletPoint>
        <BulletPoint colors={colors}>
          5. Leave cover OFF for at least 20 minutes
        </BulletPoint>
        <BulletPoint colors={colors}>
          6. Test water before re-entering
        </BulletPoint>

        <WarningBox colors={colors}>
          Common practice is NOT to enter the tub until{" "}
          {isBromine ? "bromine" : "chlorine"} levels return to safe range
          (under 5 ppm for chlorine, under 6 ppm for bromine). Consult product
          labels for specific guidance.
        </WarningBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Shock Dosage (Educational)"
        colors={colors}
      >
        <InfoBox colors={colors}>
          Dosage varies by product. Common guideline: 35-50{weightUnit} per
          1000L (or 2-3 oz per 500 gallons). Always follow manufacturer's
          instructions.
        </InfoBox>
        <BulletPoint colors={colors}>
          Consult product instructions for your specific tub size
        </BulletPoint>
        <BulletPoint colors={colors}>
          Use measuring cup or scoop for accuracy
        </BulletPoint>
        <BulletPoint colors={colors}>
          Never mix shock products together
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Shock Types" colors={colors}>
        <HelpText colors={colors} bold>
          Chlorine-based shock
        </HelpText>
        <BulletPoint colors={colors}>Most common and effective</BulletPoint>
        <BulletPoint colors={colors}>
          Temporarily raises {isBromine ? "bromine" : "chlorine"} to 8-10 ppm
        </BulletPoint>
        <BulletPoint colors={colors}>Fast-acting oxidation</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Non-chlorine shock (MPS)
        </HelpText>
        <BulletPoint colors={colors}>Gentler alternative</BulletPoint>
        <BulletPoint colors={colors}>
          Can use tub sooner (typically 15-30 minutes)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Less effective for heavy contamination
        </BulletPoint>
        <BulletPoint colors={colors}>
          May require chlorine boost afterward
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Safety & Best Practices" colors={colors}>
        <WarningBox colors={colors}>
          Never shock with people in the tub. Always add shock to water, never
          water to shock.
        </WarningBox>
        <BulletPoint colors={colors}>
          Common practice is to shock in the evening when tub won't be used
        </BulletPoint>
        <BulletPoint colors={colors}>
          Keep shock chemicals dry and sealed
        </BulletPoint>
        <BulletPoint colors={colors}>
          Avoid shocking if copper is high (may cause staining)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Leave cover open to allow gases to escape
        </BulletPoint>
        <BulletPoint colors={colors}>
          Test water chemistry before and after
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes to Avoid" colors={colors}>
        <BulletPoint colors={colors}>
          ❌ Shocking with the cover on (traps gases)
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Shocking without balancing pH first
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Adding too much shock at once
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Not running circulation during treatment
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Entering tub before levels normalize
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Mixing different shock products
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
          your hot tub manufacturer's specific instructions and consult product
          labels for proper chemical handling and dosing. When in doubt, seek
          advice from a qualified pool/spa professional.
        </Text>
      </View>
    </View>
  );
}
