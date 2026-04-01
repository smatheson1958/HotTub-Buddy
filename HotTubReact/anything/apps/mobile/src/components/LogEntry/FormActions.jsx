import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Save, Trash2 } from "lucide-react-native";

export default function FormActions({
  isEditMode,
  loading,
  onSubmit,
  onDelete,
  colors,
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          height: 56,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
              {isEditMode ? "Update Record" : "Save Record"}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {isEditMode && (
        <TouchableOpacity
          onPress={onDelete}
          disabled={loading}
          style={{
            backgroundColor: colors.notification + "15",
            height: 56,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 12,
            borderWidth: 1,
            borderColor: colors.notification + "30",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Trash2
            size={20}
            color={colors.notification}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: colors.notification,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Delete Record
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
