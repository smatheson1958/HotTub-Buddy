import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { IdealRange, WarningBox, InfoBox } from "../InfoBoxes";

export function CopperContent({ colors }) {
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
        Copper (Cu) Guide
      </Text>

      <CollapsibleSection
        title="What is Copper?"
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          Copper is a metal that can dissolve into your hot tub water from
          various sources.
        </HelpText>
        <HelpText colors={colors} marginTop={8}>
          While small amounts are usually harmless, elevated copper levels can
          cause staining, discoloration, and equipment damage.
        </HelpText>
        <IdealRange
          label="Ideal Copper range"
          value="0.0 – 0.5 ppm"
          colors={colors}
        />
        <HelpText colors={colors} marginTop={8}>
          Ideally, copper should be as close to 0.0 ppm as possible.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Why Copper Matters" colors={colors}>
        <HelpText colors={colors} bold>
          Copper affects:
        </HelpText>
        <BulletPoint colors={colors}>Water clarity and appearance</BulletPoint>
        <BulletPoint colors={colors}>
          Potential staining on surfaces
        </BulletPoint>
        <BulletPoint colors={colors}>Hair and skin discoloration</BulletPoint>
        <BulletPoint colors={colors}>
          Equipment longevity and performance
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Health concerns
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          While not immediately dangerous at typical hot tub levels, prolonged
          exposure to high copper can cause skin irritation and digestive issues
          if water is accidentally swallowed.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Sources of Copper" colors={colors}>
        <HelpText colors={colors} bold>
          Common sources include:
        </HelpText>
        <BulletPoint colors={colors}>
          Copper-based algaecides (most common source)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Corroded copper pipes or heat exchangers
        </BulletPoint>
        <BulletPoint colors={colors}>
          Fill water (especially from wells with copper plumbing)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Low pH causing corrosion of copper components
        </BulletPoint>
        <BulletPoint colors={colors}>
          Old or damaged heater elements
        </BulletPoint>

        <InfoBox colors={colors}>
          Prevention tip: Test your fill water for copper before filling your
          hot tub, especially if you have copper plumbing or well water.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="High Copper Problems" colors={colors}>
        <HelpText colors={colors} bold>
          Signs of high copper levels:
        </HelpText>
        <BulletPoint colors={colors}>
          Green, blue, or turquoise water tint
        </BulletPoint>
        <BulletPoint colors={colors}>
          Blue-green staining on surfaces or equipment
        </BulletPoint>
        <BulletPoint colors={colors}>
          Green tint in blonde or light-colored hair
        </BulletPoint>
        <BulletPoint colors={colors}>Metallic taste in water</BulletPoint>
        <BulletPoint colors={colors}>Increased equipment corrosion</BulletPoint>

        <WarningBox colors={colors}>
          Copper stains can be permanent if not treated quickly. Address high
          copper levels as soon as they're detected.
        </WarningBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Approaches to Lower Copper (Educational)"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          If copper is above 0.5 ppm:
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          1. Use a Metal Sequestrant (Common Approach)
        </HelpText>
        <BulletPoint colors={colors}>
          Add a metal sequestrant or chelating agent
        </BulletPoint>
        <BulletPoint colors={colors}>
          This binds to copper and keeps it in suspension
        </BulletPoint>
        <BulletPoint colors={colors}>
          Follow product instructions carefully
        </BulletPoint>
        <BulletPoint colors={colors}>
          Run filtration continuously for 24–48 hours
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          2. Partial Water Changes (Common Approach)
        </HelpText>
        <BulletPoint colors={colors}>
          Drain 25–50% of water and refill with fresh water
        </BulletPoint>
        <BulletPoint colors={colors}>
          Test source water first to ensure it's low in copper
        </BulletPoint>
        <BulletPoint colors={colors}>
          May need to repeat over several weeks
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          3. Stop Adding Copper Sources
        </HelpText>
        <BulletPoint colors={colors}>
          Discontinue copper-based algaecides immediately
        </BulletPoint>
        <BulletPoint colors={colors}>
          Use non-copper alternatives instead
        </BulletPoint>

        <InfoBox colors={colors}>
          For severe copper problems (above 1.0 ppm), consider consulting a spa
          professional or complete drain and refill with tested low-copper
          water.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="Prevention Tips" colors={colors}>
        <HelpText colors={colors} bold>
          Keep copper levels low by:
        </HelpText>
        <BulletPoint colors={colors}>
          Avoiding copper-based algaecides entirely
        </BulletPoint>
        <BulletPoint colors={colors}>
          Testing source water before filling
        </BulletPoint>
        <BulletPoint colors={colors}>
          Maintaining proper pH (7.2–7.6) to prevent corrosion
        </BulletPoint>
        <BulletPoint colors={colors}>
          Using a pre-filter when filling from copper pipes
        </BulletPoint>
        <BulletPoint colors={colors}>
          Regular testing (weekly or bi-weekly)
        </BulletPoint>
        <BulletPoint colors={colors}>
          Inspecting heaters and heat exchangers for corrosion
        </BulletPoint>

        <InfoBox colors={colors}>
          Hot tubs with good pH balance and proper sanitizer rarely have copper
          issues, unless copper-based chemicals are added.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="When to Test Copper" colors={colors}>
        <HelpText colors={colors} bold>
          Test copper levels:
        </HelpText>
        <BulletPoint colors={colors}>
          Weekly as part of routine maintenance
        </BulletPoint>
        <BulletPoint colors={colors}>
          After filling or refilling the hot tub
        </BulletPoint>
        <BulletPoint colors={colors}>
          If you notice green/blue water tint
        </BulletPoint>
        <BulletPoint colors={colors}>
          If you see staining on surfaces
        </BulletPoint>
        <BulletPoint colors={colors}>
          After using any copper-based products
        </BulletPoint>
        <BulletPoint colors={colors}>
          If pH has been low for extended periods
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes to Avoid" colors={colors}>
        <BulletPoint colors={colors}>
          ❌ Using copper-based algaecides in hot tubs
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Ignoring low pH (which corrodes copper components)
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Not testing source water before filling
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Waiting too long to treat high copper levels
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Shocking water when copper is high (can cause staining)
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
