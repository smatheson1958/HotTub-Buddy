import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { IdealRange, WarningBox, InfoBox } from "../InfoBoxes";

export function AlkalinityContent({ colors }) {
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
        Total Alkalinity Guide
      </Text>

      <CollapsibleSection
        title="What is Total Alkalinity?"
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          Total Alkalinity (TA) is a measure of your water's ability to resist
          changes in pH.
        </HelpText>
        <HelpText colors={colors} marginTop={8}>
          Think of it as a pH buffer or shock absorber. When TA is in the ideal
          range, your pH stays stable. When it's too low, pH swings wildly. When
          it's too high, pH becomes difficult to adjust.
        </HelpText>
        <IdealRange
          label="Ideal Total Alkalinity range"
          value="80 – 120 ppm"
          colors={colors}
        />
        <HelpText colors={colors} marginTop={8}>
          Most hot tubs perform best around 100 ppm.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Why Alkalinity Matters" colors={colors}>
        <HelpText colors={colors} bold>
          Total Alkalinity affects:
        </HelpText>
        <BulletPoint colors={colors}>pH stability</BulletPoint>
        <BulletPoint colors={colors}>
          Sanitizer effectiveness (chlorine/bromine)
        </BulletPoint>
        <BulletPoint colors={colors}>Water clarity</BulletPoint>
        <BulletPoint colors={colors}>Equipment corrosion rates</BulletPoint>
        <BulletPoint colors={colors}>Bather comfort</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          The pH-Alkalinity relationship
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          TA and pH are closely linked. Adjusting one often affects the other.
          Always adjust Total Alkalinity FIRST, then fine-tune pH.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection title="Low Alkalinity Problems" colors={colors}>
        <HelpText colors={colors} bold>
          When TA is below 80 ppm:
        </HelpText>
        <BulletPoint colors={colors}>
          pH becomes unstable and swings easily
        </BulletPoint>
        <BulletPoint colors={colors}>
          Water may become corrosive to equipment
        </BulletPoint>
        <BulletPoint colors={colors}>
          Eye and skin irritation increases
        </BulletPoint>
        <BulletPoint colors={colors}>
          Sanitizer efficiency decreases
        </BulletPoint>
        <BulletPoint colors={colors}>Staining may occur</BulletPoint>

        <WarningBox colors={colors}>
          Low alkalinity can cause rapid pH drops, making water acidic and
          damaging to your hot tub components.
        </WarningBox>
      </CollapsibleSection>

      <CollapsibleSection title="High Alkalinity Problems" colors={colors}>
        <HelpText colors={colors} bold>
          When TA is above 120 ppm:
        </HelpText>
        <BulletPoint colors={colors}>pH becomes difficult to lower</BulletPoint>
        <BulletPoint colors={colors}>
          Water may become cloudy or hazy
        </BulletPoint>
        <BulletPoint colors={colors}>Scale formation increases</BulletPoint>
        <BulletPoint colors={colors}>
          Sanitizer effectiveness decreases
        </BulletPoint>
        <BulletPoint colors={colors}>
          Equipment and surfaces may develop calcium deposits
        </BulletPoint>

        <InfoBox colors={colors}>
          High alkalinity often causes pH to drift upward constantly, requiring
          frequent pH Down additions.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Process to Raise Alkalinity (Educational)"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          If Total Alkalinity is below 80 ppm:
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          Common approach using Alkalinity Up (Sodium Bicarbonate)
        </HelpText>
        <BulletPoint colors={colors}>
          Add Alkalinity Increaser/Alkalinity Up
        </BulletPoint>
        <BulletPoint colors={colors}>
          Also called "Sodium Bicarbonate" or "Baking Soda"
        </BulletPoint>
        <BulletPoint colors={colors}>
          Follow product instructions for dosage
        </BulletPoint>
        <BulletPoint colors={colors}>
          Broadcast evenly across the water surface
        </BulletPoint>
        <BulletPoint colors={colors}>
          Run jets for 15-30 minutes to circulate
        </BulletPoint>
        <BulletPoint colors={colors}>
          Wait 2-4 hours before retesting
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Typical dosage reference (for 400-gallon hot tub):
        </HelpText>
        <BulletPoint colors={colors}>
          To raise TA by 10 ppm: ~40g (1.5 oz)
        </BulletPoint>
        <BulletPoint colors={colors}>
          To raise TA by 20 ppm: ~80g (3 oz)
        </BulletPoint>
        <BulletPoint colors={colors}>
          To raise TA by 30 ppm: ~120g (4.5 oz)
        </BulletPoint>

        <InfoBox colors={colors}>
          Always check your product label for specific dosing instructions based
          on your hot tub's water volume.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Typical Process to Lower Alkalinity (Educational)"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          If Total Alkalinity is above 120 ppm:
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          Common approach using pH Down (with aeration method)
        </HelpText>
        <BulletPoint colors={colors}>
          Add pH Down (Sodium Bisulfate or Muriatic Acid)
        </BulletPoint>
        <BulletPoint colors={colors}>
          This will lower BOTH pH and TA
        </BulletPoint>
        <BulletPoint colors={colors}>
          Add slowly in small doses over several days
        </BulletPoint>
        <BulletPoint colors={colors}>
          Run jets and aerators to increase aeration
        </BulletPoint>
        <BulletPoint colors={colors}>
          Aeration raises pH while keeping TA lower
        </BulletPoint>
        <BulletPoint colors={colors}>
          Retest after 4-6 hours and adjust as needed
        </BulletPoint>

        <WarningBox colors={colors}>
          There is no "Alkalinity Down" product. Lowering alkalinity is managed
          by carefully using pH Down and controlling aeration. Consult a spa
          professional if unsure.
        </WarningBox>

        <HelpText colors={colors} bold marginTop={12}>
          The aeration technique:
        </HelpText>
        <BulletPoint colors={colors}>
          1. Lower both pH and TA with pH Down
        </BulletPoint>
        <BulletPoint colors={colors}>
          2. Run jets/aerators to raise pH back up
        </BulletPoint>
        <BulletPoint colors={colors}>
          3. Repeat until TA reaches ideal range
        </BulletPoint>
        <BulletPoint colors={colors}>
          4. Fine-tune pH separately once TA is correct
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Testing & Adjustment Tips" colors={colors}>
        <HelpText colors={colors} bold>
          Best practices:
        </HelpText>
        <BulletPoint colors={colors}>
          Test TA weekly as part of routine maintenance
        </BulletPoint>
        <BulletPoint colors={colors}>
          Always adjust TA BEFORE adjusting pH
        </BulletPoint>
        <BulletPoint colors={colors}>
          Make small adjustments and retest before adding more
        </BulletPoint>
        <BulletPoint colors={colors}>
          Wait at least 4 hours between tests for accurate readings
        </BulletPoint>
        <BulletPoint colors={colors}>
          Keep detailed logs of adjustments and results
        </BulletPoint>

        <InfoBox colors={colors}>
          Stable alkalinity means less frequent chemical adjustments and more
          enjoyable soaking time!
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes to Avoid" colors={colors}>
        <BulletPoint colors={colors}>
          ❌ Adjusting pH before fixing alkalinity
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Adding too much Alkalinity Up at once
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Expecting instant results (wait 4+ hours)
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Ignoring TA when pH keeps drifting
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Using pH Up/Down without checking TA first
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Looking for "Alkalinity Down" (it doesn't exist!)
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title="Alkalinity vs pH: What's the Difference?"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          pH measures acidity/basicity
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          pH tells you how acidic or basic your water is right now (scale 0-14).
        </HelpText>

        <HelpText colors={colors} bold marginTop={12}>
          Total Alkalinity measures buffering capacity
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          TA tells you how well your water resists pH changes (measured in ppm).
        </HelpText>

        <InfoBox colors={colors}>
          Think of pH as the "scoreboard" and Total Alkalinity as the "shock
          absorber" that keeps the score from changing too quickly.
        </InfoBox>
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
