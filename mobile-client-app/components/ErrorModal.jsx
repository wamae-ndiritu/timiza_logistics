import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import icons from "../constants/icons";

const ErrorModal = ({ visible, onClose, description }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Image source={icons.error} className="h-18 w-18" resizeMode="contain" />
        {/* <View style={styles.container}>
          <Text style={styles.errorText}>Error</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D9534F", // Red color for error
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#F8981D", // Orange color
    borderRadius: 5,
    marginRight: 10,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#2A7353", // Green color
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ErrorModal;
