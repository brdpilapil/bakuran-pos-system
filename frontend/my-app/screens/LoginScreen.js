// LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import logo from "../assets/logo.png";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../static/css/GlobalStyles";

export default function LoginScreen({ navigation, setRole, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "incorrect", "noAccount", "blocked"

  async function login() {
    if (!username.trim() || !password) {
      setModalType("incorrect");
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "token/",
        { username: username.trim(), password },
        { headers: { Authorization: "" } }
      );

      const data = res.data || {};
      const access = data.access || data.access_token || data.token;
      const refresh = data.refresh || data.refresh_token;

      if (!access || !refresh) {
        console.log("Login response payload:", data);
        throw new Error("Server did not return access/refresh tokens");
      }

      await AsyncStorage.multiSet([
        ["access", access],
        ["refresh", refresh],
      ]);

      setToken?.(access);

      try {
        const me = await api.get("auth/me/");
        setRole?.(me.data?.role);
      } catch (e) {
        console.log(
          "Fetching role failed (optional):",
          e?.response?.data || e.message
        );
      }
    } catch (err) {
      const resp = err.response;
      const msg =
        resp?.data?.detail ||
        resp?.data?.error ||
        resp?.data?.message ||
        err.message ||
        "Login failed.";

      if (msg.includes("No active account")) {
        setModalType("noAccount");
        setModalVisible(true);
      } else if (msg.includes("blocked") || msg.includes("blocked account")) {
        setModalType("blocked");
        setModalVisible(true);
      } else {
        setModalType("incorrect");
        setModalVisible(true);
      }
      console.log("Login error:", resp?.status, resp?.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={globalStyles.centerContent}>
        <Image source={logo} style={globalStyles.logo} resizeMode="cover" />
        <Text style={globalStyles.title}>Log In</Text>
        <TextInput
          placeholder="Username"
          style={globalStyles.input}
          placeholderTextColor="#7a5c5c"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={globalStyles.input}
          placeholderTextColor="#7a5c5c"
        />
        <TouchableOpacity
          style={globalStyles.button}
          title={loading ? "Logging in..." : "Login"}
          onPress={login}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 16 }}>— Test —</Text>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => setRole?.("owner")}
        >
          <Text style={globalStyles.buttonText}>Pretend Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => setRole?.("admin")}
        >
          <Text style={globalStyles.buttonText}>Pretend Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => setRole?.("waiter")}
        >
          <Text style={globalStyles.buttonText}>Pretend Waiter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => setRole?.("cashier")}
        >
          <Text style={globalStyles.buttonText}>Pretend Cashier</Text>
        </TouchableOpacity>

        <Modal transparent={true} animationType="fade" visible={modalVisible}>
          <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalContent}>
              <Text style={globalStyles.modalTitle}>
                {modalType === "incorrect"
                  ? "Incorrect Login"
                  : "Account Does Not Exist"}
              </Text>
              <Text style={globalStyles.modalMessage}>
                {modalType === "incorrect"
                  ? "Either your username or password is incorrect. Please try again."
                  : modalType === "blocked"
                  ? "Your account is blocked. Please contact admin."
                  : "The account you entered does not exist. Please sign up first."}
              </Text>

              <TouchableOpacity
                style={globalStyles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
