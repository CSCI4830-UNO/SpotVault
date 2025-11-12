"use client";

// Map showing all spots - Simple map component for displaying spots
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Spot } from "@/types/spot";

interface SpotsMapProps {
  spots: Spot[];
}

export default function SpotsMap({ spots }: SpotsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map once - use initial spots for center calculation
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Wait a bit to ensure container has dimensions
    const initMap = () => {
      if (!mapContainer.current || map.current) return;
      
      // Check if container has dimensions
      const rect = mapContainer.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(initMap, 100);
        return;
      }

      // Calculate center from initial spots, or use default
      const initialSpotsWithLocation = spots.filter(s => s.latitude !== undefined && s.longitude !== undefined);
      let centerLat = 41.2565;
      let centerLng = -95.9345;
      
      if (initialSpotsWithLocation.length > 0) {
        centerLat = initialSpotsWithLocation.reduce((sum, s) => sum + (s.latitude || 0), 0) / initialSpotsWithLocation.length;
        centerLng = initialSpotsWithLocation.reduce((sum, s) => sum + (s.longitude || 0), 0) / initialSpotsWithLocation.length;
      }

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors"
            }
          },
          layers: [{
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19
          }]
        },
        center: [centerLng, centerLat],
        zoom: initialSpotsWithLocation.length > 0 ? 10 : 12,
      });

      map.current.on("load", () => {
        setIsLoaded(true);
        // Multiple resize calls to ensure proper rendering
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 0);
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 300);
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
      });
    };

    // Start initialization
    setTimeout(initMap, 0);

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when spots change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Remove old markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    const spotsWithLocation = spots.filter(s => s.latitude !== undefined && s.longitude !== undefined);
    spotsWithLocation.forEach((spot) => {
      if (spot.latitude !== undefined && spot.longitude !== undefined) {
        const marker = new maplibregl.Marker()
          .setLngLat([spot.longitude, spot.latitude])
          .addTo(map.current!);
        markers.current.push(marker);
      }
    });

    // Resize after markers are added
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 50);
  }, [spots, isLoaded]);

  // Resize map when loaded and on window resize
  useLayoutEffect(() => {
    if (!map.current || !isLoaded) return;

    const resizeMap = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    setTimeout(resizeMap, 0);
    window.addEventListener("resize", resizeMap);
    return () => window.removeEventListener("resize", resizeMap);
  }, [isLoaded]);

  if (spots.filter(s => s.latitude !== undefined && s.longitude !== undefined).length === 0) {
    return null; // Don't show map if no spots have locations
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "300px" }} />
    </div>
  );
}

