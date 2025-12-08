"use client";

import { useState, useMemo } from "react";
import { Spot } from "@/types/spot";
import AddButton from "./AddButton";
import ModifyButton from "./ModifyButton";

interface SpotsMapProps {
  spots: Spot[];
  selectedSpotId: string | null;
  onSpotSelect: (spot: Spot) => void;
  onAddClick: () => void;
  isAddDisabled?: boolean;
}

export default function Spots({
  spots,
  selectedSpotId,
  onSpotSelect,
  onAddClick,
  isAddDisabled = true,
}: SpotsMapProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter spots based on search term (searches name, description, and tags)
  const filteredSpots = useMemo(() => {
    if (!searchTerm.trim()) {
      return spots;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return spots.filter((spot) => {
      // Search in name
      if (spot.name?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      // Search in description
      if (spot.description?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      // Search in tags
      if (spot.tags?.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))) {
        return true;
      }
      return false;
    });
  }, [spots, searchTerm]);

  return (
    <div className="flex flex-col h-full text-white">
      {/* Top Buttons */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <AddButton
          onClick={onAddClick}
          disabled={isAddDisabled}
        />
        <ModifyButton />
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex-shrink-0">
        <input
          type="text"
          placeholder="Search spots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Scrollable List of Spots */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-3">
          {filteredSpots.map((spot) => (
            <li
              key={spot.id}
              onClick={() => onSpotSelect(spot)}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all ${
                selectedSpotId === spot.id
                  ? "bg-blue-700 ring-2 ring-blue-300"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {/* Placeholder Image */}
              <div className="w-16 h-12 bg-gray-600 rounded flex-shrink-0"></div>
              <span className="font-semibold text-lg">{spot.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}