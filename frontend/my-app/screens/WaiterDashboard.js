import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import globalStyles from "../static/css/GlobalStyles";

export default function WaiterDashboard({ logout }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Cashier Dashboard</Text>
      <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
        <Text style={globalStyles.buttonText}>Ambot</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
        <Text style={globalStyles.buttonText}>Ambot</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
        <Text style={globalStyles.buttonText}>Ambot</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
        <Text style={globalStyles.buttonText}>Ambot</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.signOutButton} onPress={logout}>
        <Text style={globalStyles.signOutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
