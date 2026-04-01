import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle } from "lucide-react-native";

const DISCLAIMER_VERSION = "1.0";

export default function DisclaimerModal({ visible, onAccept }) {
  const insets = useSafeAreaInsets();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View
        style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
      >
        {/* Header */}
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <AlertCircle size={28} color="#DC2626" />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#111827",
                flex: 1,
              }}
            >
              Important Disclaimer
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>
            Version {DISCLAIMER_VERSION} • Please read carefully before using
            this app
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Section title="Overview">
            <Text style={styles.text}>
              <Text style={styles.bold}>
                This app is for data-logging purposes only. It does not provide
                medical, safety, or chemical advice. The user is solely
                responsible for verifying chemical levels and ensuring the
                safety of their water.
              </Text>
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              This is a{" "}
              <Text style={styles.bold}>
                free, non-commercial informational app
              </Text>{" "}
              provided by Curley Brackets Engineering Ltd for tracking and
              reference purposes only. It does not provide professional advice
              and does not replace manufacturer instructions or professional
              services.
            </Text>
          </Section>

          <Section title="Water Chemistry">
            <Text style={styles.text}>
              This app is a{" "}
              <Text style={styles.bold}>logging and tracking tool</Text> for
              recording your hot tub maintenance. Any water chemistry values,
              ranges, or guidance shown are{" "}
              <Text style={styles.bold}>for reference only</Text>. The app does
              not calculate or recommend chemical dosages. Always follow your
              hot tub or spa manufacturer's guidance and the instructions on
              chemical products. Users are responsible for{" "}
              <Text style={styles.bold}>testing their own water</Text> and
              making their own decisions about chemical treatment.
            </Text>
          </Section>

          <Section title="Safety">
            <Text style={styles.text}>
              Pool and spa chemicals can be hazardous if handled incorrectly.
              Always read and follow product labels, safety warnings, and safety
              data sheets.{" "}
              <Text style={styles.bold}>
                This app is intended for use by adults only (18+)
              </Text>
              .
            </Text>
          </Section>

          <Section title="No Data Collection">
            <Text style={styles.text}>
              This app does not collect, store, transmit, or access any personal
              data. All information entered remains on your device only.
            </Text>
          </Section>

          <Section title="Local Laws">
            <Text style={styles.text}>
              Laws, standards, and recommended practices may vary by country or
              region. Users are responsible for ensuring compliance with{" "}
              <Text style={styles.bold}>local regulations</Text> and
              manufacturer guidance.
            </Text>
          </Section>

          <Section title="No Warranty">
            <Text style={styles.text}>
              This app is provided <Text style={styles.bold}>"as is"</Text> and{" "}
              <Text style={styles.bold}>"as available"</Text>, without
              warranties of any kind, either express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, or non-infringement.
            </Text>
          </Section>

          <Section title="Limitation of Liability">
            <Text style={styles.text}>
              To the fullest extent permitted by applicable law, Curley Brackets
              Engineering Ltd accepts{" "}
              <Text style={styles.bold}>
                no liability for any loss, damage, or injury
              </Text>{" "}
              (including but not limited to direct, indirect, incidental,
              consequential, special, or punitive damages) arising from use of
              or inability to use this app.
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              <Text style={styles.bold}>
                Nothing in this disclaimer excludes or limits our liability for:
              </Text>
            </Text>
            <Text style={styles.bullet}>
              • Death or personal injury caused by our negligence
            </Text>
            <Text style={styles.bullet}>
              • Fraud or fraudulent misrepresentation
            </Text>
            <Text style={styles.bullet}>
              • Any other liability that cannot be excluded or limited under UK
              law
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              Use of this app is entirely{" "}
              <Text style={styles.bold}>at the user's own risk</Text>.
            </Text>
          </Section>

          <Section title="User Responsibilities">
            <Text style={styles.text}>By using this app, you agree to:</Text>
            <Text style={styles.bullet}>
              • Test your water before adding any chemicals
            </Text>
            <Text style={styles.bullet}>
              • Follow all applicable safety regulations and manufacturer
              instructions
            </Text>
            <Text style={styles.bullet}>
              • Indemnify and hold harmless Curley Brackets Engineering Ltd from
              any claims arising from your use of this app
            </Text>
          </Section>

          <Section title="Governing Law">
            <Text style={styles.text}>
              This disclaimer is governed by the laws of England and Wales. Any
              disputes shall be subject to the exclusive jurisdiction of the
              courts of England and Wales.
            </Text>
          </Section>

          <Section title="Modifications">
            <Text style={styles.text}>
              We reserve the right to modify or discontinue this app at any time
              without notice.
            </Text>
          </Section>

          <Section title="Severability">
            <Text style={styles.text}>
              If any provision of this disclaimer is found to be invalid or
              unenforceable, the remaining provisions shall continue in full
              force and effect.
            </Text>
          </Section>

          <View
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
            }}
          >
            <Text
              style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}
            >
              © 2025 Curley Brackets Engineering Ltd. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Last Updated: February 20, 2026
            </Text>
          </View>

          {!hasScrolledToBottom && (
            <View
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#FEF3C7",
                borderRadius: 8,
              }}
            >
              <Text
                style={{ fontSize: 13, color: "#92400E", textAlign: "center" }}
              >
                Please scroll to the bottom to enable the Accept button
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Accept Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <TouchableOpacity
            onPress={() => onAccept(DISCLAIMER_VERSION)}
            disabled={!hasScrolledToBottom}
            style={{
              backgroundColor: hasScrolledToBottom ? "#DC2626" : "#D1D5DB",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>
              {hasScrolledToBottom
                ? "I Accept & Understand"
                : "Scroll to Bottom to Accept"}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            By accepting, you acknowledge you have read and understood this
            disclaimer
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = {
  text: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  bullet: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginLeft: 12,
    marginTop: 4,
  },
};

export { DISCLAIMER_VERSION };
