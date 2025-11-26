"use client";

import { Spot } from "@/types/spot";
import AddButton from "./AddButton";
import ModifyButton from "./ModifyButton";
import SettingsButton from "./SettingsButton";

interface SpotsMapProps {
  spots: Spot[];
  selectedSpotId: string | null;
  onSpotSelect: (spot: Spot) => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
  isAddDisabled?: boolean;
}

export default function Spots({
  spots,
  selectedSpotId,
  onSpotSelect,
  onAddClick,
  onSettingsClick,
  isAddDisabled = true,
}: SpotsMapProps) {
  return (
    <div className="flex flex-col h-full text-white">
      {/* Top Buttons */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <AddButton
          onClick={onAddClick}
          disabled={isAddDisabled}
        />
        <ModifyButton />
        <SettingsButton 
          onClick={onSettingsClick}
        />
      
      </div>

      {/* Scrollable List of Spots */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-3">
          {spots.map((spot) => (
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