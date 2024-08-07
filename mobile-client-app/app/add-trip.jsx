import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const TrackTrip = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [destination, setDestination] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [loaders, setLoaders] = useState(null);

  // Get the driver's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setIsLoading(false);
    })();
  }, []);

  // Start tracking the driver's movement
  useEffect(() => {
    let locationSubscription;
    if (tripId) {
      locationSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 100,
        },
        async (loc) => {
          setLocation(loc);
          await axios.patch(`http://your-server-url/trips/${tripId}/location`, {
            currentLocation: {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            },
          });
        }
      );
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [tripId]);

  const handleMapPress = (e) => {
    setDestination(e.nativeEvent.coordinate);
  };

  const handleStartTrip = async () => {
    if (location && destination && driver && loaders) {
      try {
        const response = await axios.post("http://your-server-url/trips", {
          driverId: driver, // replace with actual driver ID
          loaders: loaders, // replace with actual loaders IDs
          startLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          destination: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
          currentLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
        setTripId(response.data._id);
      } catch (error) {
        console.error("Error starting trip:", error);
      }
    } else {
      alert("Please fill all the fields.");
    }
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <SafeAreaView className='h-[100vh]'>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <MapView
              // style={styles.map}
              className='h-[60vh]'
              onPress={handleMapPress}
              initialRegion={{
                latitude: location ? location.coords.latitude : 37.78825,
                longitude: location ? location.coords.longitude : -122.4324,
                latitudeDelta: 0.005, // Zoomed in more to show nearby places
                longitudeDelta: 0.005,
              }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              showsMyLocationButton
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title='Current Location'
                />
              )}
              {destination && (
                <Marker coordinate={destination} title='Destination' />
              )}
            </MapView>
            <ScrollView style={styles.form}>
              <Text style={styles.text}>Current Location: {text}</Text>
              <Text style={styles.label}>Set Destination</Text>
              <TextInput
                style={styles.input}
                placeholder='Tap on the map to set destination'
                value={
                  destination
                    ? `Latitude: ${destination.latitude}, Longitude: ${destination.longitude}`
                    : ""
                }
                editable={false}
              />
              <Text style={styles.label}>Select Driver</Text>
              <RNPickerSelect
                onValueChange={(value) => setDriver(value)}
                items={[
                  { label: "Driver 1", value: "driver1" },
                  { label: "Driver 2", value: "driver2" },
                ]}
              />
              <Text style={styles.label}>Select Loaders</Text>
              <RNPickerSelect
                onValueChange={(value) => setLoaders(value)}
                items={[
                  { label: "Loader 1", value: "loader1" },
                  { label: "Loader 2", value: "loader2" },
                ]}
              />
              <Button title='Start Trip' onPress={handleStartTrip} />
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  form: {
    padding: 10,
    backgroundColor: "white",
  },
  text: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default TrackTrip;
