import React from "react";
import { View, Text, Button } from "react-native";

export default function CashierDashboard({ logout }) {
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Cashier Dashboard
      </Text>
      <Button title="Dummy 1" onPress={() => {}} />
      <Button title="Dummy 2" onPress={() => {}} />
      <Button title="Dummy 3" onPress={() => {}} />
      <Button title="Dummy 4" onPress={() => {}} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
