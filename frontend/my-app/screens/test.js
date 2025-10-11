import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { BASE_URL } from "../api";

export default function InventoryScreen({ navigation }) {
  const API_BASE = ${BASE_URL}/inventory;

  const [transactions, setTransactions] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [store, setStore] = useState("");
  const [note, setNote] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchTransactions();
    fetchIngredients();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get(${API_BASE}/transactions/);
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res = await api.get(${BASE_URL}/inventory/ingredients/);
      setIngredients(res.data);
    } catch (err) {
      console.error(
        "Fetch ingredients error:",
        err.response?.data || err.message
      );
    }
  };

  const addTransaction = async () => {
    if (!selectedIngredient || !transactionType || !quantity) {
      setModalType("error");
      setModalMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        ${API_BASE}/transactions/,
        {
          ingredient_id: selectedIngredient,
          transaction_type: transactionType,
          quantity: quantity,
          cost: cost || 0,
          store: store || "",
          note: note,
        },
        { headers: { Authorization: Bearer ${token} } }
      );

      setSelectedIngredient("");
      setQuantity("");
      setCost("");
      setStore("");
      setNote("");
      setTransactionType("");
      fetchTransactions();
      fetchIngredients();
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
      setModalType("error");
      if (err.response?.data?.detail) {
        setModalMessage(err.response.data.detail);
      } else {
        setModalMessage("Failed to add transaction");
      }
      setModalVisible(true);
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
      const res = await api.post(${API_BASE}/ingredients/, { name, unit });
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

  return (
    <ScrollView style={styles.body}>
      {/* Transaction Form Card */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#5a2c2c" />
        </TouchableOpacity>

        <Text style={styles.title}>Inventory Transactions</Text>

        <Picker
          selectedValue={selectedIngredient}
          onValueChange={(val) => setSelectedIngredient(val)}
          style={styles.Picker}
        >
          <Picker.Item label="-- Select Ingredient --" value="" />
          {ingredients.map((ingredient) => (
            <Picker.Item
              key={ingredient.id}
              label={`${ingredient.name} (${ingredient.unit})`}
              value={ingredient.id}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={transactionType}
          onValueChange={(val) => setTransactionType(val)}
          style={styles.Picker}
        >
          <Picker.Item label="-- Select Transaction Type --" value="" />
          <Picker.Item label="Stock In (Purchase)" value="IN" />
          <Picker.Item label="Stock Out (Usage)" value="OUT" />
          <Picker.Item label="Adjustment" value="ADJ" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cost"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
          editable={transactionType === "IN"}
        />
        <TextInput
          style={styles.input}
          placeholder="Store"
          value={store}
          onChangeText={setStore}
          editable={transactionType === "IN"}
        />
        <TextInput
          style={styles.input}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          style={[
            styles.button,
            !(selectedIngredient && transactionType && quantity) &&
              styles.buttonDisabled,
          ]}
          disabled={!selectedIngredient || !transactionType || !quantity}
          onPress={addTransaction}
        >
          <Text style={styles.buttonText}>+ Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Stock History */}
      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.subtitle}>Stock History</Text>
          <TouchableOpacity
            onPress={() =>
              setVisibleCount(visibleCount === 5 ? transactions.length : 5)
            }
          >
            <Text style={styles.toggleText}>
              {visibleCount === 5 ? "Expand" : "Collapse"}
            </Text>
          </TouchableOpacity>
        </View>

        {transactions.slice(0, visibleCount).map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <Text style={styles.transactionText}>
              <Text style={{ fontWeight: "bold" }}>{item.ingredient.name}</Text>{" "}
              ({item.ingredient.unit}) →{" "}
              <Text style={{ color: "#2a7" }}>{item.transaction_type}</Text>{" "}
              {item.quantity}
            </Text>
            {item.cost ? <Text style={styles.note}>₱{Number(item.cost).toFixed(2)}</Text> : null}
            {item.store ? <Text style={styles.note}>{item.store}</Text> : null}
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          </View>
        ))}
      </View>

      {/* Add Ingredient */}
      <View style={styles.footer}>
        <Text style={styles.subtitle}>Add New Ingredient</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingredient Name"
          value={name}
          onChangeText={(text) =>
            setName(text.charAt(0).toUpperCase() + text.slice(1))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Unit (e.g., kg, L, pcs)"
          value={unit}
          onChangeText={setUnit}
        />
        <TouchableOpacity
          style={[styles.button, !(name && unit) && styles.buttonDisabled]}
          disabled={!name || !unit}
          onPress={addIngredient}
        >
          <Text style={styles.buttonText}>+ Save Ingredient</Text>
        </TouchableOpacity>

        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Current Stock Totals
        </Text>
        {ingredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.stockItem}>
            <Ionicons name="cube-outline" size={18} color="#555" />
            <Text style={styles.stockText}>
              {ingredient.name}: {ingredient.quantity} {ingredient.unit}
            </Text>
          </View>
        ))}
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modalType === "error"
                ? { borderColor: "#e74c3c" }
                : { borderColor: "#2ecc71" },
            ]}
          >
            <Ionicons
              name={modalType === "error" ? "close-circle" : "checkmark-circle"}
              size={48}
              color={modalType === "error" ? "#e74c3c" : "#2ecc71"}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    padding: 15,
    paddingTop: 40,
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  Picker: {
    borderWidth: 1,
    borderColor: "#c5c5c5ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
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
  transactionCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  transactionText: { fontSize: 15, color: "#333" },
  note: { fontStyle: "italic", color: "#777", marginTop: 4 },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 60,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  stockItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  stockText: { marginLeft: 8, fontSize: 15, color: "#333" },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  modalOverlay: {
    flex: 1,
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
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleText: {
    color: "#5a2c2c",
    fontWeight: "bold",
    fontSize: 16,
  },
});