import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { BASE_URL } from "../api";
import Header from "../components/Header";
import globalStyles from "../static/css/GlobalStyles";
import { confirm } from "../components/Confirm";

export default function RawMaterials({ navigation }) {
  const API_BASE = `${BASE_URL}/inventory`;

  const [ingredients, setIngredients] = useState([]);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [editingIngredient, setEditingIngredient] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchIngredients = async () => {
    try {
      const res = await api.get(`${BASE_URL}/inventory/ingredients/`);
      setIngredients(res.data);
    } catch (err) {
      console.error(
        "Fetch ingredients error:",
        err.response?.data || err.message
      );
    }
  };

  const addIngredient = async () => {
    if (!name || !unit) {
      setModalType("error");
      setModalMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }

    const exists = ingredients.some(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setModalType("error");
      setModalMessage("This ingredient already exists!");
      setModalVisible(true);
      return;
    }

    try {
      const res = await api.post(`${API_BASE}/ingredients/`, { name, unit });
      setModalType("success");
      setModalMessage("Ingredient added successfully!");
      setModalVisible(true);
      setName("");
      setUnit("");
      setIngredients([...ingredients, res.data]);
    } catch (err) {
      console.error("Add ingredient error:", err.response?.data || err.message);
      setModalType("error");
      setModalMessage("Failed to add ingredient");
      setModalVisible(true);
    }
  };

  const updateIngredient = async () => {
    if (!editingIngredient) return;

    try {
      const res = await api.put(
        `${API_BASE}/ingredients/${editingIngredient.id}/`,
        { name, unit }
      );
      setIngredients(
        ingredients.map((ing) =>
          ing.id === editingIngredient.id ? res.data : ing
        )
      );
      setModalVisible(false);
      setEditingIngredient(null);
      setName("");
      setUnit("");
    } catch (err) {
      console.error(
        "Update ingredient error:",
        err.response?.data || err.message
      );
    }
  };

  const deleteIngredient = async (id, name) => {
    confirm("DELETE", name, async () => {
      try {
        await api.delete(`${API_BASE}/ingredients/${id}/`);
        setIngredients(ingredients.filter((ing) => ing.id !== id));
      } catch (err) {
        console.error(
          "Delete ingredient error:",
          err.response?.data || err.message
        );
      }
    });
  };

  return (
    <View style={globalStyles.body}>
      <Header headerText="Raw Materials" />
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
          setName("");
          setUnit("");
          setEditingIngredient(null);
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

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search raw materials..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <View style={styles.gridContainer}>
        {[...ingredients]
          .filter((ingredient) =>
            ingredient.name.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((ingredient) => (
            <View key={ingredient.id} style={styles.card}>
              <Text style={styles.cardText}>{ingredient.name}</Text>
              <Text style={styles.subText}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => {
                    setName(ingredient.name);
                    setUnit(ingredient.unit);
                    setEditingIngredient(ingredient);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#5a2c2c" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    deleteIngredient(ingredient.id, ingredient.name)
                  }
                  style={{ marginLeft: 15 }}
                >
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
              {editingIngredient ? "Edit Ingredient" : "Add Ingredient"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit"
              value={unit}
              onChangeText={setUnit}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={editingIngredient ? updateIngredient : addIngredient}
              >
                <Text style={styles.modalButtonText}>
                  {editingIngredient ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "48%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    width: "100%",
  },
  button: {
    backgroundColor: "#5a2c2c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#bca4a4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    color: "#fff",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },

  // modal
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
  },
});
