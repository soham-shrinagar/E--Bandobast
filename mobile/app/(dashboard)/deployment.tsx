import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";

const deployment = () => {
  const [coords, setCoords] = useState(null); // { latitude, longitude, accuracy }
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    let mounted = true;

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
      <View style={{
      flex: 0.25,
      padding: 16,
      justifyContent: "center",
      backgroundColor: "#f8f8f8",
      }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: "bold", 
            marginBottom: 12, 
            textAlign: "center" 
          }}>Deployment</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#007bff",
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}>
              <Text>Start Shift</Text>
            </Pressable>
            <Pressable style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#007bff",
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}>
              <Text>End Shift</Text>
            </Pressable>  
          </View>
      </View>
      
      <View style={{flex: 0.75, marginHorizontal: 12, marginBottom:8, borderRadius: 10, overflow: "hidden"}}>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
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
