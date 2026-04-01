import { useColorScheme } from "react-native";

/**
 * Semantic colours aligned with the iOS palette reference
 * (ios-colour-example-page.html & ios-colour-schema 2.html).
 */
export default function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    isDark,
    // Surfaces (match Swift AppPalette)
    background: isDark ? "#000000" : "#F2F2F7",
    surface: isDark ? "#1C1C1E" : "#FFFFFF",
    surfaceElevated: isDark ? "#2C2C2E" : "#FFFFFF",
    surfaceHighest: isDark ? "#1C1C1E" : "#F2F2F7",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)",
    textTertiary: isDark ? "rgba(235,235,245,0.3)" : "rgba(60,60,67,0.3)",
    primary: "#007AFF",
    primaryGradientStart: "#007AFF",
    primaryGradientEnd: "#5856D6",
    border: isDark ? "#3A3A3C" : "#C6C6C8",
    notification: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    warningBackground: isDark ? "rgba(255,149,0,0.2)" : "rgba(255,149,0,0.12)",
    hydration: "#5AC8FA",
    fitness: "#34C759",
    calories: "#FF3B30",
    nutrition: "#5856D6",
    categoryActive: "#007AFF",
    categoryActiveText: "#FFFFFF",
  };

  return { colors, isDark };
}
