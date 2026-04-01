import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { IdealRange, WarningBox, InfoBox } from "../InfoBoxes";

export function PhContent({ colors }) {
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
        pH & Alkalinity Help Guide
      </Text>

      <CollapsibleSection
        title="pH – What it is"
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          pH measures how acidic or alkaline the water is.
        </HelpText>
        <HelpText colors={colors} marginTop={8}>
          It affects comfort, sanitizer efficiency, and equipment life.
        </HelpText>
        <IdealRange label="Ideal pH range" value="7.2 – 7.6" colors={colors} />
        <BulletPoint colors={colors}>Low pH = acidic</BulletPoint>
        <BulletPoint colors={colors}>High pH = alkaline</BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="pH Down (Lower pH)" colors={colors}>
        <HelpText colors={colors} bold>
          Common scenarios
        </HelpText>
        <BulletPoint colors={colors}>pH is above 7.6</BulletPoint>
        <BulletPoint colors={colors}>Water looks dull or cloudy</BulletPoint>
        <BulletPoint colors={colors}>Scale forming</BulletPoint>
        <BulletPoint colors={colors}>
          Chlorine/bromine not working efficiently
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Typical process (for reference)
        </HelpText>
        <BulletPoint colors={colors}>
          Commonly, users add a small dose of pH Down
        </BulletPoint>
        <BulletPoint colors={colors}>Run circulation with air OFF</BulletPoint>
        <BulletPoint colors={colors}>Wait 30–60 minutes</BulletPoint>
        <BulletPoint colors={colors}>Retest and repeat if needed</BulletPoint>

        <InfoBox colors={colors}>
          pH Down will also slightly lower alkalinity. Common practice is to
          lower pH gradually. Consult product labels for specific instructions.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="pH Up (Raise pH)" colors={colors}>
        <HelpText colors={colors} bold>
          Common scenarios
        </HelpText>
        <BulletPoint colors={colors}>pH is below 7.2</BulletPoint>
        <BulletPoint colors={colors}>
          Water feels sharp or irritating
        </BulletPoint>
        <BulletPoint colors={colors}>Corrosion risk to metal parts</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Typical process (for reference)
        </HelpText>
        <BulletPoint colors={colors}>
          Commonly, users add a small dose of pH Up
        </BulletPoint>
        <BulletPoint colors={colors}>
          Circulate water for 20–30 minutes
        </BulletPoint>
        <BulletPoint colors={colors}>Retest before adding more</BulletPoint>

        <InfoBox colors={colors}>
          pH Up can also raise alkalinity. Consult product labels for specific
          guidance.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Total Alkalinity (TA) – What it is"
        colors={colors}
      >
        <HelpText colors={colors} bold>
          Alkalinity buffers pH and helps prevent rapid pH swings.
        </HelpText>
        <IdealRange
          label="Ideal TA range"
          value="80 – 120 ppm"
          colors={colors}
        />
        <BulletPoint colors={colors}>Too high = pH keeps rising</BulletPoint>
        <BulletPoint colors={colors}>
          Too low = pH unstable and hard to control
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Alkalinity Up (Raise TA)" colors={colors}>
        <HelpText colors={colors} bold>
          Common scenarios
        </HelpText>
        <BulletPoint colors={colors}>TA is below 80 ppm</BulletPoint>
        <BulletPoint colors={colors}>pH swings up and down quickly</BulletPoint>
        <BulletPoint colors={colors}>Water chemistry is unstable</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          Typical process (for reference)
        </HelpText>
        <BulletPoint colors={colors}>
          Typically, users add Alkalinity Up in small stages
        </BulletPoint>
        <BulletPoint colors={colors}>Circulate for 30 minutes</BulletPoint>
        <BulletPoint colors={colors}>Retest TA before adding more</BulletPoint>

        <InfoBox colors={colors}>
          Alkalinity Up raises pH as well. Common practice is to adjust
          alkalinity first, then pH. Always consult manufacturer guidelines.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection title="Alkalinity Down (Lower TA)" colors={colors}>
        <HelpText colors={colors} bold>
          Common scenarios
        </HelpText>
        <BulletPoint colors={colors}>TA is above 120–150 ppm</BulletPoint>
        <BulletPoint colors={colors}>
          pH keeps drifting up despite adjustments
        </BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          General guidance (educational)
        </HelpText>
        <WarningBox colors={colors}>
          Alkalinity Down is typically NOT a common practice for direct use
        </WarningBox>
        <HelpText colors={colors} marginTop={8}>
          Common approach:
        </HelpText>
        <BulletPoint colors={colors}>
          Lower pH to ~7.2 using pH Down
        </BulletPoint>
        <BulletPoint colors={colors}>
          Allow aeration/use to slowly bring pH back up
        </BulletPoint>
        <BulletPoint colors={colors}>
          This process reduces TA naturally
        </BulletPoint>

        <InfoBox colors={colors}>
          Direct TA reducers can overshoot and cause instability. Consult a spa
          professional for specific advice.
        </InfoBox>
      </CollapsibleSection>

      <CollapsibleSection
        title="Common Adjustment Sequence (For Reference)"
        colors={colors}
      >
        <BulletPoint colors={colors}>
          1. Fix Alkalinity first (if outside range)
        </BulletPoint>
        <BulletPoint colors={colors}>2. Then adjust pH</BulletPoint>
        <BulletPoint colors={colors}>
          3. Make changes slowly and retest often
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes to Avoid" colors={colors}>
        <BulletPoint colors={colors}>
          ❌ Chasing "perfect" numbers in one go
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Adding pH Up and Down on the same day
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Running air jets while lowering pH
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Raising alkalinity when pH is already high
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
