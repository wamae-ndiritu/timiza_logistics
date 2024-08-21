import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const DestinationSearchScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Choose your Location</Text>
        <GooglePlacesAutocomplete
          placeholder='Destination'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            // Navigate back with the selected location
            router.push({
              pathname: "/",
              params: { destination: JSON.stringify(details) },
            });
          }}
          query={{
            key: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
            language: "en",
          }}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              flexDirection: "row",
            },
            textInput: {
              flex: 1,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
            },
            predefinedPlacesDescription: {
              color: "#1faadb",
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default DestinationSearchScreen;
