"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Spot } from "@/types/spot";

interface MapProps {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  spots?: Spot[];
  selectedSpotId?: string | null;
}

export default function Map({
  initialLat,
  initialLng,
  initialZoom = 12,
  spots = [],
  selectedSpotId = null,
}: MapProps) {
  const defaultLat = 41.2565;
  const defaultLng = -95.9345;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const markers = useRef(new global.Map<string, maplibregl.Marker>());

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = () => {
      if (!mapContainer.current || map.current) return;
      const rect = mapContainer.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(initMap, 100);
        return;
      }

      const centerLat = initialLat !== undefined ? initialLat : defaultLat;
      const centerLng = initialLng !== undefined ? initialLng : defaultLng;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [centerLng, centerLat],
        zoom: initialZoom,
      });

      map.current.on("error", (e) => console.error("Map error:", e));

      map.current.on("load", () => {
        setIsLoaded(true);
        setTimeout(() => map.current?.resize(), 0);
      });
    };

    setTimeout(initMap, 0);

    return () => {
      // Cleanup
      markers.current.forEach((marker) => marker.remove());
      markers.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    const centerLat = initialLat !== undefined ? initialLat : defaultLat;
    const centerLng = initialLng !== undefined ? initialLng : defaultLng;

    map.current.flyTo({
      center: [centerLng, centerLat],
      zoom: initialZoom,
      speed: 1.2, // Animation speed
    });
  }, [initialLat, initialLng, initialZoom, isLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    spots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        const isSelected = spot.id === selectedSpotId;
        
        const color = isSelected ?  "#e74c3c":"#3498db" ;

        const newMarker = new maplibregl.Marker({ color })
          .setLngLat([spot.longitude, spot.latitude])
          .addTo(map.current!);

        markers.current.set(spot.id, newMarker);
      }
    });
  }, [spots, selectedSpotId, isLoaded]);

  useLayoutEffect(() => {
    if (!map.current || !isLoaded) return;
    const resizeMap = () => map.current?.resize();
    setTimeout(resizeMap, 0);
    window.addEventListener("resize", resizeMap);
    return () => window.removeEventListener("resize", resizeMap);
  }, [isLoaded]);

  return (
    <div className="w-full h-full rounded-lg relative">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}