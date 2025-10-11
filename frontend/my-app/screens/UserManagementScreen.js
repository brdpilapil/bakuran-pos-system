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
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../api";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { confirm } from "../components/Confirm";
import globalStyles from "../static/css/GlobalStyles";

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

  const [modalVisible, setModalVisible] = useState(false);

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

  async function toggleBlock(id, username, isBlocked) {
    const action = isBlocked ? "Unblock" : "Block";

    confirm(action, username, async () => {
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
        Alert.alert("Error", `Failed to ${action.toLowerCase()} user`);
      }
    });
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
          onPress={() => {
            startEdit(item);
            setModalVisible(true);
          }}
        >
          <Text style={globalStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
        {item.role !== "owner" && (
          <TouchableOpacity
            style={styles.usersButton}
            onPress={() => toggleBlock(item.id, item.username, item.is_blocked)}
          >
            <Text style={globalStyles.buttonText}>
              {item.is_blocked ? "Unblock" : "Block"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView>
      <Header headerText="User Management" />
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={globalStyles.backButton}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons
          name="add"
          size={28}
          color="#fff"
          style={globalStyles.addButton}
        />
      </TouchableOpacity>

      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Manage Users</Text>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {mode === "create" ? "Add User" : "Edit User"}
            </Text>

            <TextInput
              placeholder="First Name"
              value={form.first_name}
              onChangeText={(t) => setForm({ ...form, first_name: t })}
              style={globalStyles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={form.last_name}
              onChangeText={(t) => setForm({ ...form, last_name: t })}
              style={globalStyles.input}
            />
            <TextInput
              placeholder="Username"
              value={form.username}
              onChangeText={(t) => setForm({ ...form, username: t })}
              style={globalStyles.input}
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              style={globalStyles.input}
            />
            <TextInput
              placeholder="Contact Number"
              value={form.contact_number}
              onChangeText={(t) => setForm({ ...form, contact_number: t })}
              style={globalStyles.input}
            />
            <TextInput
              placeholder="Password"
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
              secureTextEntry
              style={globalStyles.input}
            />

            <Text style={{ fontWeight: "bold" }}>Role</Text>
            <View style={globalStyles.input}>
              <Picker
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

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={mode === "create" ? createUser : updateUser}
              >
                <Text style={styles.modalButtonText}>
                  {mode === "create" ? "Save" : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Users list */}
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUserItem}
        scrollEnabled={false}
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
  userText: {
    fontWeight: "bold",
  },
  userSub: {
    color: "#555",
    fontSize: 12,
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

  //modal

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 2,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#5a2c2c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#5a2c2c",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});
