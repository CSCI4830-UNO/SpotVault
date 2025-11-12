"use client"; // Add this since we are using state

// Homepage - First page users see
import { useState } from "react";
import Map from "@/components/Map";
import SpotsMap from "@/components/SpotsMap";
import { Spot } from "@/types/spot";

export default function Home() {
  
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  // Your existing example data
  const exampleSpots: Spot[] = [
    { id: "1", name: "Omaha Spot 1", latitude: 41.2565, longitude: -95.9345 , createdAt: new Date().toString(), updatedAt: new Date().toString()},
    { id: "2", name: "Omaha Spot 2", latitude: 41.2580, longitude: -95.9400 , createdAt: new Date().toString(), updatedAt: new Date().toString()},
    { id: "3", name: "Omaha Spot 3", latitude: 41.2500, longitude: -95.9300 , createdAt: new Date().toString(), updatedAt: new Date().toString()},
  ];
  
  useState(() => {
    if (exampleSpots.length > 0) {
      setSelectedSpot(exampleSpots[0]);
    }
  });

  return (
    <div className="h-full p-2 text-white flex flex-col gap-2">
      <div className="flex gap-2 overflow-hidden h-[70vh]">
        
        <main className="flex-[3] rounded-lg bg-black p-4">
          <Map
            initialLat={selectedSpot?.latitude}
            initialLng={selectedSpot?.longitude}
          />
        </main>

        <aside className="flex-[1] rounded-lg bg-black p-4">
          <SpotsMap
            spots={exampleSpots}
            selectedSpotId={selectedSpot?.id || null}
            onSpotSelect={setSelectedSpot} 
          />
        </aside>
      </div>

      <footer className="h-[20vh] flex-shrink-0 rounded-lg bg-black p-4">
        Player Bar / Footer
      </footer>
    </div>
  );
}