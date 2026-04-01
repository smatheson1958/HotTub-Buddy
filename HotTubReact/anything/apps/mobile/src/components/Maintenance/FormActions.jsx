import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Save, Trash2 } from "lucide-react-native";

export default function FormActions({
  isEditMode,
  isSubmitting,
  editType,
  logType,
  onSubmit,
  onDelete,
  colors,
}) {
  return (
    <>
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isSubmitting}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 16,
          borderRadius: 16,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {isEditMode
                ? `Update ${editType === "maintenance" ? "Log" : "Check"}`
                : `Save ${logType === "maintenance" ? "Log" : "Check"}`}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {isEditMode && (
        <TouchableOpacity
          onPress={onDelete}
          disabled={isSubmitting}
          style={{
            backgroundColor: colors.notification + "15",
            paddingVertical: 16,
            borderRadius: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
            borderWidth: 1,
            borderColor: colors.notification + "30",
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.notification} />
          ) : (
            <>
              <Trash2
                size={20}
                color={colors.notification}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: colors.notification,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Delete Record
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </>
  );
}
