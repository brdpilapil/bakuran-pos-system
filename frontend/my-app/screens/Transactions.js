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
import globalStyles from "../static/css/GlobalStyles";
import ModalForm from "../static/css/ModalForm";
import Header from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";

export default function InventoryScreen({ navigation }) {
  const API_BASE = `${BASE_URL}/inventory`;

  const [transactions, setTransactions] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleTransactions = transactions.slice(0, visibleCount);

  useEffect(() => {
    fetchTransactions();
    fetchIngredients();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleCollapse = () => {
    setVisibleCount(3);
  };
  const fetchTransactions = async () => {
    try {
      const res = await api.get(`${API_BASE}/transactions/`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

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
        `${API_BASE}/transactions/`,
        {
          ingredient_id: selectedIngredient,
          transaction_type: transactionType,
          quantity: quantity,
          note: note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedIngredient("");
      setQuantity("");
      setNote("");
      setTransactionType("");
      fetchTransactions();
      fetchIngredients();
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
      setModalType("error");
      // Show the DRF error message if available
      if (err.response?.data?.detail) {
        setModalMessage(err.response.data.detail);
      } else {
        setModalMessage("Failed to add transaction");
      }
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={globalStyles.body}>
      <Header headerText="Transactions" />
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      ></TouchableOpacity>
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
          setSelectedIngredient("");
          setQuantity("");
          setNote("");
          setTransactionType("");
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
        <Text style={styles.title}>Recent Transactions</Text>

        {visibleTransactions.map((item) => (
          <View key={item.id.toString()} style={styles.transactionCard}>
            <Text style={styles.transactionText}>
              <Text style={{ fontWeight: "bold" }}>{item.ingredient.name}</Text>{" "}
              ({item.ingredient.unit}) →{" "}
              <Text style={{ color: "#2a7" }}>{item.transaction_type}</Text>{" "}
              {item.quantity}
            </Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          </View>
        ))}

        {/* Buttons */}
        {visibleCount < transactions.length && (
          <TouchableOpacity onPress={handleViewMore}>
            <Text style={{ color: "blue", marginTop: 10 }}>View More</Text>
          </TouchableOpacity>
        )}

        {visibleCount > 8 && (
          <TouchableOpacity onPress={handleCollapse}>
            <Text style={{ color: "red", marginTop: 10 }}>Collapse</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={ModalForm.modalOverlay}>
          <View style={ModalForm.modalContainer}>
            <Picker
              selectedValue={selectedIngredient}
              onValueChange={(val) => setSelectedIngredient(val)}
              style={ModalForm.Picker}
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
              style={ModalForm.Picker}
            >
              <Picker.Item label="-- Select Transaction Type --" value="" />
              <Picker.Item label="Stock In (Purchase)" value="IN" />
              <Picker.Item label="Stock Out (Usage)" value="OUT" />
              <Picker.Item label="Adjustment" value="ADJ" />
            </Picker>

            <TextInput
              style={ModalForm.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <TextInput
              style={ModalForm.input}
              placeholder="Note"
              value={note}
              onChangeText={setNote}
            />

            <View style={ModalForm.modalButtonContainer}>
              <TouchableOpacity
                style={ModalForm.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={ModalForm.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  ModalForm.modalButton,
                  !(selectedIngredient && transactionType && quantity) &&
                    ModalForm.buttonDisabled,
                ]}
                disabled={!selectedIngredient || !transactionType || !quantity}
                onPress={addTransaction}
              >
                <Text style={ModalForm.buttonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* <Modal
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
      </Modal> */}
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
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
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
    width: "100%",
    minHeight: 70,
  },
  transactionText: { fontSize: 15, color: "#333" },
  note: { fontStyle: "italic", color: "#777", marginTop: 4 },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
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
});
