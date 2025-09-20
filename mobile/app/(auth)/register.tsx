import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      const response = await fetch("http://10.172.118.106:3000/api/mobileRegistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:", data);
        // navigate to dashboard
      } else {
        console.log("Registration failed:", data.message || data);
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f2f2f2",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>
        Register Page
      </Text>

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        style={styles.textinput}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        style={styles.textinput}
      />

      <Pressable onPress={handleSubmit} style={[styles.btn, { backgroundColor: "#28a745" }]}>
        <Text style={{ color: "#fff" }}>Press to Register</Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          marginTop: 8,
        }}
      >
        <Link
          href="/login"
          style={{
            color: "#333",
            textDecorationLine: "underline",
            fontWeight: "500",
            fontSize: 14,
          }}
        >
          Login instead
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  textinput: {
    width: "100%",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  btn: {
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
});
