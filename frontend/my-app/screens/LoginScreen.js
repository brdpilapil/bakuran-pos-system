// LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import logo from "../assets/logo.png";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation, setRole, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "incorrect" or "noAccount"

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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#5a2c2c" />
      </TouchableOpacity>
      <Image source={logo} style={styles.logo} resizeMode="cover" />
      <Text style={styles.title}>Log In</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#7a5c5c"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#7a5c5c"
      />
      <TouchableOpacity
        style={styles.button}
        title={loading ? "Logging in..." : "Login"}
        onPress={login}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Dev shortcuts */}
      <Text style={{ marginTop: 16 }}>— Test —</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setRole?.("owner")}
      >
        <Text style={styles.buttonText}>Pretend Owner</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setRole?.("admin")}
      >
        <Text style={styles.buttonText}>Pretend Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setRole?.("waiter")}
      >
        <Text style={styles.buttonText}>Pretend Waiter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setRole?.("cashier")}
      >
        <Text style={styles.buttonText}>Pretend Cashier</Text>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "incorrect"
                ? "Incorrect Login"
                : "Account Does Not Exist"}
            </Text>
            <Text style={styles.modalMessage}>
              {modalType === "incorrect"
                ? "Either your username or password is incorrect. Please try again."
                : modalType === "blocked"
                ? "Your account is blocked. Please contact admin."
                : "The account you entered does not exist. Please sign up first."}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput: { borderWidth: 1, padding: 8, marginBottom: 12 },
  container: {
    flex: 1,
    backgroundColor: "#f3ebea",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#5a2c2c",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5a2c2c",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 45,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#5a2c2c",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 8,
    color: "#000",
  },
  button: {
    width: "80%",
    height: 45,
    backgroundColor: "#5a2c2c",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#f3ebea",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5a2c2c",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#5a2c2c",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#5a2c2c",
  },
  modalButton: {
    backgroundColor: "#5a2c2c",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
});
