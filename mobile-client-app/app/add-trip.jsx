import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const TrackTrip = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [loaders, setLoaders] = useState(null);
  const route = useRoute();
  const { destination } = route.params || {};

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
          <ActivityIndicator size='large' color='#0000ff' className='my-auto' />
        ) : (
          <>
            <MapView
              className='h-[100vh]'
              initialRegion={{
                latitude: location ? location.coords.latitude : 37.78825,
                longitude: location ? location.coords.longitude : -122.4324,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
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
            <View style={styles.overlay} className="bg-white p-8">
              <TouchableOpacity
                style={styles.button}
                className="bg-secondary"
                onPress={() => router.push('/destination-search')}

              >
                <Text style={styles.buttonText}>Search Destination</Text>
              </TouchableOpacity>
            </View>
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
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
});

export default TrackTrip;
