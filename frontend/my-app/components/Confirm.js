import { Alert } from "react-native";

export const confirm = (action, itemName, onConfirm) => {
  Alert.alert(
    `Confirm ${action}`,
    `Are you sure you want to ${action.toLowerCase()} "${itemName}"?`,
    [
      { text: "Cancel", style: "cancel" },
      { text: action, style: "destructive", onPress: onConfirm },
    ]
  );
};
