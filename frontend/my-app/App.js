import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingPage from "./screens/LandingPage";
import LoginScreen from "./screens/LoginScreen";
import RoleTabs from "./navigation/RoleTabs";
import globalStyles from "./static/css/GlobalStyles";

const Stack = createStackNavigator();

export default function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const logout = () => {
    setToken(null);
    setRole(null);
  };

  // Hide scrollbars only on web
  useEffect(() => {
    if (Platform.OS === "web") {
      const style = document.createElement("style");
      style.innerHTML = `
        html, body {
          overflow: hidden !important;
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #e0e0e0;
        }
        ::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const Navigator = (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} setRole={setRole} setToken={setToken} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="RoleTabs">
            {(props) => (
              <RoleTabs {...props} token={token} role={role} logout={logout} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );

  // 🧱 Wrap with a fixed "phone frame" on web only
  if (Platform.OS === "web") {
    return (
      <View style={globalStyles.webWrapper}>
        <View style={globalStyles.phoneFrame}>{Navigator}</View>
      </View>
    );
  }

  // Mobile devices use normal layout
  return Navigator;
}
