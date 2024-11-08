import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../constants";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {useSelector} from "react-redux";

const NotAuthorizedScreen = () => {
  const {userData} = useSelector((state) => state.user);
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (userData?.user?.role === "admin"){
      router.replace('/home');
    } else {
     router.replace("/userhome"); 
    }
  };

  return (
    <View style={styles.container}>
      <Image source={icons.notAuthorized} style={styles.image} />
      <Text style={styles.title}>Access Denied</Text>
      <Text style={styles.message}>
        You do not have the necessary permissions to view this page.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2A7353",
    padding: 10,
    borderRadius: 5,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
};

export default NotAuthorizedScreen;
