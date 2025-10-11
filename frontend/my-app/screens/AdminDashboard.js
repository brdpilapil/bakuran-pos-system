import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api";
import globalStyles from "../static/css/GlobalStyles";
import Header from "../components/Header";

export default function AdminDashboard({ token, role, logout, navigation }) {
  return (
    <>
      <Header
        headerText={`${role === "owner" ? "Owner" : "Admin"} Dashboard`}
      />
      <View style={globalStyles.container}>
        <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
          <Text style={globalStyles.buttonText}>Start New Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            navigation.navigate("UserManagement");
          }}
        >
          <Text style={globalStyles.buttonText}>User Management</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            navigation.navigate("InventoryManagement");
          }}
        >
          <Text style={globalStyles.buttonText}>Inventory Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
          <Text style={globalStyles.buttonText}>Ambot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => {}}>
          <Text style={globalStyles.buttonText}>Ambot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.signOutButton} onPress={logout}>
          <Text style={globalStyles.signOutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
