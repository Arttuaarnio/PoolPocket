import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
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
  const { favorite } = route.params || {};
  const mapRef = useRef(null);
  const favoriteMarkerRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      fetchNearbyBilliardPlaces(currentLocation.coords);
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

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>Loading map...</Text>
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
          <Callout onPress={() => saveToFavorites(place)}>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{place.name}</Text>
              <Text style={styles.calloutDescription}>{place.vicinity}</Text>
              {place.rating && (
                <Text style={styles.calloutRating}>
                  Rating: {place.rating} stars
                </Text>
              )}
              <TouchableOpacity onPress={() => saveToFavorites(place)}>
                <Text style={styles.addToFavorites}>Add to Favorites</Text>
              </TouchableOpacity>
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
          pinColor="blue"
        >
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{favorite.name}</Text>
              <Text style={styles.calloutDescription}>{favorite.address}</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutDescription: {
    fontSize: 12,
    color: "#555",
  },
  calloutRating: {
    fontSize: 12,
    color: "#f39c12",
  },
  addToFavorites: {
    color: "#2196F3",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 10,
  },
});
