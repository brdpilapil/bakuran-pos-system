import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function EmployeeSettings({ token, logout }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const API_URL = "http://<your-backend-domain-or-localhost>/api"; // ⚠️ update this

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // Upload new profile picture or contact info
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      if (contactNumber) formData.append("contact_number", contactNumber);
      if (profilePicture) {
        const filename = profilePicture.split("/").pop();
        const type = "image/" + filename.split(".").pop();
        formData.append("profile_picture", {
          uri: profilePicture,
          name: filename,
          type,
        });
      }

      setUploading(true);
      const response = await fetch(`${API_URL}/update-profile/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      setUploading(false);

      if (response.ok) {
        Alert.alert("Success", "Profile updated!");
      } else {
        Alert.alert("Error", data.detail || "Failed to update profile");
      }
    } catch (error) {
      setUploading(false);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      const response = await fetch(`${API_URL}/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Password Updated", "Please log in again.", [
          { text: "OK", onPress: logout },
        ]);
      } else {
        Alert.alert(
          "Error",
          data.old_password?.[0] || data.new_password?.[0] || "Failed"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Settings</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: "#aaa" }}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Contact Number */}
      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={updateProfile}
        disabled={uploading}
      >
        <Text style={styles.btnText}>
          {uploading ? "Updating..." : "Save Profile"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />

      {/* Password Change */}
      <Text style={styles.sectionTitle}>Change Password</Text>
      <TextInput
        placeholder="Old Password"
        secureTextEntry
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#5a2c2c" }]}
        onPress={changePassword}
      >
        <Text style={styles.btnText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#444" }]}
        onPress={logout}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "700", marginVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  btn: {
    width: "100%",
    backgroundColor: "#8b0000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
