import React from "react";
import { View, Text } from "react-native";
import { CollapsibleSection } from "../CollapsibleSection";
import { HelpText, BulletPoint } from "../TextComponents";
import { IdealRange, WarningBox, InfoBox } from "../InfoBoxes";

export function SanitizerContent({ colors, isBromine }) {
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
        {isBromine ? "Bromine" : "Chlorine"} & Copper – Help Guide
      </Text>

      <CollapsibleSection
        title={`${isBromine ? "Bromine" : "Chlorine"} – What it does`}
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          {isBromine ? "Bromine" : "Chlorine"} is the primary sanitizer that
          kills bacteria, viruses, and algae in hot tubs.
        </HelpText>
      </CollapsibleSection>

      <CollapsibleSection
        title={`Free ${isBromine ? "Bromine" : "Chlorine"} (FC)`}
        colors={colors}
        defaultOpen={true}
      >
        <HelpText colors={colors} bold>
          What it is
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          {isBromine ? "Bromine" : "Chlorine"} available to sanitize
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          The most important {isBromine ? "bromine" : "chlorine"} value
        </HelpText>

        <IdealRange
          label="Ideal range"
          value={isBromine ? "3–5 ppm" : "1–3 ppm (free), 3–5 ppm (total)"}
          colors={colors}
        />

        <HelpText colors={colors} bold marginTop={12}>
          If too low
        </HelpText>
        <BulletPoint colors={colors}>Poor sanitation</BulletPoint>
        <BulletPoint colors={colors}>Risk of bacteria growth</BulletPoint>
        <BulletPoint colors={colors}>Cloudy or smelly water</BulletPoint>

        <HelpText colors={colors} bold marginTop={12}>
          If too high
        </HelpText>
        <BulletPoint colors={colors}>Skin and eye irritation</BulletPoint>
        <BulletPoint colors={colors}>
          Strong {isBromine ? "bromine" : "chlorine"} smell
        </BulletPoint>
        <BulletPoint colors={colors}>
          Faster wear on covers and plastics
        </BulletPoint>
      </CollapsibleSection>

      {!isBromine && (
        <CollapsibleSection title="Combined Chlorine (CC)" colors={colors}>
          <HelpText colors={colors} bold>
            What it is
          </HelpText>
          <HelpText colors={colors} marginTop={4}>
            Chlorine that has reacted with contaminants
          </HelpText>
          <HelpText colors={colors} marginTop={4}>
            Also called chloramines
          </HelpText>

          <IdealRange label="Ideal range" value="0–0.5 ppm" colors={colors} />

          <HelpText colors={colors} bold marginTop={12}>
            Signs of high CC
          </HelpText>
          <BulletPoint colors={colors}>
            "Chlorine" smell (not actually free chlorine)
          </BulletPoint>
          <BulletPoint colors={colors}>Eye irritation</BulletPoint>
          <BulletPoint colors={colors}>
            Water smells musty or unpleasant
          </BulletPoint>

          <HelpText colors={colors} bold marginTop={12}>
            Typical approach to address high CC
          </HelpText>
          <BulletPoint colors={colors}>
            Commonly, users shock the spa (raise chlorine to 8–10 ppm briefly)
          </BulletPoint>
          <BulletPoint colors={colors}>
            Leave cover open during shocking
          </BulletPoint>
        </CollapsibleSection>
      )}

      <CollapsibleSection
        title={`Total ${isBromine ? "Bromine" : "Chlorine"} (TC)`}
        colors={colors}
      >
        <HelpText colors={colors} bold>
          What it is
        </HelpText>
        <HelpText colors={colors} marginTop={4}>
          {isBromine
            ? "Total bromine in the water (active + used)"
            : "Free Chlorine + Combined Chlorine"}
        </HelpText>

        {!isBromine && (
          <>
            <InfoBox colors={colors}>
              Key relationship:{"\n"}
              Combined Chlorine = Total Chlorine − Free Chlorine
            </InfoBox>

            <HelpText colors={colors} bold marginTop={12}>
              Example
            </HelpText>
            <BulletPoint colors={colors}>Total Chlorine = 4.4 ppm</BulletPoint>
            <BulletPoint colors={colors}>Free Chlorine = 4.3 ppm</BulletPoint>
            <BulletPoint colors={colors}>
              Combined Chlorine = 0.1 ppm ✅
            </BulletPoint>
          </>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title={`${isBromine ? "Bromine" : "Chlorine"} & pH – Important Link`}
        colors={colors}
      >
        <BulletPoint colors={colors}>
          High pH makes {isBromine ? "bromine" : "chlorine"} less effective
        </BulletPoint>
        <BulletPoint colors={colors}>
          Best {isBromine ? "bromine" : "chlorine"} performance is at pH 7.2–7.6
        </BulletPoint>
        <BulletPoint colors={colors}>
          If {isBromine ? "bromine" : "chlorine"} "won't hold," always check pH
          first
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Copper (Cu) – What it is" colors={colors}>
        <HelpText colors={colors} bold>
          Why copper appears in hot tubs
        </HelpText>
        <BulletPoint colors={colors}>From copper heat exchangers</BulletPoint>
        <BulletPoint colors={colors}>Metal components</BulletPoint>
        <BulletPoint colors={colors}>
          Some algaecides or mineral systems
        </BulletPoint>
        <BulletPoint colors={colors}>Corrosion caused by low pH</BulletPoint>

        <IdealRange
          label="Ideal Copper Level"
          value="0.0 – 0.2 ppm"
          colors={colors}
        />
        <WarningBox colors={colors}>
          Anything above 0.3 ppm can cause problems
        </WarningBox>

        <HelpText colors={colors} bold marginTop={12}>
          Problems caused by high copper
        </HelpText>
        <BulletPoint colors={colors}>Green or blue water</BulletPoint>
        <BulletPoint colors={colors}>
          Staining on shells, jets, and fittings
        </BulletPoint>
        <BulletPoint colors={colors}>Green hair or nail staining</BulletPoint>
        <BulletPoint colors={colors}>
          Discoloured plastic components
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Copper & pH – Critical Link" colors={colors}>
        <WarningBox colors={colors}>
          Low pH dissolves copper into the water
        </WarningBox>
        <BulletPoint colors={colors}>
          Acidic water dramatically increases copper release
        </BulletPoint>
        <BulletPoint colors={colors}>
          Keeping pH stable prevents copper staining
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title={`Copper & ${isBromine ? "Bromine" : "Chlorine"} – Important Interaction`}
        colors={colors}
      >
        <WarningBox colors={colors}>
          High {isBromine ? "bromine" : "chlorine"} + metals = oxidised staining
        </WarningBox>
        <HelpText colors={colors} marginTop={8}>
          Shocking water with copper present can:
        </HelpText>
        <BulletPoint colors={colors}>Lock stains into surfaces</BulletPoint>
        <BulletPoint colors={colors}>Cause sudden colour changes</BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection
        title="General Management Guidance for Copper"
        colors={colors}
      >
        <BulletPoint colors={colors}>Keep pH 7.2–7.6</BulletPoint>
        <BulletPoint colors={colors}>
          Avoid unnecessary metal-based products
        </BulletPoint>
        <BulletPoint colors={colors}>
          Use a metal sequestrant if copper is detected
        </BulletPoint>
        <BulletPoint colors={colors}>
          Avoid shocking if copper is already high (treat metals first)
        </BulletPoint>
      </CollapsibleSection>

      <CollapsibleSection title="Common Mistakes to Avoid" colors={colors}>
        <BulletPoint colors={colors}>
          ❌ Ignoring pH when {isBromine ? "bromine" : "chlorine"} won't hold
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Shocking water with known metal contamination
        </BulletPoint>
        <BulletPoint colors={colors}>
          ❌ Using copper-based algaecides in hot tubs
        </BulletPoint>
        <BulletPoint colors={colors}>❌ Letting pH drop below 7.0</BulletPoint>
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
