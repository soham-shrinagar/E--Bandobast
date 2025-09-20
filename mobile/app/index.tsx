import { Link } from "expo-router";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//@ts-ignore
import GoaPolice from "../assets/GoaPoliceEmblem.png";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#d9f7eb", // green-100 equivalent
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
      }}
    >
      {/* Logo */}
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: "#e5e7eb", // gray-200
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Image
          source={GoaPolice}
          style={{ width: 72, height: 96, resizeMode: "contain" }}
        />
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#065f46", // green-800
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Personnel Deployment Tool
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "500",
          color: "#d97706", // yellow-600
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Goa Police Department
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 16,
          color: "#047857", // green-700
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 22,
        }}
      >
        Streamlined resource management and personnel allocation system for
        efficient police operations across Goa.
      </Text>

      {/* Links */}
      <View style={{ width: "100%", alignItems: "center" }}>
        <Link
          href="/login"
          style={{
            width: "100%",
            paddingVertical: 14,
            paddingHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            marginBottom: 12,
            textAlign: "center",
            color: "#065f46",
            fontWeight: "bold",
            fontSize: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
          }}
        >
          Login
        </Link>

        <Link
          href="/register"
          style={{
            width: "100%",
            paddingVertical: 14,
            paddingHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            marginBottom: 12,
            textAlign: "center",
            color: "#065f46",
            fontWeight: "bold",
            fontSize: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
          }}
        >
          Register
        </Link>

        <Link
          href="/deployment"
          style={{
            width: "100%",
            paddingVertical: 14,
            paddingHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            textAlign: "center",
            color: "#065f46",
            fontWeight: "bold",
            fontSize: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
          }}
        >
          Dashboard
        </Link>
      </View>

      {/* Footer */}
      <View style={{ position: "absolute", bottom: 16 }}>
        <Text style={{ fontSize: 12, color: "#065f46", textAlign: "center" }}>
          Government of Goa • Police Department
        </Text>
      </View>
    </SafeAreaView>
  );
}
