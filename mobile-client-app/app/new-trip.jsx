import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { StatusBar } from "expo-status-bar";

const driversList = [
  { id: 1, name: "Driver 1" },
  { id: 2, name: "Driver 2" },
  { id: 3, name: "Driver 3" },
];

const loadersList = [
  { id: 1, name: "Loader 1" },
  { id: 2, name: "Loader 2" },
  { id: 3, name: "Loader 3" },
];

const NewTrip = () => {
  const navigation = useNavigation();
  const [startPoint, setStartPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedLoaders, setSelectedLoaders] = useState([]);

  const handleLoaderSelection = (loader) => {
    if (selectedLoaders.includes(loader.id)) {
      setSelectedLoaders(selectedLoaders.filter((id) => id !== loader.id));
    } else {
      setSelectedLoaders([...selectedLoaders, loader.id]);
    }
  };

  const handleSubmit = () => {
    if (
      startPoint &&
      destination &&
      selectedDriver &&
      selectedLoaders.length > 0
    ) {
      // Submit logic here
      console.log("Trip Details:", {
        startPoint,
        destination,
        selectedDriver,
        selectedLoaders,
      });
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={24} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Trip</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Starting Point'
          value={startPoint}
          onChangeText={setStartPoint}
        />
        <TextInput
          style={styles.input}
          placeholder='Destination'
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Select Driver</Text>
        <FlatList
          data={driversList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.selectionItem,
                selectedDriver === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelectedDriver(item.id)}
            >
              <Text style={styles.selectionItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Select Loaders</Text>
        <FlatList
          data={loadersList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.selectionItem,
                selectedLoaders.includes(item.id) && styles.selectedItem,
              ]}
              onPress={() => handleLoaderSelection(item)}
            >
              <Text style={styles.selectionItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2A7353",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectionContainer: {
    padding: 16,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectionItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "#2A7353",
  },
  selectionItemText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#2A7353",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewTrip;
