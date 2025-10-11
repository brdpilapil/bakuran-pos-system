// ./static/css/AppWrapper.js
import React from "react";
import { View, Platform } from "react-native";
import globalStyles from "./GlobalStyles";

export default function AppWrapper({ children }) {
  if (Platform.OS === "web") {
    return (
      <View style={globalStyles.webWrapper}>
        <View style={globalStyles.phoneFrame}>{children}</View>
      </View>
    );
  }

  return <>{children}</>;
}
