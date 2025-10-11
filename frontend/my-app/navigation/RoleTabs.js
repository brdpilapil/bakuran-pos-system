import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

// Your actual screens
import AdminDashboard from "../screens/AdminDashboard";
import CashierDashboard from "../screens/CashierDashboard";
import WaiterDashboard from "../screens/WaiterDashboard";
import UserManagementScreen from "../screens/UserManagementScreen";
import InventoryManagementScreen from "../screens/InventoryManagementScreen";
import Ingredients from "../screens/Ingredients";
import Transactions from "../screens/Transactions";
import EmployeeSettings from "../screens/EmpolyeeSettings";

const Tab = createBottomTabNavigator();

const Colors = {
  primary: "#5a2c2c",
  white: "#FFFFFF",
  black: "#000000",
};

// Tabs list
// Tabs per role
const roleTabs = {
  owner: [
    {
      route: "Dashboard",
      label: "Dashboard",
      icon: "home",
      component: AdminDashboard,
    },
    {
      route: "Users",
      label: "Users",
      icon: "users",
      component: UserManagementScreen,
    },
    {
      route: "Ingredients",
      label: "Ingredients",
      icon: "layers",
      component: Ingredients,
    },
    {
      route: "Transactions",
      label: "Transactions",
      icon: "list",
      component: Transactions,
    },
  ],
  admin: [
    {
      route: "Dashboard",
      label: "Dashboard",
      icon: "home",
      component: AdminDashboard,
    },
    {
      route: "Transactions",
      label: "Transactions",
      icon: "list",
      component: Transactions,
    },
  ],
  waiter: [
    {
      route: "Dashboard",
      label: "Dashboard",
      icon: "home",
      component: WaiterDashboard,
    },
    {
      route: "Ingredients",
      label: "Ingredients",
      icon: "layers",
      component: Ingredients,
    },
    {
      route: "Settings",
      label: "Settings",
      icon: "settings",
      component: EmployeeSettings,
    },
  ],
  cashier: [
    {
      route: "Dashboard",
      label: "Dashboard",
      icon: "home",
      component: CashierDashboard,
    },
    {
      route: "Transactions",
      label: "Transactions",
      icon: "list",
      component: Transactions,
    },
    {
      route: "Settings",
      label: "Settings",
      icon: "settings",
      component: EmployeeSettings,
    },
  ],
};

// Animations
// focus
const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -20 },
  1: { scale: 1.2, translateY: -10 },
};
// not focus
const animate2 = {
  0: { scale: 0.7, translateY: -24 },
  1: { scale: 1, translateY: 7 },
};
const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.3 },
  0.5: { scale: 0.6 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

// Custom Tab Button
const TabButton = (props) => {
  const {
    item,
    onPress,
    accessibilityState,
    "aria-selected": ariaSelected,
  } = props;

  // Use aria-selected as fallback if accessibilityState is not available
  const focused = accessibilityState?.selected || ariaSelected === true;

  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const { colors } = useTheme();
  const color = Colors.white;
  const bgColor = colors.background;

  useEffect(() => {
    if (viewRef.current && circleRef.current && textRef.current) {
      if (focused) {
        viewRef.current.animate(animate1);
        circleRef.current.animate(circle1);
        textRef.current.transitionTo({ scale: 1 });
      } else {
        viewRef.current.animate(animate2);
        circleRef.current.animate(circle2);
        textRef.current.transitionTo({ scale: 0 });
      }
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={500} style={styles.container}>
        <View
          style={[
            styles.btn,
            { borderColor: bgColor, backgroundColor: bgColor },
          ]}
        >
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Feather
            name={item.icon}
            size={24}
            color={focused ? Colors.white : Colors.primary}
          />
        </View>
        <Animatable.Text ref={textRef} style={[styles.text, { color }]}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function RoleTabs({ token, role, logout }) {
  const TabArr = roleTabs[role] || [];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        {TabArr.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          >
            {(props) => (
              <item.component
                {...props}
                token={token}
                role={role}
                logout={logout}
              />
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  tabBar: {
    height: 50,
    position: "absolute",
    margin: 16,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.white,
    fontWeight: "500",
  },
});
