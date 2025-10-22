import { useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import { LocationType } from "@app/types/global";
import { Button, Card } from "react-native-paper";
import { usePermissions } from "../context/PermissionsContext";
import * as Location from "expo-location";

const INITIAL_REGION: Region = {
  latitude: -14.235,
  longitude: -51.9253,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

type Props = {
  picked: LocationType | null;
  setPicked: (location: LocationType | null) => void;
};

export default function MapSelect({ picked, setPicked }: Props) {
  const mapRef = useRef<MapView | null>(null);

  const { withLocationPermission } = usePermissions();

  function handlePress(e: MapPressEvent) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPicked({ latitude, longitude });

    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      250,
    );
  }

  function clearSelection() {
    setPicked(null);
    mapRef.current?.animateToRegion(INITIAL_REGION, 250);
  }

  function onSelectCurrentLocation() {
    withLocationPermission(async () => {
      const accuracy = Location.Accuracy.Balanced;
      const current = await Location.getCurrentPositionAsync({
        accuracy,
        mayShowUserSettingsDialog: true,
      });
      if (current.coords) setPicked(current.coords);
    });
  }

  return (
    <Card>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          onPress={handlePress}
          mapType={"standard"}
        >
          {picked && <Marker coordinate={picked} />}
        </MapView>
      </View>

      <View style={styles.panel}>
        {picked ? (
          <>
            <Text style={styles.title}>Selected location</Text>
            <Text style={styles.coords}>
              lat: {picked.latitude.toFixed(6)}
              {"\n"}
              lng: {picked.longitude.toFixed(6)}
            </Text>
            <TouchableOpacity onPress={clearSelection} style={styles.button}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.hint}>Aperte em qualquer lugar para selecionar localização</Text>
            <Button onPress={onSelectCurrentLocation}>Utilizar posição atual</Button>
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  mapContainer: { width: "100%", height: 300 },
  map: { ...StyleSheet.absoluteFillObject },
  panel: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  coords: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  hint: { fontSize: 14, textAlign: "center" },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
