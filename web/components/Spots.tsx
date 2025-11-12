"use client";

import { Spot } from "@/types/spot";
import AddButton from "./AddButton";
import ModifyButton from "./ModifyButton";
// We don't need maplibre-gl here anymore

interface SpotsMapProps {
  spots: Spot[];
  selectedSpotId: string | null;
  onSpotSelect: (spot: Spot) => void;
}

export default function Spots({
  spots,
  selectedSpotId,
  onSpotSelect,
}: SpotsMapProps) {
  // This component is now a list, not a map.
  // We'll render the buttons and the list of spots from your image.

  return (
    <div className="flex flex-col h-full text-white">
      {/* Top Buttons */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <AddButton />
        <ModifyButton />
      </div>

      {/* Scrollable List of Spots */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-3">
          {spots.map((spot) => (
            <li
              key={spot.id}
              onClick={() => onSpotSelect(spot)}
              // Apply different styles if this spot is the selected one
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all ${
                selectedSpotId === spot.id
                  ? "bg-blue-700 ring-2 ring-blue-300" // Highlight style
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              {/* Placeholder Image */}
              <div className="w-16 h-12 bg-gray-600 rounded flex-shrink-0">
                {/* In a real app, you'd use Next's <Image /> component 
                  if your 'spot' object had an imageUrl property.
                */}
              </div>
              <span className="font-semibold text-lg">{spot.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
