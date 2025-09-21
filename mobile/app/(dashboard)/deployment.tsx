import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
//@ts-ignore
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Circle, Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";

const deployment = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href={"/login"} />;
  }
  const [coords, setCoords] = useState(null); // { latitude, longitude, accuracy }
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const subRef = useRef(null);

  // const [deploymentInfo, setDeploymentInfo] = useState<any>(null);
  // const [geofence, setGeofence] = useState<any>(null);
  // // --- Fetch deployment info ---
  // useEffect(() => {
  //   if (!user?.phoneNumber) return;

  //   const fetchDeploymentInfo = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://10.172.118.106:3000/api/deployment/${user.phoneNumber}`
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch deployment info");
  //       const data = await res.json();
  //       setDeploymentInfo(data);

  //       // If user is deployed, fetch geofence
  //       if (data.deployed && data.geofenceId) {
  //         const geoRes = await fetch(
  //           `http://10.172.118.106:3000/api/geofence/${user.phoneNumber}`
  //         );
  //         if (!geoRes.ok) throw new Error("Failed to fetch geofence");
  //         const geoData = await geoRes.json();
  //         setGeofence(geoData);
  //       }
  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err.message);
  //     }
  //   };

  //   fetchDeploymentInfo();
  // }, [user?.phoneNumber]);

  useEffect(() => {
    let mounted = true;

    async function sendCoordsToBackend(latitude: number, longitude: number) {
      if (!user) return;

      try {
        await fetch("http://10.172.118.106:3000/api/updateCoords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: user.phoneNumber,
            coords: { lat: latitude, long: longitude },
          }),
        });
      } catch (err) {
        console.error("Failed to send coords:", err);
      }
    }

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // UI to prompt location access again
          //@ts-ignore
          setError("Location permission denied");
          return;
        }

        // One-time current location
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        if (!mounted) return;
        //@ts-ignore
        setCoords(current.coords);

        // Center map on current location
        //@ts-ignore
        mapRef.current?.animateToRegion(
          {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );

        // Start live updates (foreground)
        //@ts-ignore
        subRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (position) => {
            if (!mounted) return;
            //@ts-ignore
            setCoords(position.coords);

            // send to backend
            sendCoordsToBackend(
              position.coords.latitude,
              position.coords.longitude
            );
          }
        );
      } catch (e) {
        //@ts-ignore
        setError(e.message || "Failed to get location");
      }
    })();

    return () => {
      mounted = false;
      //@ts-ignore
      if (subRef.current && typeof subRef.current.remove === "function") {
        //@ts-ignore
        subRef.current.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          flex: 0.25,
          padding: 16,
          justifyContent: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Deployment
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Pressable
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#007bff",
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}
          >
            <Text>Start Shift</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#007bff",
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}
          >
            <Text>End Shift</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 0.75,
          marginHorizontal: 12,
          marginBottom: 8,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <MapView
        //@ts-ignore
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            //@ts-ignore
            latitude: coords.latitude,
            //@ts-ignore
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false} // we draw our own marker
          showsMyLocationButton={true}
        >
          <Marker
            coordinate={{
              //@ts-ignore
              latitude: coords.latitude,
              //@ts-ignore
              longitude: coords.longitude,
            }}
            title="You"
          />
          <Circle
            //@ts-ignore
            center={{ latitude: coords.latitude, longitude: coords.longitude }}
            //@ts-ignore
            radius={coords.accuracy || 25}
          />

          {/* Geofence if deployed
        {deploymentInfo.deployed && geofence && geofence.type === "circle" && (
          <Circle
            center={{ latitude: geofence.center_lat, longitude: geofence.center_long }}
            radius={geofence.radius || 100}
            strokeColor="red"
            fillColor="rgba(255,0,0,0.3)"
          />
        )}
        {deploymentInfo.deployed && geofence && geofence.type === "polygon" && (
          <Polygon
            coordinates={geofence.polygon.map((p: any) => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor="red"
            fillColor="rgba(255,0,0,0.3)"
          />
        )} */}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

export default deployment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
