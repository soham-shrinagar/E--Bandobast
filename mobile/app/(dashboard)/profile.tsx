import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

const profile = () => {
  const { user, logout } = useAuth();
  const currentPhone = user?.phoneNumber;

  const handleLogout = async () => {
    await logout();
    router.replace("/"); // redirect to landing page after logout
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{currentPhone || "N/A"}</Text>
      </View>
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});