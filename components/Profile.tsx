import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
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
           Alert.alert("Error fetching profile data");
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

     try {
       await updateProfile(auth.currentUser, {
         displayName: userInfo.username,
       });

       await set(ref(database, `users/${userId}`), {
         displayName: userInfo.username,
         email: userInfo.email,
       });

       Alert.alert("Profile updated successfully!");
     } catch (error) {
       Alert.alert("Error saving profile", error.message);
     }
   };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Password needs to be at least 8 characters long!");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert("Password needs to contain at least one uppercase letter!");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      Alert.alert("Password needs to contain at least one number!");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      Alert.alert("Password needs to contain at least one special character!");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Password changed successfully!");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Error changing password", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
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
              Alert.alert("Account deleted successfully!");
            } catch (error) {
              Alert.alert("Error deleting account", error.message);
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
        style: "destructive",
        onPress: handleLogoutUser,
      },
    ]);
  };

  const handleLogoutUser = async () => {
    try {
      await signOut(auth);
      if (handleLogout) handleLogout();
    } catch (error) {
      Alert.alert("Error logging out", error.message);
    }
  };



  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user found. Please log in.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userInfo.username}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, username: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userInfo.email}
          editable={false}
        />

        <Button title="Save Changes" onPress={handleSave} />

        <View style={styles.divider} />

        <Text style={styles.header}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button title="Change Password" onPress={handlePasswordChange} />

        <View style={styles.divider} />

        <Button title="Logout" onPress={confirmLogout} color="#2196F3" />

        <View style={styles.divider} />

        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          color="#FF3B30"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  divider: {
    height: 20,
  },
});
