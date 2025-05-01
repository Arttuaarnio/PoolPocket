import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../configuration/firebaseConfig";
import useCurrentUser from "../configuration/useCurrentUser";
import Icon from "react-native-vector-icons/Ionicons";

const Favorites = ({ navigation }) => {
  const { userId } = useCurrentUser();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favoritesRef = ref(database, `users/${userId}/favorites`);
    const unsubscribe = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const favoritesList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFavorites(favoritesList);
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const deleteFavorite = (favoriteId) => {
    const favoriteRef = ref(
      database,
      `users/${userId}/favorites/${favoriteId}`
    );
    remove(favoriteRef)
      .then(() => {
        Alert.alert("Success!", "Favorite Deleted!");
      })
      .catch(() => {
        Alert.alert("Error", "Failed to delete. Please try again.");
      });
  };

  const handleFavoriteClick = (favorite) => {
    navigation.navigate("Maps", {
      favorite: favorite,
    });
  };

  const confirmDelete = (favoriteId, favoriteName) => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete ${favoriteName} from your favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteFavorite(favoriteId),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.favoriteContainer}>
      <TouchableOpacity
        onPress={() => handleFavoriteClick(item)}
        style={styles.favoriteInfo}
      >
        <Text style={styles.favoriteName}>{item.name}</Text>
        <Text style={styles.favoriteAddress}>{item.address}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id, item.name)}
      >
        <Icon name="trash-bin" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 74,
    paddingHorizontal: 20,
    
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  favoriteAddress: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
