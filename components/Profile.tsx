import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { auth, database } from "../configuration/firebaseConfig";
import { ref, set, remove, get } from "firebase/database";
import {
  updatePassword,
  deleteUser,
  signOut,
  updateProfile,
} from "firebase/auth";
import useCurrentUser from "../configuration/useCurrentUser";

const Profile = ({ handleLogout }) => {
  const { user, userId, loading } = useCurrentUser();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userRef = ref(database, `users/${userId}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserInfo({
              username: userData.displayName || "",
              email: userData.email || "",
            });
          } else if (user) {
            setUserInfo({
              username: user.displayName || "",
              email: user.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not fetch profile data");
        }
      } else if (user) {
        setUserInfo({
          username: user.displayName || "",
          email: user.email || "",
        });
      }
    };

    fetchUserData();
  }, [userId, user]);

  const handleSave = async () => {
    if (!userId) return;
    setSavingProfile(true);

    try {
      await updateProfile(auth.currentUser, {
        displayName: userInfo.username,
      });

      await set(ref(database, `users/${userId}`), {
        displayName: userInfo.username,
        email: userInfo.email,
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", `Could not save profile: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password needs to be at least 8 characters long!");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password needs to contain at least one uppercase letter!"
      );
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      Alert.alert("Error", "Password needs to contain at least one number!");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password needs to contain at least one special character!"
      );
      return;
    }

    setChangingPassword(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Error", `Could not change password: ${error.message}`);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Are you sure?",
      "Deleting your account is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (userId) {
                await remove(ref(database, `users/${userId}`));
              }
              await deleteUser(auth.currentUser);
              Alert.alert("Success", "Account deleted successfully!");
            } catch (error) {
              Alert.alert(
                "Error",
                `Could not delete account: ${error.message}`
              );
            }
          },
        },
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "default",
        onPress: handleLogoutUser,
      },
    ]);
  };

  const handleLogoutUser = async () => {
    try {
      await signOut(auth);
      if (handleLogout) handleLogout();
    } catch (error) {
      Alert.alert("Error", `Could not log out: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006F44" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No user found. Please log in.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={userInfo.username}
                onChangeText={(text) =>
                  setUserInfo((prev) => ({ ...prev, username: text }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Email"
                placeholderTextColor="#888"
                value={userInfo.email}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSave}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <View style={styles.buttonLoadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.buttonText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#888"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <Text style={styles.passwordHint}>
              Password must be at least 8 characters long, contain an uppercase
              letter, a number, and a special character.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePasswordChange}
              disabled={changingPassword}
            >
              {changingPassword ? (
                <View style={styles.buttonLoadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.buttonText}>Changing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Actions</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={confirmLogout}
            >
              <Text style={styles.secondaryButtonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#555",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledInput: {
    backgroundColor: "#EEEEEE",
    color: "#888",
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#006F44",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: "#E0F5E0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#C0E0C0",
  },
  dangerButton: {
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#006F44",
    fontWeight: "bold",
    fontSize: 16,
  },
  dangerButtonText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
