import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../static/css/GlobalStyles";
import Header from "../components/Header";

export default function InventoryScreen({ navigation }) {
  return (
    <>
      <Header headerText="Inventory Management" />
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color="#fff"
          style={globalStyles.backButton}
        />
      </TouchableOpacity>
      <View style={globalStyles.container}>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            navigation.navigate("Ingredients");
          }}
        >
          <Text style={globalStyles.buttonText}>Raw Materials</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            navigation.navigate("Transactions");
          }}
        >
          <Text style={globalStyles.buttonText}>Transactions</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
