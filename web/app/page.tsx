"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { Spot, Comment } from "@/types/spot";
import Sidebar from "@/components/Sidebar";
import SpotCreationModal from "@/components/SpotCreationModal";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { getAllSpots, saveSpot } from "@/utils/spotStorage";

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

const USERNAME_KEY = "spotvault_username";

function getUsername(): string {
  if (typeof window === "undefined") return "User";
  const stored = localStorage.getItem(USERNAME_KEY);
  if (stored) return stored;
  const defaultUsername = "User";
  localStorage.setItem(USERNAME_KEY, defaultUsername);
  return defaultUsername;
}

export default function Home() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [pendingSpot, setPendingSpot] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUsername] = useState<string>(() => getUsername());

  // Load spots from localStorage on mount
  useEffect(() => {
    const storedSpots = getAllSpots();
    if (storedSpots.length > 0) {
      setSpots(storedSpots);
    } else {
      // Use example data if no stored spots
      setSpots(exampleSpotsData);
      // Save example data to localStorage
      exampleSpotsData.forEach(spot => saveSpot(spot));
    }
  }, []);

  // Save spots to localStorage whenever they change
  useEffect(() => {
    if (spots.length > 0) {
      spots.forEach(spot => saveSpot(spot));
    }
  }, [spots]);

  // Update selectedSpot when spots change
  useEffect(() => {
    if (selectedSpot) {
      const updatedSpot = spots.find(s => s.id === selectedSpot.id);
      if (updatedSpot) {
        setSelectedSpot(updatedSpot);
      }
    }
  }, [spots, selectedSpot?.id]);

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

  const handleModifyClick = () => {
    if (selectedSpot) {
      router.push(`/spots/${selectedSpot.id}/edit`);
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
      comments: [],
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

  const handleAddComment = (commentText: string) => {
    if (!selectedSpot) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: commentText,
      username: currentUsername,
      createdAt: new Date().toISOString(),
    };

    const updatedSpot: Spot = {
      ...selectedSpot,
      comments: [...(selectedSpot.comments || []), newComment],
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map(spot =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );

    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedSpot) return;

    const updatedComments = (selectedSpot.comments || []).filter(
      comment => comment.id !== commentId
    );

    const updatedSpot: Spot = {
      ...selectedSpot,
      comments: updatedComments,
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map(spot =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );

    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
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
      <HelpButton />
      {isModalOpen && (
        <SpotCreationModal
          onCancel={() => setIsModalOpen(false)}
          onSave={handleSaveSpot}
        />
      )}

      <div className="flex gap-2 overflow-hidden h-[65vh]">
        <main className="flex-[3] rounded-lg bg-black p-4">
          <Map
            spots={spots}
            selectedSpotId={selectedSpot?.id || null}
            initialLat={currentLat}
            initialLng={currentLng}
            initialZoom={currentZoom}
            pendingSpot={pendingSpot}
            onMapClick={handleMapClick}
            onMarkerClick={handleSpotListClick}
          />
        </main>

        <Sidebar
          spots={spots}
          selectedSpotId={selectedSpot?.id || null}
          onSpotSelect={handleSpotListClick}
          isAddDisabled={!pendingSpot}
          isModifyDisabled={!selectedSpot}
          onAddClick={handleAddClick}
          onModifyClick={handleModifyClick}
        />
      </div>
      
      <Footer
        selectedSpot={selectedSpot}
        pendingSpot={pendingSpot}
        currentUsername={currentUsername}
        onDeleteSpot={handleDeleteSpot}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}