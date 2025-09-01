import React from "react";
import { View, Text, Button } from "react-native";

export default function WaiterDashboard({ logout }) {
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Waiter Dashboard</Text>
      <Button title="Start New Order" onPress={() => {}} />
      <Button title="View Order List" onPress={() => {}} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
