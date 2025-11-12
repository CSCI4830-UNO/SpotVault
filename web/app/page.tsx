"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import { Spot } from "@/types/spot";
import Sidebar from "@/components/Sidebar";
import SpotCreationModal from "@/components/SpotCreationModal";
import Footer from "@/components/Footer";

// --- EXAMPLE DATA ---
const exampleSpotsData: Spot[] = [
  {
    id: "1",
    name: "Omaha Spot 1",
    latitude: 41.2565,
    longitude: -95.9345,
    description: "A cool spot by the park.",
    tags: ["park", "public"],
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
  {
    id: "2",
    name: "Omaha Spot 2",
    latitude: 41.258,
    longitude: -95.94,
    description: "Good view of downtown.",
    tags: ["view", "downtown"],
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
];
// --- END EXAMPLE DATA ---

export default function Home() {
  const [spots, setSpots] = useState(exampleSpotsData);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [pendingSpot, setPendingSpot] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpotListClick = (spot: Spot) => {
    setPendingSpot(null);
    if (selectedSpot?.id === spot.id) {
      setSelectedSpot(null);
    } else {
      setSelectedSpot(spot);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedSpot(null);
    setPendingSpot({ lat, lng });
  };

  const handleAddClick = () => {
    if (pendingSpot) {
      setIsModalOpen(true);
    }
  };

  const handleSaveSpot = (name: string, tags: string, description: string) => {
    if (!pendingSpot) return;

    const processedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newSpot: Spot = {
      id: new Date().toISOString(),
      name: name,
      latitude: pendingSpot.lat,
      longitude: pendingSpot.lng,
      tags: processedTags,
      description: description.trim() || undefined,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    setSpots([...spots, newSpot]);
    setIsModalOpen(false);
    setPendingSpot(null);
    setSelectedSpot(newSpot);
  };

  const handleDeleteSpot = () => {
    if (!selectedSpot) return;
    if (confirm(`Are you sure you want to delete "${selectedSpot.name}"?`)) {
      setSpots(spots.filter(spot => spot.id !== selectedSpot.id));
      setSelectedSpot(null);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPendingSpot(null);
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // --- Zoom/Center logic ---
  const defaultLat = 41.2565;
  const defaultLng = -95.9345;
  const zoomAllLevel = 13;
  const zoomOnLevel = 16;

  let currentLat = defaultLat;
  let currentLng = defaultLng;
  let currentZoom = zoomAllLevel;

  if (selectedSpot) {
    currentLat = selectedSpot.latitude!;
    currentLng = selectedSpot.longitude!;
    currentZoom = zoomOnLevel;
  } else if (pendingSpot) {
    currentLat = pendingSpot.lat;
    currentLng = pendingSpot.lng;
    currentZoom = zoomOnLevel;
  }

  return (
    <div className="h-full p-2 text-white flex flex-col gap-2">
      {isModalOpen && (
        <SpotCreationModal
          onCancel={() => setIsModalOpen(false)}
          onSave={handleSaveSpot}
        />
      )}

      <div className="flex gap-2 overflow-hidden h-[70vh]">
        <main className="flex-[3] rounded-lg bg-black p-4">
          <Map
            spots={spots}
            selectedSpotId={selectedSpot?.id || null}
            initialLat={currentLat}
            initialLng={currentLng}
            initialZoom={currentZoom}
            pendingSpot={pendingSpot}
            onMapClick={handleMapClick}
          />
        </main>

        <Sidebar
          spots={spots}
          selectedSpotId={selectedSpot?.id || null}
          onSpotSelect={handleSpotListClick}
          isAddDisabled={!pendingSpot}
          onAddClick={handleAddClick}
        />
      </div>
      
      <Footer
        selectedSpot={selectedSpot}
        pendingSpot={pendingSpot}
        onDeleteSpot={handleDeleteSpot}
      />
    </div>
  );
}