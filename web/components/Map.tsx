"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
}

export default function Map({
  onLocationSelect,
  initialLat = 41.2565, // Default to Omaha, NE
  initialLng = -95.9345,
  initialZoom = 12,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const marker = useRef<maplibregl.Marker | null>(null);
  const isDragging = useRef(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep callback ref in sync
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Helper function to update marker position
  const updateMarker = useRef((lat: number, lng: number) => {
    if (!map.current) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    marker.current = new maplibregl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Update coordinates when marker is dragged
    marker.current.on("dragend", () => {
      if (marker.current && onLocationSelectRef.current) {
        const lngLat = marker.current.getLngLat();
        onLocationSelectRef.current(lngLat.lat, lngLat.lng);
      }
    });
  }).current;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with OpenStreetMap style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors"
          }
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [initialLng, initialLat],
      zoom: initialZoom,
    });

    map.current.on("load", () => {
      setIsLoaded(true);
      
      // Resize map to ensure proper rendering
      map.current!.resize();
      
      // Add initial marker if coordinates provided
      if (initialLat && initialLng) {
        updateMarker(initialLat, initialLng);
      }

      // Track whether user is dragging the map (to distinguish from clicks)
      let clickTimeout: NodeJS.Timeout | null = null;
      let wasDragged = false;

      map.current!.on("dragstart", () => {
        wasDragged = true;
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
      });

      map.current!.on("dragend", () => {
        // Reset after drag ends
        setTimeout(() => {
          wasDragged = false;
        }, 50);
      });

      // Handle map clicks (only if not dragging)
      map.current!.on("click", (e) => {
        // Check if this was a drag by checking if originalEvent exists and has movement
        const originalEvent = e.originalEvent as MouseEvent;
        if (originalEvent && (originalEvent.movementX !== 0 || originalEvent.movementY !== 0)) {
          wasDragged = true;
        }

        // Delay marker placement to check if it was a drag
        clickTimeout = setTimeout(() => {
          if (!wasDragged) {
            const { lng, lat } = e.lngLat;
            updateMarker(lat, lng);
            if (onLocationSelectRef.current) {
              onLocationSelectRef.current(lat, lng);
            }
          }
          wasDragged = false;
        }, 150);
      });
    });

    // Handle style loading errors
    map.current.on("error", (e) => {
      console.error("Map error:", e);
    });

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialLat, initialLng, initialZoom, updateMarker]);

  // Resize map when component is mounted and after window resize
  useLayoutEffect(() => {
    if (!map.current || !isLoaded) return;

    const resizeMap = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    // Initial resize after mount
    setTimeout(resizeMap, 0);

    // Resize on window resize
    window.addEventListener("resize", resizeMap);
    return () => window.removeEventListener("resize", resizeMap);
  }, [isLoaded]);

  // Update marker position when initial coordinates change (but not on every render)
  useEffect(() => {
    if (map.current && isLoaded && initialLat && initialLng && marker.current) {
      // Only update if coordinates actually changed
      const currentLngLat = marker.current.getLngLat();
      if (
        Math.abs(currentLngLat.lat - initialLat) > 0.0001 ||
        Math.abs(currentLngLat.lng - initialLng) > 0.0001
      ) {
        marker.current.setLngLat([initialLng, initialLat]);
      }
    } else if (map.current && isLoaded && initialLat && initialLng && !marker.current) {
      // Create marker if it doesn't exist
      updateMarker(initialLat, initialLng);
    }
  }, [initialLat, initialLng, isLoaded]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "400px" }} />
    </div>
  );
}

