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
  pendingSpot?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (spot: Spot) => void;
}

export default function Map({
  initialLat,
  initialLng,
  initialZoom = 12,
  spots = [],
  selectedSpotId = null,
  pendingSpot = null,
  onMapClick,
  onMarkerClick,
}: MapProps) {
  const defaultLat = 41.2565;
  const defaultLng = -95.9345;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const markers = useRef(new global.Map<string, maplibregl.Marker>());
  const pendingMarker = useRef<maplibregl.Marker | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  
  // Keep refs updated
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);
  
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

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
            "maptiler-raster": {
              type: "raster",
              tiles: [
                `https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key=cX9FPbd3EcrI0VWTmiWM`
              ],
              tileSize: 256,
              attribution: '© <a href="https://www.maptiler.com/copyright/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [{
            id: "maptiler-raster-layer",
            type: "raster",
            source: "maptiler-raster",
            minzoom: 0,
            maxzoom: 19
          }]
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
      markers.current.forEach((marker) => marker.remove());
      markers.current.clear();
      pendingMarker.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Set up click handler when map is loaded
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    const handleMapClick = (e: maplibregl.MapLayerMouseEvent) => {
      // Check if clicking directly on a marker element
      const target = e.originalEvent.target as HTMLElement;
      const clickedMarker = target.closest('.maplibregl-marker');
      
      if (clickedMarker) {
        return; // Don't create new spot when clicking existing markers
      }
      
      const { lat, lng } = e.lngLat;
      if (onMapClickRef.current) {
        onMapClickRef.current(lat, lng);
      }
    };

    map.current.on("click", handleMapClick);

    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;
    const centerLat = initialLat !== undefined ? initialLat : defaultLat;
    const centerLng = initialLng !== undefined ? initialLng : defaultLng;
    map.current.flyTo({
      center: [centerLng, centerLat],
      zoom: initialZoom,
      speed: 1.2,
    });
  }, [initialLat, initialLng, initialZoom, isLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    spots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        const isSelected = spot.id === selectedSpotId;
        const color = isSelected ? "#2ecc71" : "#3498db"; // Green when selected, blue otherwise

        const newMarker = new maplibregl.Marker({ color })
          .setLngLat([spot.longitude, spot.latitude])
          .addTo(map.current!);
        
        // Add click handler to marker
        const markerElement = newMarker.getElement();
        markerElement.style.cursor = 'pointer';
        markerElement.classList.add('maplibregl-marker');
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onMarkerClickRef.current) {
            onMarkerClickRef.current(spot);
          }
        }, true);

        markers.current.set(spot.id, newMarker);
      }
    });
  }, [spots, selectedSpotId, isLoaded]);
  
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Remove existing pending marker
    if (pendingMarker.current) {
      pendingMarker.current.remove();
      pendingMarker.current = null;
    }

    // Add new pending marker if there's a pending spot
    if (pendingSpot && pendingSpot.lat && pendingSpot.lng) {
      pendingMarker.current = new maplibregl.Marker({ color: "#2ecc71" }) // Green
        .setLngLat([pendingSpot.lng, pendingSpot.lat])
        .addTo(map.current);
    }
  }, [pendingSpot, isLoaded]);

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