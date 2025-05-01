import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

type TabParamList = {
  Home: undefined;
  Maps: undefined;
  Favorites: undefined;
  Chatbot: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Welcome to PoolPocket 🎱</Text>
        <Text style={styles.subtitle}>
          Find a place to play billiards in seconds!
        </Text>

        <View style={styles.quickLinksContainer}>
          <TouchableOpacity
            style={styles.quickLinkButton}
            onPress={() => navigation.navigate("Maps")}
          >
            <Text style={styles.quickLinkText}>Find a Table!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickLinkButton}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Text style={styles.quickLinkText}>My Favorites!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickLinkButton}
            onPress={() => navigation.navigate("Chatbot")}
          >
            <Text style={styles.quickLinkText}>Chat with PoolAI!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickLinkButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.quickLinkText}>My Profile!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 16,
    color: "#555",
    textAlign: "center",
  },
  quickLinksContainer: {
    marginTop: 30,
    width: "100%",
    maxWidth: 400,
  },
  quickLinkButton: {
    backgroundColor: "#006F44",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickLinkText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Home;
