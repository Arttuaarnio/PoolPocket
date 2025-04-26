import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PoolHelperAI = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This screen will be utilizing the PoolHelperAI component
      </Text>
    </View>
  );
};

export default PoolHelperAI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
