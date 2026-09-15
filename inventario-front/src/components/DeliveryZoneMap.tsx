import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface DeliveryZoneMapProps {
  coordinates?: unknown;
  onChange: (coordinates: number[][]) => void;
}

const DEFAULT_CENTER: [number, number] = [-16.5000, -68.1500];

function DrawControls({
  coordinates,
  onChange,
}: DeliveryZoneMapProps) {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();

    map.addLayer(drawnItems);

    // Cargar polígono existente
    if (
      Array.isArray(coordinates) &&
      coordinates.length > 0 &&
      Array.isArray(coordinates[0])
    ) {
      const latLngs = coordinates
        .filter(
          (point): point is number[] =>
            Array.isArray(point) &&
            point.length >= 2 &&
            typeof point[0] === "number" &&
            typeof point[1] === "number"
        )
        .map(([lat, lng]) => L.latLng(lat, lng));

      if (latLngs.length >= 3) {
        const polygon = L.polygon(latLngs);

        drawnItems.addLayer(polygon);

        map.fitBounds(polygon.getBounds(), {
          padding: [30, 30],
        });
      }
    }

    const drawControl = new L.Control.Draw({
      position: "topright",

      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            weight: 3,
          },
        },

        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },

      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    const handleCreated = (event: any) => {
      const layer = event.layer;

      // Solo permitimos una zona por formulario
      drawnItems.clearLayers();

      drawnItems.addLayer(layer);

      if (layer instanceof L.Polygon) {
        const latLngs = layer.getLatLngs()[0] as L.LatLng[];

        const newCoordinates = latLngs.map((point) => [
          point.lat,
          point.lng,
        ]);

        onChange(newCoordinates);
      }
    };

    const handleEdited = (event: any) => {
      event.layers.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon) {
          const latLngs = layer.getLatLngs()[0] as L.LatLng[];

          const newCoordinates = latLngs.map((point) => [
            point.lat,
            point.lng,
          ]);

          onChange(newCoordinates);
        }
      });
    };

    const handleDeleted = () => {
      onChange([]);
    };

    map.on("draw:created", handleCreated);
    map.on("draw:edited", handleEdited);
    map.on("draw:deleted", handleDeleted);

    return () => {
    map.off("draw:created", handleCreated);
    map.off("draw:edited", handleEdited);
    map.off("draw:deleted", handleDeleted);

      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onChange]);

  return null;
}

export default function DeliveryZoneMap({
  coordinates,
  onChange,
}: DeliveryZoneMapProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <DrawControls
            coordinates={coordinates}
            onChange={onChange}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}