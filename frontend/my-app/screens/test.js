import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, TextInput, FlatList, Modal } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";

const Stack = createStackNavigator();

// ---------- FRAME 1 ----------
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Inventory</Text>
      <TouchableOpacity
        style={{ backgroundColor: "#5c2121", padding: 15, borderRadius: 10, marginBottom: 15 }}
        onPress={() => navigation.navigate("RawMaterials")}
      >
        <Text style={{ color: "#fff" }}>Raw Materials</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: "#5c2121", padding: 15, borderRadius: 10 }}
        onPress={() => navigation.navigate("Transactions")}
      >
        <Text style={{ color: "#fff" }}>Transactions</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- FRAME 2 ----------
function RawMaterials({ navigation }) {
  const [materials, setMaterials] = useState([
    { id: "1", name: "Beef", qty: 10 },
    { id: "2", name: "Garlic", qty: 5 },
  ]);

  const deleteItem = (id) => {
    setMaterials(materials.filter((item) => item.id !== id));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {materials.map((item) => (
        <View
          key={item.id}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
        >
          <Text>Name: {item.name}</Text>
          <Text>Quantity: {item.qty}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "red", padding: 8, marginTop: 5, borderRadius: 5 }}
            onPress={() => deleteItem(item.id)}
          >
            <Text style={{ color: "#fff" }}>DELETE</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// ---------- FRAME 3 ----------
function Transactions({ navigation }) {
  const [category, setCategory] = useState("All");
  const [data] = useState([
    { id: "1", name: "Beef", category: "Meat" },
    { id: "2", name: "Garlic", category: "Spices" },
  ]);

  const filtered = category === "All" ? data : data.filter((d) => d.category === category);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Picker selectedValue={category} onValueChange={(item) => setCategory(item)}>
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Meat" value="Meat" />
        <Picker.Item label="Spices" value="Spices" />
        <Picker.Item label="Vegetables" value="Vegetables" />
      </Picker>

      {filtered.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text>{item.name}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#5c2121", padding: 8, borderRadius: 5 }}
            onPress={() => navigation.navigate("TransactionDetails", { ingredient: item })}
          >
            <Text style={{ color: "#fff" }}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "#5c2121",
          padding: 15,
          borderRadius: 30,
        }}
        onPress={() => navigation.navigate("NewTransaction")}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- FRAME 4 ----------
function NewTransaction({ navigation }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [ingredient, setIngredient] = useState("Add new ingredient...");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>New Transaction</Text>

          <Picker selectedValue={ingredient} onValueChange={(val) => setIngredient(val)}>
            <Picker.Item label="Add new ingredient.." value="new" />
            <Picker.Item label="Beef" value="Beef" />
            <Picker.Item label="Garlic" value="Garlic" />
            <Picker.Item label="Onion" value="Onion" />
          </Picker>

          {ingredient === "new" && (
            <TextInput placeholder="Type new ingredient" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
          )}

          <TextInput
            placeholder="Quantity"
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
            <Picker.Item label="pc/s" value="pcs" />
            <Picker.Item label="kg/s" value="kg" />
            <Picker.Item label="sack/s" value="sack" />
            <Picker.Item label="pack/s" value="pack" />
          </Picker>

          <TextInput
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <TextInput
            placeholder="Store"
            value={store}
            onChangeText={setStore}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button title="Save" onPress={() => { setModalVisible(false); navigation.goBack(); }} />
            <Button title="Cancel" color="red" onPress={() => { setModalVisible(false); navigation.goBack(); }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ---------- FRAME 5 ----------
function TransactionDetails({ route }) {
  const { ingredient } = route.params;
  const transactions = [
    { id: "1", type: "IN", date: "09/18/2025", qty: "2 kg", price: "₱350", store: "Store A" },
    { id: "2", type: "OUT", date: "09/18/2025", qty: "1 kg" },
    { id: "3", type: "IN", date: "09/18/2025", qty: "3 kg", price: "₱500", store: "Store B" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 15 }}>{ingredient.name}</Text>
      {transactions.map((t) => (
        <View key={t.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text>{t.type}</Text>
          <Text>
            {t.date} - {t.qty} {t.price ?  - ${t.price} : ""} {t.store ?  - ${t.store} : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ---------- MAIN APP ----------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RawMaterials" component={RawMaterials} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="NewTransaction" component={NewTransaction} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
Mica Julianna
import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, TextInput, FlatList, Modal, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";

const Stack = createStackNavigator();
const logo = require("./assets/logo.png"); // <-- your logo here

// Header with logo
function Header() {
  return (
    <View style={{ alignItems: "center", marginVertical: 15 }}>
      <Image source={logo} style={{ width: 100, height: 100, resizeMode: "contain" }} />
    </View>
  );
}

// ---------- FRAME 1 ----------
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Header />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Inventory</Text>
      <TouchableOpacity
        style={{ backgroundColor: "#5c2121", padding: 15, borderRadius: 10, marginBottom: 15 }}
        onPress={() => navigation.navigate("RawMaterials")}
      >
        <Text style={{ color: "#fff" }}>Raw Materials</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: "#5c2121", padding: 15, borderRadius: 10 }}
        onPress={() => navigation.navigate("Transactions")}
      >
        <Text style={{ color: "#fff" }}>Transactions</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- FRAME 2 ----------
function RawMaterials({ navigation }) {
  const [materials, setMaterials] = useState([
    { id: "1", name: "Beef", qty: 10 },
    { id: "2", name: "Garlic", qty: 5 },
  ]);

  const deleteItem = (id) => {
    setMaterials(materials.filter((item) => item.id !== id));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Header />
      {materials.map((item) => (
        <View
          key={item.id}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
        >
          <Text>Name: {item.name}</Text>
          <Text>Quantity: {item.qty}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "red", padding: 8, marginTop: 5, borderRadius: 5 }}
            onPress={() => deleteItem(item.id)}
          >
            <Text style={{ color: "#fff" }}>DELETE</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// ---------- FRAME 3 ----------
function Transactions({ navigation }) {
  const [category, setCategory] = useState("All");
  const [data] = useState([
    { id: "1", name: "Beef", category: "Meat" },
    { id: "2", name: "Garlic", category: "Spices" },
  ]);

  const filtered = category === "All" ? data : data.filter((d) => d.category === category);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Header />
      <Picker selectedValue={category} onValueChange={(item) => setCategory(item)}>
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Meat" value="Meat" />
        <Picker.Item label="Spices" value="Spices" />
        <Picker.Item label="Vegetables" value="Vegetables" />
      </Picker>

      {filtered.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text>{item.name}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#5c2121", padding: 8, borderRadius: 5 }}
            onPress={() => navigation.navigate("TransactionDetails", { ingredient: item })}
          >
            <Text style={{ color: "#fff" }}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "#5c2121",
          padding: 15,
          borderRadius: 30,
        }}
        onPress={() => navigation.navigate("NewTransaction")}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- FRAME 4 ----------
function NewTransaction({ navigation }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [ingredient, setIngredient] = useState("Add new ingredient...");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
          <Header />
          <Text style={{ fontSize: 18, marginBottom: 10 }}>New Transaction</Text>

          <Picker selectedValue={ingredient} onValueChange={(val) => setIngredient(val)}>
            <Picker.Item label="Add new ingredient.." value="new" />
            <Picker.Item label="Beef" value="Beef" />
            <Picker.Item label="Garlic" value="Garlic" />
            <Picker.Item label="Onion" value="Onion" />
          </Picker>

          {ingredient === "new" && (
            <TextInput placeholder="Type new ingredient" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
          )}

          <TextInput
            placeholder="Quantity"
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
            <Picker.Item label="pc/s" value="pcs" />
            <Picker.Item label="kg/s" value="kg" />
            <Picker.Item label="sack/s" value="sack" />
            <Picker.Item label="pack/s" value="pack" />
          </Picker>

          <TextInput
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <TextInput
            placeholder="Store"
            value={store}
            onChangeText={setStore}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button title="Save" onPress={() => { setModalVisible(false); navigation.goBack(); }} />
            <Button title="Cancel" color="red" onPress={() => { setModalVisible(false); navigation.goBack(); }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ---------- FRAME 5 ----------
function TransactionDetails({ route }) {
  const { ingredient } = route.params;
  const transactions = [
    { id: "1", type: "IN", date: "09/18/2025", qty: "2 kg", price: "₱350", store: "Store A" },
    { id: "2", type: "OUT", date: "09/18/2025", qty: "1 kg" },
    { id: "3", type: "IN", date: "09/18/2025", qty: "3 kg", price: "₱500", store: "Store B" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Header />
      <Text style={{ fontSize: 22, marginBottom: 15 }}>{ingredient.name}</Text>
      {transactions.map((t) => (
        <View key={t.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text>{t.type}</Text>
          <Text>
            {t.date} - {t.qty} {t.price ?  - ${t.price} : ""} {t.store ?  - ${t.store} : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ---------- MAIN APP ----------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RawMaterials" component={RawMaterials} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="NewTransaction" component={NewTransaction} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
