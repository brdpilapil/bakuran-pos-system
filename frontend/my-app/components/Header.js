import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const logo = require("../assets/logo.png");

export default function Header({ headerText }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoWrap}>
        <Image source={logo} style={styles.logo} />
      </View>

      <Text style={styles.title}>{headerText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5c2121",

    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },

  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
});
