import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const database = getDatabase();

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password needs to be at least 8 characters long!";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password needs to contain at least one uppercase letter!";
    }
    if (!/[0-9]/.test(password)) {
      return "Password needs to contain at least one number!";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password needs to contain at least one special character!";
    }
    return "";
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(validatePassword(text));
  };

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Fill all fields!");
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      Alert.alert("Error", passwordValidationError);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // save user data to database
      await set(ref(database, `users/${user.uid}`), {
        username: username,
        email: email,
        
      });

      setEmail("");
      setPassword("");
      setUsername("");
      setPasswordError("");
      Alert.alert("Registering succesful!");

      // Navigoidaan login-näkymään
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      Alert.alert("Registering failed!", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          editable={!loading}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <Text style={styles.passwordHint}>
          Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.
        </Text>
        <Button
          title={loading ? "Registering" : "Register"}
          onPress={handleRegister}
          disabled={loading}
        />
        <Text
          style={styles.link}
          onPress={() => navigation && navigation.navigate("Login")}
        >
          Already have an account? Log in here
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    width: 300,
  },
  passwordHint: {
    fontSize: 12,
    color: "gray",
    marginBottom: 15,
    textAlign: "center",
    width: 300,
  },
  link: {
    marginTop: 20,
    color: "blue",
  },
});
