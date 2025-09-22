import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingPage from "./screens/LandingPage"; // import your landing page
import LoginScreen from "./screens/LoginScreen";
import AdminDashboard from "./screens/AdminDashboard";
import UserManagementScreen from "./screens/UserManagementScreen";
import WaiterDashboard from "./screens/WaiterDashboard";
import CashierDashboard from "./screens/CashierDashboard";
import InventoryManagementScreen from "./screens/InventoryManagementScreen";
import Ingredients from "./screens/Ingredients";
import Transactions from "./screens/Transactions";

const Stack = createStackNavigator();

export default function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  function logout() {
    setToken(null);
    setRole(null);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <>
            <Stack.Screen
              name="LandingPage"
              component={LandingPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => (
                <LoginScreen {...props} setRole={setRole} setToken={setToken} />
              )}
            </Stack.Screen>
          </>
        ) : role === "admin" || role === "owner" ? (
          <>
            <Stack.Screen name="AdminDashboard">
              {(props) => (
                <AdminDashboard
                  {...props}
                  token={token}
                  role={role}
                  logout={logout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="UserManagement"
              options={{ title: "Manage Users" }}
            >
              {(props) => <UserManagementScreen {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen
              name="InventoryManagement"
              options={{ title: "Manage Inventory" }}
            >
              {(props) => (
                <InventoryManagementScreen {...props} token={token} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Ingredients" options={{ title: "Ingredients" }}>
              {(props) => <Ingredients {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen
              name="Transactions"
              options={{ title: "Transactions" }}
            >
              {(props) => <Transactions {...props} token={token} />}
            </Stack.Screen>
          </>
        ) : role === "waiter" ? (
          <Stack.Screen name="WaiterDashboard">
            {(props) => <WaiterDashboard {...props} logout={logout} />}
          </Stack.Screen>
        ) : role === "cashier" ? (
          <Stack.Screen name="CashierDashboard">
            {(props) => <CashierDashboard {...props} logout={logout} />}
          </Stack.Screen>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
