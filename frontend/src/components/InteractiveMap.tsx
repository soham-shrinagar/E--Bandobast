import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
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

    if (
      geofence.type === "circle" &&
      geofence.center_lat &&
      geofence.center_long
    ) {
      const center: [number, number] = [
        geofence.center_lat,
        geofence.center_long,
      ];

      layer = L.circle(center, {
        radius: geofence.radius ?? 100,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.3,
      }).addTo(map);
    } else if (geofence.type === "polygon" && geofence.polygon?.length) {
      // polygon is stored as JSON array of {lat,lng} objects
      const coords: [number, number][] = geofence.polygon.map((c: any) => [
        c.lat,
        c.lng,
      ]);

      layer = L.polygon(coords, {
        color: "red",
        fillColor: "red",
        fillOpacity: 0.3,
      }).addTo(map);
    }

    if (layer) {
      setHighlightLayer(layer);
      // Fit map bounds to layer
      //@ts-ignore
      map.fitBounds(layer.getBounds(), { maxZoom: 15 });
    }
  }, [geofence, map]);

  return null; // this component does not render anything directly
}

export default function PersonnelMap({ geofence }: PersonnelMapProps) {
  const [newGeofence, setNewGeofence] = useState<any>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [geofenceName, setGeofenceName] = useState("");

  const [personnel, setPersonnel] = useState<
    { lat: number; lng: number; phone: string }[]
  >([]);
  useEffect(() => {
    if (!geofence?.id) {
      setPersonnel([]);
      return;
    }

    const fetchPersonnel = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/geofence/${geofence.id}/personnel`,
          {
            headers: { token: localStorage.getItem("token") || "" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch personnel");
        const data = await res.json();

        const mapped = data.map((p: any) => ({
          lat: p.currentCords.lat,
          lng: p.currentCords.long,
          phone: p.phoneNumber,
        }));

        setPersonnel(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPersonnel();
  }, [geofence]);

  const handleCreated = (e: any) => {
    const { layerType, layer } = e;
    setNewGeofence({ layerType, layer });
    setShowNameModal(true); // open modal
  };

  const saveGeofence = async () => {
    if (!newGeofence) return;

    const { layerType, layer } = newGeofence;
    let payload: any = { name: geofenceName };

    if (layerType === "circle") {
      payload.type = "circle";
      payload.center_lat = layer.getLatLng().lat;
      payload.center_long = layer.getLatLng().lng;
      payload.radius = layer.getRadius();
      payload.polygon = null;
    } else if (layerType === "polygon") {
      payload.type = "polygon";
      payload.center_lat = null;
      payload.center_long = null;
      payload.radius = null;
      payload.polygon = layer.getLatLngs()[0];
    }

    try {
      const res = await fetch("http://localhost:3000/api/save-geofence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save geofence");
      console.log("Geofence saved");
    } catch (err) {
      console.error(err);
    } finally {
      setShowNameModal(false);
      setNewGeofence(null);
      setGeofenceName("");
    }
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
    <>
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
        {personnel.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]}>
            <Popup>{p.phone}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {showNameModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Name the Geofence</h2>
            <input
              type="text"
              value={geofenceName}
              onChange={(e) => setGeofenceName(e.target.value)}
              placeholder="Enter name"
              className="border px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setNewGeofence(null);
                  setGeofenceName("");
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => saveGeofence()}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
