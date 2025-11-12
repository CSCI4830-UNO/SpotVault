"use client";

import { useState } from "react"; // Removed useEffect
import Map from "@/components/Map";
import { Spot } from "@/types/spot";
import Spots from "@/components/Spots";

export default function Home() {
  // Start with no spot selected (null), so the map is zoomed out
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const exampleSpots: Spot[] = [
    {
      id: "1",
      name: "Omaha Spot 1",
      latitude: 41.2565,
      longitude: -95.9345,
      description: "A cool spot by the park.",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    },
    {
      id: "2",
      name: "Omaha Spot 2",
      latitude: 41.258,
      longitude: -95.94,
      description: "Good view of downtown.",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    },
    {
      id: "3",
      name: "Omaha Spot 3",
      latitude: 41.25,
      longitude: -95.93,
      description: "", // Empty description to test 'None'
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    },
  ];

  // This function handles clicking a spot in the list.
  const handleSpotClick = (spot: Spot) => {
    if (selectedSpot?.id === spot.id) {
      // If the clicked spot is already selected, toggle "off"
      setSelectedSpot(null);
    } else {
      // Otherwise, select the new spot (toggle "on")
      setSelectedSpot(spot);
    }
  };

  const defaultLat = 41.2565;
  const defaultLng = -95.9345;
  const zoomAllLevel = 11.5;
  const zoomOnLevel = 14;

  return (
    <div className="h-full p-2 text-white flex flex-col gap-2">
      <div className="flex gap-2 overflow-hidden h-[70vh]">
        <main className="flex-[3] rounded-lg bg-black p-4">
          <Map
            spots={exampleSpots}
            selectedSpotId={selectedSpot?.id || null}
            initialLat={selectedSpot?.latitude || defaultLat}
            initialLng={selectedSpot?.longitude || defaultLng}
            initialZoom={selectedSpot ? zoomOnLevel : zoomAllLevel}
          />
        </main>

        <aside className="flex-[1] rounded-lg bg-black p-4">
          <Spots
            spots={exampleSpots}
            selectedSpotId={selectedSpot?.id || null}
            onSpotSelect={handleSpotClick}
          />
        </aside>
      </div>

      {/* The footer logic already works perfectly for this! */}
      <footer className="h-[20vh] flex-shrink-0 rounded-lg bg-black p-4">
        {selectedSpot ? (
          <div className="border rounded-lg p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Coordinates */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Coordinates
                </h4>
                <p className="text-white text-sm">
                  {selectedSpot.latitude?.toFixed(4) || "N/A"}
                </p>
                <p className="text-white text-sm">
                  {selectedSpot.longitude?.toFixed(4) || "N/A"}
                </p>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Notes
                </h4>
                <p className="text-white text-sm max-h-16 overflow-hidden">
                  {selectedSpot.description || "None"}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpot.description ? (
                    <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                      Spot
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">
            Select a spot to see details
          </div>
        )}
      </footer>
    </div>
  );
}
