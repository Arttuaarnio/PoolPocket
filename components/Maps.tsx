import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_PLACES_API_KEY } from "react-native-dotenv";
import useCurrentUser from "../configuration/useCurrentUser";
import { database } from "../configuration/firebaseConfig";
import { ref, push } from "firebase/database";

const Maps = ({ route }) => {
  const { userId } = useCurrentUser();
  const [location, setLocation] = useState(null);
  const [billiardPlaces, setBilliardPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorite } = route.params || {};
  const mapRef = useRef(null);
  const favoriteMarkerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required.");
          setIsLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        await fetchNearbyBilliardPlaces(currentLocation.coords);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Failed to access your location.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (favorite && mapRef.current && favorite.location) {
      mapRef.current.animateToRegion(
        {
          latitude: favorite.location.lat,
          longitude: favorite.location.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );

      setTimeout(() => {
        if (favoriteMarkerRef.current) {
          favoriteMarkerRef.current.showCallout();
        }
      }, 1500);
    }
  }, [favorite]);

  const fetchNearbyBilliardPlaces = async (coords) => {
    try {
      let allResults = [];
      let nextPageToken = null;
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=7500&type=establishment&keyword=billiard&key=${GOOGLE_PLACES_API_KEY}`;

      do {
        const response = await fetch(
          nextPageToken ? `${url}&pagetoken=${nextPageToken}` : url
        );
        const data = await response.json();

        if (data.results) {
          allResults = [...allResults, ...data.results];
        }

        nextPageToken = data.next_page_token || null;

        if (nextPageToken) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } while (nextPageToken);

      setBilliardPlaces(allResults);
    } catch (error) {
      console.error("Error fetching places:", error);
      Alert.alert("Error", "Failed to fetch nearby billiard places.");
    }
  };

  const saveToFavorites = async (place) => {
    const favoritesRef = ref(database, `users/${userId}/favorites`);
    await push(favoritesRef, {
      name: place.name,
      address: place.vicinity,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    });

    Alert.alert("Saved!", `${place.name} was added to your favorites.`);
  };

  const getRatingColor = (rating) => {
    if (!rating) return "#888";
    if (rating < 3) return "#D32F2F";
    if (rating < 4) return "#FFC107";
    return "#006F44";
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006F44" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Unable to access location.</Text>
        <Text>Please check your device settings and try again.</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation
    >
      {billiardPlaces.map((place) => (
        <Marker
          key={place.place_id}
          coordinate={{
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }}
          title={place.name}
          description={place.vicinity}
        >
          <Callout tooltip={true} onPress={() => saveToFavorites(place)}>
            <View style={styles.calloutContainer}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text style={styles.calloutAddress}>{place.vicinity}</Text>
                {place.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Rating: </Text>
                    <Text
                      style={[
                        styles.ratingValue,
                        { color: getRatingColor(place.rating) },
                      ]}
                    >
                      {place.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
                <Text style={styles.favoriteLabel}>Add to Favorites</Text>
              </View>
              <View style={styles.calloutArrow} />
            </View>
          </Callout>
        </Marker>
      ))}
      {favorite && (
        <Marker
          ref={favoriteMarkerRef}
          coordinate={{
            latitude: favorite.location.lat,
            longitude: favorite.location.lng,
          }}
          title={favorite.name}
          description={favorite.address}
          pinColor="#006F44"
        >
          <Callout tooltip>
            <View style={styles.calloutContainer}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{favorite.name}</Text>
                <Text style={styles.calloutAddress}>{favorite.address}</Text>
                {favorite.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Rating: </Text>
                    <Text
                      style={[
                        styles.ratingValue,
                        { color: getRatingColor(favorite.rating) },
                      ]}
                    >
                      {favorite.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
                <Text style={styles.favoriteLabel}>Saved Location</Text>
              </View>
              <View style={styles.calloutArrow} />
            </View>
          </Callout>
        </Marker>
      )}
    </MapView>
  );
};

export default Maps;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginBottom: 10,
  },
  calloutContainer: {
    width: 220,
    alignItems: "center",
  },
  callout: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    alignSelf: "center",
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  calloutAddress: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 13,
    color: "#555",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  favoriteButton: {
    backgroundColor: "#E0F5E0",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C0E0C0",
    marginTop: 4,
  },
  favoriteButtonText: {
    color: "#006F44",
    fontWeight: "bold",
    fontSize: 14,
  },
  favoriteLabel: {
    color: "#006F44",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
