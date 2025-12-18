"use client";

import { useState, useEffect } from "react";
import { Spot } from "@/types/spot";
import { SpotList } from "@/types/list";
import Spots from "@/components/Spots";
import Lists from "@/components/Lists";

interface SidebarProps {
  spots: Spot[];
  publicSpots: Spot[];
  lists: SpotList[];
  selectedSpotId: string | null;
  selectedListId: string | null;
  isAddDisabled: boolean;
  isModifyDisabled: boolean;
  onSpotSelect: (spot: Spot) => void;
  onListSelect: (list: SpotList | null) => void;
  onAddClick: () => void;
  onModifyClick: () => void;
  onUpdateSpot(name: string, description: string, tags: string[]): void;
  onCreateList: () => void;
  onAddSpotToList?: () => void;
  onToggleFavorite?: (spotId: string) => void;
  activeTab?: "spots" | "lists" | "browse";
  onTabChange?: (tab: "spots" | "lists" | "browse") => void;
  onDeleteList: (listId: string) => void;
  onSaveToList: (spotId: string, listId: string) => void;
}

export default function Sidebar({
  spots,
  lists,
  selectedSpotId,
  selectedListId,
  isAddDisabled,
  isModifyDisabled,
  onSpotSelect,
  onSaveToList,
  publicSpots,
  onListSelect,
  onAddClick,
  onModifyClick,
  onCreateList,
  onAddSpotToList,
  onToggleFavorite,
  activeTab: externalActiveTab,
  onTabChange,
  onDeleteList,
  onUpdateSpot,
}: SidebarProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<"spots" | "lists" | "browse">("spots");

  // Always use external tab if provided, otherwise use internal
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

  // Sync internal tab with external tab when it changes
  useEffect(() => {
    if (externalActiveTab !== undefined) {
      setInternalActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  const setActiveTab = (tab: "spots" | "lists" | "browse") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <aside className="flex-[1] rounded-lg bg-black p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-700">
        <button
          onClick={() => {
            setActiveTab("spots");
            onListSelect(null);
          }}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "spots"
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-gray-400 hover:text-white"
            }`}
        >
          Spots
        </button>
        <button
          onClick={() => {
            setActiveTab("lists");
            onListSelect(null);
          }}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "lists"
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-gray-400 hover:text-white"
            }`}
        >
          Lists
        </button>
        <button
          onClick={() => {
            setActiveTab("browse");
            onListSelect(null);
          }}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "browse"
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-gray-400 hover:text-white"
            }`}
        >
          Browse
        </button>
      </div>

      {/* Content */}
      {activeTab === "spots" ? (
        <Spots
          spots={spots}
          selectedSpotId={selectedSpotId}
          onSpotSelect={onSpotSelect}
          lists={lists}
          isAddDisabled={isAddDisabled}
          isModifyDisabled={isModifyDisabled}
          onAddClick={onAddClick}
          onSaveToList={onSaveToList}
          onModifyClick={onModifyClick}
          onToggleFavorite={onToggleFavorite}
        />
      ) : activeTab === "browse" ? (
        <Spots
          spots={publicSpots}
          selectedSpotId={selectedSpotId}
          onSpotSelect={onSpotSelect}
          isAddDisabled={true}
          isModifyDisabled={true}
          isBrowse={true}
          lists={lists}
          onSaveToList={onSaveToList}
          onAddClick={onAddClick}
          onModifyClick={onModifyClick}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <Lists
          lists={lists}
          publicSpots={publicSpots}
          spots={spots}
          selectedListId={selectedListId}
          onListSelect={onListSelect}
          onCreateList={onCreateList}
          onSpotSelect={onSpotSelect}
          selectedSpotId={selectedSpotId}
          onAddSpotToList={onAddSpotToList}
          onModifyClick={onModifyClick}
          isModifyDisabled={isModifyDisabled}
          onToggleFavorite={onToggleFavorite}
          onDeleteList={onDeleteList}
        />
      )}
    </aside>
  );
}
