import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import globalStyles from "../static/css/GlobalStyles";
import Header from "../components/Header";

export default function CashierDashboard({ logout }) {
  return (
    <>
      <Header headerText="Cashier Dashboard" />
      <View style={globalStyles.container}>
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
    </>
  );
}
