import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react-native";
import useTheme from "@/utils/useTheme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.border,
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <LayoutDashboard color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="setup"
        options={{
          title: "Setup",
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
      {/* Hidden screens - accessible via navigation but not in tab bar */}
      <Tabs.Screen
        name="activity"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="usage"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="weekly-history"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
