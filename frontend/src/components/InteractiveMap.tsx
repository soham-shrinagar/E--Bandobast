import { useEffect, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface PersonnelMapProps {
  geofence: any | null;
}

// Child component that handles highlighting
function GeofenceHighlighter({ geofence }: { geofence: any | null }) {
  const map = useMap(); // ✅ safe here, inside MapContainer
  const [highlightLayer, setHighlightLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous highlight
    if (highlightLayer) {
      highlightLayer.remove();
      setHighlightLayer(null);
    }

    if (!geofence) return;

    let layer: L.Layer | null = null;

    if (geofence.type === "circle" && geofence.center) {
      const center: [number, number] = Array.isArray(geofence.center)
        ? geofence.center
        : [geofence.center.lat, geofence.center.lng];

      layer = L.circle(center, {
        radius: geofence.radius ?? 100, // fallback radius
        color: "red",
        fillColor: "red",
        fillOpacity: 0.3,
      }).addTo(map);
    } else if (geofence.type === "polygon" && geofence.coordinates?.length) {
      // Convert coordinates to [[lat, lng], ...] array safely
      const coords: [number, number][] = geofence.coordinates.map((c: any) =>
        Array.isArray(c) ? c : [c.lat, c.lng]
      );

      layer = L.polygon(coords, {
        color: "red",
        fillColor: "red",
        fillOpacity: 0.3,
      }).addTo(map);
    }

    if (layer) {
      setHighlightLayer(layer);
      map.fitBounds((layer as any).getBounds(), { maxZoom: 15 });
    }
  }, [geofence, map]);

  return null; // this component does not render anything directly
}

export default function PersonnelMap({ geofence }: PersonnelMapProps) {
  const handleCreated = (e: any) => {
    console.log("Geofence created:", e.layerType, e.layer.toGeoJSON());
  };

  const handleEdited = (e: any) => {
    console.log(
      "Geofence edited:",
      e.layers.getLayers().map((l: any) => l.toGeoJSON())
    );
  };

  const handleDeleted = (e: any) => {
    console.log(
      "Geofence deleted:",
      e.layers.getLayers().map((l: any) => l.toGeoJSON())
    );
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Highlight selected geofence */}
      <GeofenceHighlighter geofence={geofence} />

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
          draw={{
            rectangle: true,
            polygon: true,
            circle: true,
            polyline: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{
            edit: {
              selectedPathOptions: {
                maintainColor: true,
              },
            },
            remove: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
