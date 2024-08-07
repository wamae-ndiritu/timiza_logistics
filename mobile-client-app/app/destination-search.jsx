import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRouter } from "expo-router";

const DestinationSearchScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your route</Text>
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
          key: "YOUR_GOOGLE_API_KEY",
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
