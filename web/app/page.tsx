"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { Spot, Comment } from "@/types/spot";
import { SpotList } from "@/types/list";
import Sidebar from "@/components/Sidebar";
import SpotCreationModal from "@/components/SpotCreationModal";
import ListCreationModal from "@/components/ListCreationModal";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { getAllSpots, saveSpot } from "@/utils/spotStorage";
import { getAllLists, saveList, generateListId } from "@/utils/listStorage";

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
  const [lists, setLists] = useState<SpotList[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedList, setSelectedList] = useState<SpotList | null>(null);
  const [activeTab, setActiveTab] = useState<"spots" | "lists">("spots");
  const [pendingSpot, setPendingSpot] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [currentUsername] = useState<string>(() => getUsername());

  // Load spots and lists from localStorage on mount
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

    const storedLists = getAllLists();
    setLists(storedLists);
  }, []);

  // Save spots to localStorage whenever they change
  useEffect(() => {
    if (spots.length > 0) {
      spots.forEach(spot => saveSpot(spot));
    }
  }, [spots]);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    lists.forEach(list => saveList(list));
  }, [lists]);

  // Update selectedSpot when spots change
  useEffect(() => {
    if (selectedSpot) {
      const updatedSpot = spots.find(s => s.id === selectedSpot.id);
      if (updatedSpot) {
        setSelectedSpot(updatedSpot);
      } else {
        // Spot was deleted, clear selection
        setSelectedSpot(null);
      }
    }
  }, [spots, selectedSpot?.id]);


  const handleSpotListClick = (spot: Spot) => {
    setPendingSpot(null);
    if (selectedSpot?.id === spot.id) {
      setSelectedSpot(null);
    } else {
      setSelectedSpot(spot);
      // Don't automatically switch to lists tab - let user stay where they are
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

  const handleCreateList = (name: string, description: string) => {
    const newList: SpotList = {
      id: generateListId(),
      name,
      description: description || undefined,
      spotIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLists([...lists, newList]);
    setIsListModalOpen(false);
  };

  const handleListSelect = (list: SpotList | null) => {
    // Handle Favorites list (virtual list with id "__favorites__")
    if (list && list.id === "__favorites__") {
      setSelectedList(list);
      setSelectedSpot(null);
      setPendingSpot(null);
      setActiveTab("lists");
      return;
    }
    
    setSelectedList(list);
    if (list) {
      setSelectedSpot(null);
      setPendingSpot(null);
      // Only switch to lists tab if we're explicitly selecting a list
      setActiveTab("lists");
    }
  };

  const handleListClick = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (list) {
      setActiveTab("lists");
      handleListSelect(list);
    }
  };

  const handleAddSpotToList = (listId: string) => {
    if (!selectedSpot) return;

    // Update the spot's listId
    const updatedSpot: Spot = {
      ...selectedSpot,
      listId,
      updatedAt: new Date().toISOString(),
    };

    // Update the list's spotIds
    const list = lists.find((l) => l.id === listId);
    if (list && !list.spotIds.includes(selectedSpot.id)) {
      const updatedList: SpotList = {
        ...list,
        spotIds: [...list.spotIds, selectedSpot.id],
        updatedAt: new Date().toISOString(),
      };
      setLists(lists.map((l) => (l.id === listId ? updatedList : l)));
    }

    // Update spots
    const updatedSpots = spots.map((spot) =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );
    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
  };

  const handleRemoveSpotFromList = () => {
    if (!selectedSpot || !selectedSpot.listId) return;

    const list = lists.find((l) => l.id === selectedSpot.listId);
    if (list) {
      // Remove spot from list
      const updatedList: SpotList = {
        ...list,
        spotIds: list.spotIds.filter((id) => id !== selectedSpot.id),
        updatedAt: new Date().toISOString(),
      };
      setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    }

    // Remove listId from spot
    const updatedSpot: Spot = {
      ...selectedSpot,
      listId: undefined,
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map((spot) =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );
    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
  };

  const handleAddPhoto = (photoDataUrl: string) => {
    if (!selectedSpot) return;

    const updatedSpot: Spot = {
      ...selectedSpot,
      photos: [...(selectedSpot.photos || []), photoDataUrl],
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map((spot) =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );

    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
  };

  const handleDeletePhoto = (photoIndex: number) => {
    if (!selectedSpot || !selectedSpot.photos) return;

    const updatedPhotos = selectedSpot.photos.filter((_, index) => index !== photoIndex);
    const updatedSpot: Spot = {
      ...selectedSpot,
      photos: updatedPhotos.length > 0 ? updatedPhotos : undefined,
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map((spot) =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );

    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
  };

  const handleToggleFavorite = (spotId: string) => {
    const spot = spots.find((s) => s.id === spotId);
    if (!spot) return;

    const updatedSpot: Spot = {
      ...spot,
      isFavorite: !spot.isFavorite,
      updatedAt: new Date().toISOString(),
    };

    const updatedSpots = spots.map((s) => (s.id === spotId ? updatedSpot : s));
    setSpots(updatedSpots);

    // Update selectedSpot if it's the one being toggled
    if (selectedSpot && selectedSpot.id === spotId) {
      setSelectedSpot(updatedSpot);
    }
  };

  const handleAddSpotToCurrentList = () => {
    if (!selectedList || !selectedSpot) return;
    
    // Check if spot is already in the list
    if (selectedList.spotIds.includes(selectedSpot.id)) {
      return; // Already in list
    }

    // Add spot to list
    const updatedList: SpotList = {
      ...selectedList,
      spotIds: [...selectedList.spotIds, selectedSpot.id],
      updatedAt: new Date().toISOString(),
    };

    // Update spot's listId
    const updatedSpot: Spot = {
      ...selectedSpot,
      listId: selectedList.id,
      updatedAt: new Date().toISOString(),
    };

    setLists(lists.map((l) => (l.id === selectedList.id ? updatedList : l)));
    const updatedSpots = spots.map((spot) =>
      spot.id === selectedSpot.id ? updatedSpot : spot
    );
    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
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
      photos: [],
      createdAt: new Date().toString(),
      updatedAt: new Date().toISOString(),
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

      {isListModalOpen && (
        <ListCreationModal
          onCancel={() => setIsListModalOpen(false)}
          onSave={handleCreateList}
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
          lists={lists}
          selectedSpotId={selectedSpot?.id || null}
          selectedListId={selectedList?.id || null}
          onSpotSelect={handleSpotListClick}
          onListSelect={handleListSelect}
          isAddDisabled={!pendingSpot}
          isModifyDisabled={!selectedSpot}
          onAddClick={handleAddClick}
          onModifyClick={handleModifyClick}
          onCreateList={() => setIsListModalOpen(true)}
          onAddSpotToList={selectedList ? handleAddSpotToCurrentList : undefined}
          onToggleFavorite={handleToggleFavorite}
          onModifyClick={handleModifyClick}
          isModifyDisabled={!selectedSpot}
          activeTab={activeTab || "spots"}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "spots") {
              // Clear list selection when switching to spots tab
              setSelectedList(null);
            }
          }}
        />
      </div>
      
      <Footer
        selectedSpot={selectedSpot}
        pendingSpot={pendingSpot}
        currentUsername={currentUsername}
        lists={lists}
        onDeleteSpot={handleDeleteSpot}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onListClick={handleListClick}
        onAddSpotToList={handleAddSpotToList}
        onRemoveSpotFromList={handleRemoveSpotFromList}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
}