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
import { useAuth } from "@/lib/AuthContext";

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
  const [publicSpots, setPublicSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedList, setSelectedList] = useState<SpotList | null>(null);
  const [activeTab, setActiveTab] = useState<"spots" | "browse" | "lists">("spots");
  const [pendingSpot, setPendingSpot] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [currentUsername] = useState<string>(() => getUsername());
  const { userId, isLoggedIn } = useAuth();
  // Load spots and lists from localStorage on mount
  useEffect(() => {
    const loadSpots = async () => {
      if (!userId) return;//waiting for userId.
      const spotsFromApi = await getAllSpots(userId);
      setSpots(spotsFromApi);
      const fetchedLists = await getAllLists(userId);
      setLists(fetchedLists);
    };
    const loadPublicSpots = async () => {
      const response = await fetch(`/api/spots/?browse=true&?limit=20, `, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to fetch spot");
      const publicSpots = await response.json();
      setPublicSpots(publicSpots)
    };
    if (isLoggedIn && userId) {
      loadSpots()
      loadPublicSpots()
    }
  }, [isLoggedIn, userId]);

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

  // was askng chatgpt for help with fixing the comments bug and it said remove this so we tryin somethin
  // Update selectedSpot when spots change
  useEffect(() => {
    if (selectedSpot) {
      let updatedSpot = spots.find(s => s.id === selectedSpot.id);
      if (!updatedSpot) {
        updatedSpot = publicSpots.find(s => s.id === selectedSpot.id);
      }
      if (updatedSpot) {
        setSelectedSpot(updatedSpot);
      } else {
        setSelectedSpot(null)
      }
    }
  }, [spots, selectedSpot?.id]);


  const handleSpotListClick = async (spot: Spot) => {
    setPendingSpot(null);
    if (selectedSpot?.id === spot.id) {
      setSelectedSpot(null);
    } else {
      setSelectedSpot(spot); // for some snappiness, though it does cause a bit of a snapback?
      //resyncs spot with db,
      try {
        const response = await fetch(`/api/spots/${spot.id}`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch spot");
        const fullSpot = await response.json();
        // Update localStorage
        const updatedSpots = spots.map(s => s.id === fullSpot.id ? fullSpot : s);
        if (selectedSpot && selectedSpot.id == fullSpot.id) {
          setSelectedSpot(fullSpot);//prevents snapback.
        }
        setSpots(updatedSpots);
      } catch (error) {
        console.error("Error fetching spot:", error);
        //we already set the spot beforehand
      }
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
  const handleCreateList = async (name: string, description?: string) => {
    //call the api create list.
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Failed to create list");
      //get the list and apply to the layout via useEffect()
      const newList = await response.json();
      setLists([...lists, newList]);
      setIsListModalOpen(false);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (confirm("Are you sure you want to delete this list?")) {
      try {
        const response = await fetch(`/api/lists/${listId}`, {
          method: "DELETE",
          credentials: 'include',
        });

        if (!response.ok) throw new Error("Failed to delete list");

        // CHANGE: Remove from local state
        setLists(lists.filter((l) => l.id !== listId));
        setSelectedList(null);
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }
  };


  const handleListSelect = async (list: SpotList | null) => {
    setSelectedList(list);
    if (list) {
      setSelectedSpot(null);
      setPendingSpot(null);
      setActiveTab("lists");
      try {
        const response = await fetch(`/api/lists/${list.id}?user_id=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch list");
        //fill in the list.
        const fullList = await response.json();
        setLists(lists.map(l => l.id === list.id ? fullList : l));
        if (selectedList && selectedList.id === fullList.id) {
          setSelectedList(fullList) //prevent snapback.
        }
      } catch (error) {
        console.error("error loading list details:", error)
      }
    }
  };

  const handleListClick = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (list) {
      setActiveTab("lists");
      handleListSelect(list);
    }
  };

  const handleRemoveSpotFromList = async () => {
    if (!selectedSpot || !selectedList) return;
    //call api.
    const response = await fetch(`/api/lists/${selectedList.id}/items/${selectedSpot.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spot_id: selectedSpot.id,
      }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error("Failed to remove spot from list");

    //no need to track the response as long as there wasn't an error.
    // Remove spot from local list
    console.log(selectedList)
    const updatedList: SpotList = {
      ...selectedList,
      spotIds: selectedList.spotIds.filter((id) => id !== selectedSpot.id),
      spots: selectedList.spots?.filter((s) => s.id !== selectedSpot.id),
      updatedAt: new Date().toISOString(),
    };
    //and "save"
    console.log("hello")
    console.log(updatedList)
    setLists(lists.map((l) => (l.id === selectedList.id ? updatedList : l)));
    handleListSelect(updatedList)
  };

  const onPublish = async () => {
    if (!selectedSpot || selectedSpot.isPublic) {
      return;
    }
    await fetch(`/api/spots/${selectedSpot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_public: true,
      }),
      credentials: 'include'
    });
  }
  const handleaddspottolist = async (spotId: string, listId: string) => {
    const spot = activeTab === "browse"
      ? publicSpots.find(s => s.id === spotId)
      : spots.find(s => s.id === spotId);

    if (!spot || !listId) return;

    try {
      const response = await fetch(`/api/lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spot_id: spotId,
        }),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add spot to list");
      }
      const updatedLists = lists.map(list => {
        if (list.id !== listId) return list;
        return list.spotIds.includes(spotId) ? list : { ...list, spotIds: [...list.spotIds, spotId] };
      });
      setLists(updatedLists);
    } catch (error) {
      console.error("Error adding spot to list:", error);
    }
  };
  const handleAddPhoto = async (photoDataUrl: string) => {
    if (!selectedSpot) return;
    try {

      const response = await fetch(`/api/spots/${selectedSpot.id}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoDataUrl,
          photos: selectedSpot.photos || [],
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Failed to add photo");
      const { url } = await response.json()
      const updatedSpot: Spot = {
        ...selectedSpot,
        photos: [...(selectedSpot.photos || []), url],
      };

      const updatedSpots = spots.map((spot) =>
        spot.id === selectedSpot.id ? updatedSpot : spot
      );

      setSpots(updatedSpots);
      setSelectedSpot(updatedSpot);
      await fetch(`/api/spots/${selectedSpot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedSpot.name,
          description: updatedSpot.description,
          photos: updatedSpot.photos,
          tags: updatedSpot.tags,
          is_public: updatedSpot.isPublic,
        }),
        credentials: 'include'
      });
    } catch (error) {
      console.error("Error adding photo:", error);
    }
  }


  const handleDeletePhoto = async (photoIndex: number) => {
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


  const handleAddSpotToCurrentList = async () => {
    if (!selectedSpot || !selectedList) return;

    try {

      const updatedList: SpotList = {
        ...selectedList,
        spots: [...(selectedList.spots ? selectedList.spots : []), selectedSpot],
        spotIds: [...selectedList.spotIds, selectedSpot.id],
        updatedAt: new Date().toISOString(),
      };

      // Update global lists array (triggers localStorage sync)
      setLists(lists.map(l => l.id === updatedList.id ? updatedList : l));

      // Update selected list
      if (updatedList.id == selectedList.id) {
        setSelectedList(updatedList);
      }
      const response = await fetch(`/api/lists/${selectedList.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spot_id: selectedSpot.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add spot to list");
      }

    } catch (error) {
      console.error("Error adding spot to list:", error);
    }
  };

  const handleSaveSpot = async (name: string, tags: string, description: string) => {
    if (!pendingSpot) return;

    const processedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const response = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          latitude: pendingSpot.lat,
          longitude: pendingSpot.lng,
          tags: processedTags,
          description: description.trim() || "",
          comments: [],
          photos: [],
        }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to save spot");
      const savedSpot = await response.json()
      if (savedSpot) {
        setSpots([...spots, savedSpot]);
        setIsModalOpen(false);
        setPendingSpot(null);
        setSelectedSpot(savedSpot);
      }
    } catch (error) {
      console.error("Error saving spot:", error);
    }
  };

  const handleDeleteSpot = async () => {
    if (!selectedSpot) return;
    if (confirm(`Are you sure you want to delete "${selectedSpot.name}" ? `)) {
      try {//delete via API
        const response = await fetch(`/api/spots/${selectedSpot.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) throw new Error("Failed to delete spot");
        setSpots(spots.filter(spot => spot.id !== selectedSpot.id));
        setSelectedSpot(null);
      } catch (error) {
        console.error("Error deleting spot:", error);
      }
    };
  }

  const handleUpdateSpot = async (name: string, description: string, tags: string[]) => {
    if (!selectedSpot) return;
    try {
      const response = await fetch(`/api/spots/${selectedSpot?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          tags,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Failed to edit spot");
      const updatedSpot = await response.json();
      const updatedSpots = spots.map((spot) => spot.id === selectedSpot.id ? updatedSpot : spot);
      setSpots(updatedSpots);
      setSelectedSpot(updatedSpot);
    } catch (err) {
      console.log(err)
    }

  }
  const handleAddComment = async (commentText: string) => {
    if (!selectedSpot) return;
    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_id: selectedSpot.creator_id,
          spot_id: selectedSpot.id,
          text: commentText,
          username: currentUsername,
          createdAt: new Date().toISOString(),
        }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();

      const updatedSpot: Spot = {
        ...selectedSpot,
        comments: [...(selectedSpot.comments || []), newComment],
        updatedAt: new Date().toISOString(),
      };
      if (selectedSpot.creator_id != userId) {
        const updatedSpots = publicSpots.map(spot =>
          spot.id === selectedSpot.id ? updatedSpot : spot
        );
      } else {
        const updatedSpots = spots.map(spot =>
          spot.id === selectedSpot.id ? updatedSpot : spot
        );
        setSpots(updatedSpots);
      }
      setSelectedSpot(updatedSpot);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedSpot) return;
    try {
      //api delete comment
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to delete comment");


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
      setSpots(updatedSpots);       //and this deletes stuff!
      setSelectedSpot(updatedSpot);
    } catch (error) {
      console.error("Error deleting comment:", error);
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
            isBrowse={activeTab == "browse"}
            publicSpots={publicSpots}
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
          publicSpots={publicSpots}
          lists={lists}
          selectedSpotId={selectedSpot?.id || null}
          selectedListId={selectedList?.id || null}
          onSpotSelect={handleSpotListClick}
          onListSelect={handleListSelect}
          isAddDisabled={!pendingSpot}
          isModifyDisabled={!selectedSpot}
          onAddClick={handleAddClick}
          onSaveToList={handleaddspottolist}
          onModifyClick={handleModifyClick}
          onCreateList={() => setIsListModalOpen(true)}
          onAddSpotToList={selectedList ? handleAddSpotToCurrentList : undefined}
          onDeleteList={handleDeleteList}
          onToggleFavorite={handleToggleFavorite}
          activeTab={activeTab || "spots"}
          onUpdateSpot={handleUpdateSpot}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "spots" || tab === "browse") {
              // Clear list selection when switching to spots or browse tab
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
        activeTab={activeTab}
        onPublish={onPublish}
        selectedList={selectedList}
        onDeleteSpot={handleDeleteSpot}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onListClick={handleListClick}
        onRemoveSpotFromList={handleRemoveSpotFromList}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
        onUpdateSpot={handleUpdateSpot}
      />
    </div>
  );
}

