import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { Wrench, AlertCircle } from "lucide-react-native";

export default function MaintenanceFormFields({
  form,
  onChangeAction,
  onToggleFilterChanged,
  showSuggestions,
  filteredSuggestions,
  onSelectSuggestion,
  onBlurAction,
  colors,
  error,
}) {
  return (
    <>
      <View style={{ marginBottom: 16, zIndex: 1000 }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: "500",
            marginBottom: 8,
          }}
        >
          Action Taken
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? colors.notification : colors.border,
            paddingHorizontal: 12,
          }}
        >
          <Wrench
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              height: 48,
              color: colors.text,
              fontSize: 16,
            }}
            value={form.action}
            onChangeText={onChangeAction}
            placeholder="e.g., Replaced jet, Fixed leak"
            placeholderTextColor={colors.textTertiary}
            onBlur={onBlurAction}
          />
        </View>

        {error && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              marginLeft: 4,
            }}
          >
            <AlertCircle
              size={14}
              color={colors.notification}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: colors.notification,
                fontSize: 12,
                flex: 1,
              }}
            >
              {error}
            </Text>
          </View>
        )}

        {/* Autocomplete Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginTop: 4,
              maxHeight: 150,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <FlatList
              data={filteredSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectSuggestion(item)}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 15 }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: colors.success + "15",
              padding: 8,
              borderRadius: 8,
              marginRight: 12,
            }}
          >
            <Wrench size={18} color={colors.success} />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: colors.text,
            }}
          >
            Filter changed
          </Text>
        </View>
        <Switch
          value={form.filter_changed}
          onValueChange={onToggleFilterChanged}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor="#FFFFFF"
        />
      </View>
    </>
  );
}
