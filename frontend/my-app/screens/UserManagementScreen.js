import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../api";
import { Ionicons } from "@expo/vector-icons";

export default function UserManagementScreen({ token, navigation }) {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("create"); // "create" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    contact_number: "",
    password: "",
    role: "",
  });

  async function loadUsers() {
    try {
      const res = await fetch(`${BASE_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", "Failed to load users");
    }
  }

  async function createUser() {
    try {
      const res = await fetch(`${BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
      resetForm();
      loadUsers();
      Alert.alert("Success", "User created.");
    } catch (e) {
      Alert.alert("Create Error", e.message);
    }
  }

  async function updateUser() {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${selectedUser.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
      resetForm();
      loadUsers();
      Alert.alert("Success", "User updated.");
    } catch (e) {
      Alert.alert("Update Error", e.message);
    }
  }

  function resetForm() {
    setForm({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      contact_number: "",
      password: "",
      role: "",
    });
    setSelectedUser(null);
    setMode("create");
  }

  function startEdit(user) {
    setSelectedUser(user);
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      email: user.email || "",
      contact_number: user.contact_number || "",
      password: "",
      role: user.role || "",
    });
    setMode("edit");
  }

  async function toggleBlock(id, isBlocked) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/users/${id}/${isBlocked ? "unblock" : "block"}/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed");
      loadUsers();
    } catch {
      Alert.alert("Error", "Failed to update block status");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userText}>
          {item.first_name} {item.last_name} ({item.role})
        </Text>
        <Text style={styles.userSub}>{item.email}</Text>
        <Text style={styles.userSub}>{item.contact_number}</Text>
        <Text style={styles.userSub}>
          User: {item.username} — {item.is_blocked ? "BLOCKED" : "ACTIVE"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        <TouchableOpacity
          style={styles.usersButton}
          onPress={() => startEdit(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        {item.role !== "owner" && (
          <TouchableOpacity
            style={styles.usersButton}
            onPress={() => toggleBlock(item.id, item.is_blocked)}
          >
            <Text style={styles.buttonText}>
              {item.is_blocked ? "Unblock" : "Block"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ top: 40 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5a2c2c" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Users</Text>

        <Text style={{ marginTop: 12, fontWeight: "bold" }}>
          {mode === "create" ? "Create User" : "Edit User"}
        </Text>

        {/* Inputs */}
        <TextInput
          placeholder="First Name"
          value={form.first_name}
          onChangeText={(t) => setForm({ ...form, first_name: t })}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={form.last_name}
          onChangeText={(t) => setForm({ ...form, last_name: t })}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={form.username}
          onChangeText={(t) => setForm({ ...form, username: t })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
          style={styles.input}
        />
        <TextInput
          placeholder="Contact Number"
          value={form.contact_number}
          onChangeText={(t) => setForm({ ...form, contact_number: t })}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={form.password}
          onChangeText={(t) => setForm({ ...form, password: t })}
          secureTextEntry
          style={styles.input}
        />

        <Text style={{ marginTop: 8, fontWeight: "bold" }}>Role</Text>
        <View style={styles.input}>
          <Picker
            style={{ marginTop: -5 }}
            selectedValue={form.role}
            onValueChange={(val) => setForm({ ...form, role: val })}
          >
            <Picker.Item label="-- Select a Role --" value="" />
            <Picker.Item label="Owner" value="owner" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Cashier" value="cashier" />
            <Picker.Item label="Waiter" value="waiter" />
          </Picker>
        </View>

        {mode === "create" ? (
          <TouchableOpacity style={styles.button} onPress={createUser}>
            <Text style={styles.buttonText}>Create User</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={styles.usersButton} onPress={updateUser}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ marginTop: 12, fontWeight: "bold" }}>Users</Text>
      </View>

      {/* Users list */}
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUserItem}
        scrollEnabled={false} // so ScrollView handles the scroll
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginHorizontal: 12,
  },
  userText: { fontWeight: "bold" },
  userSub: { color: "#555", fontSize: 12 },

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
  usersButton: {
    backgroundColor: "#5a2c2c",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#8A0000",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5a2c2c",
    textDecorationLine: "underline",
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
    top: 0,
    left: 20,
    zIndex: 10,
  },
});
