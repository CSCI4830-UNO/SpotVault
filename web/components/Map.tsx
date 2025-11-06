"use client";

// Map Component - Interactive map for selecting locations
// To edit: Change default location, zoom level, map height, or map style

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
  initialLat,
  initialLng,
  initialZoom = 12, // Zoom level (higher = more zoomed in, try 10-15)
}: MapProps) {
  // Use defaults only if coordinates not provided
  const defaultLat = 41.2565; // Default location latitude - change this to your city
  const defaultLng = -95.9345; // Default location longitude - change this to your city
  
  const lat = initialLat !== undefined ? initialLat : defaultLat;
  const lng = initialLng !== undefined ? initialLng : defaultLng;
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

    // Wait for container to have dimensions before initializing
    const initMap = () => {
      if (!mapContainer.current || map.current) return;

      // Check if container has dimensions
      const rect = mapContainer.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(initMap, 100);
        return;
      }

      // Calculate center - use provided coordinates or defaults
      const centerLat = initialLat !== undefined ? initialLat : defaultLat;
      const centerLng = initialLng !== undefined ? initialLng : defaultLng;

      // Initialize map with OpenStreetMap style (only once)
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
        center: [centerLng, centerLat],
        zoom: initialZoom,
      });

      // Handle style loading errors
      map.current.on("error", (e) => {
        console.error("Map error:", e);
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
        
        // Add initial marker if coordinates provided
        if (initialLat !== undefined && initialLng !== undefined) {
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
    };

    // Start initialization
    setTimeout(initMap, 0);

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!map.current || !isLoaded) return;
    
    // If coordinates are provided and marker doesn't exist, create it
    if (initialLat !== undefined && initialLng !== undefined) {
      // Pan map to the location if it's far from current center
      const currentCenter = map.current.getCenter();
      const distance = Math.sqrt(
        Math.pow(currentCenter.lat - initialLat, 2) + 
        Math.pow(currentCenter.lng - initialLng, 2)
      );
      if (distance > 0.01) {
        map.current.flyTo({
          center: [initialLng, initialLat],
          zoom: 14,
        });
      }
      
      if (!marker.current) {
        updateMarker(initialLat, initialLng);
      } else {
        // Update existing marker if coordinates changed
        const currentLngLat = marker.current.getLngLat();
        if (
          Math.abs(currentLngLat.lat - initialLat) > 0.0001 ||
          Math.abs(currentLngLat.lng - initialLng) > 0.0001
        ) {
          marker.current.setLngLat([initialLng, initialLat]);
        }
      }
    }
  }, [initialLat, initialLng, isLoaded]);

  // Map container - change h-[400px] to h-[500px] or whatever height you want
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "400px" }} />
    </div>
  );
}

