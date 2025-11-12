"use client";

// Spots List Page - Shows all saved spots with map and list view
// Layout: Map on top-left, spots list on right, info panel at bottom

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spot } from "@/types/spot";
import { getAllSpots, deleteSpot } from "@/utils/spotStorage";
import SpotsMap from "@/components/SpotsMap";

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    const allSpots = getAllSpots();
    setSpots(allSpots);
    // Select first spot by default
    if (allSpots.length > 0) {
      setSelectedSpot(allSpots[0]);
    }
  }, []);

  const handleDelete = (spotId: string) => {
    if (confirm("Are you sure you want to delete this spot?")) {
      deleteSpot(spotId);
      const updatedSpots = getAllSpots();
      setSpots(updatedSpots);
      // Clear selection if deleted spot was selected
      if (selectedSpot?.id === spotId) {
        setSelectedSpot(updatedSpots.length > 0 ? updatedSpots[0] : null);
      }
    }
  };

  const spotsWithLocation = spots.filter(s => s.latitude !== undefined && s.longitude !== undefined);
  const showMap = spots.length > 0 && spotsWithLocation.length > 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Spots</h1>
        </div>

        {spots.length === 0 ? (
          <div className="text-center py-12 border border-gray-700 rounded-lg bg-gray-900">
            <p className="text-gray-400 mb-4">
              No spots yet. Create your first spot!
            </p>
            <Link
              href="/spots/new"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              + ADD
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top section: Map on left, Spots list on right */}
            <div className="flex gap-6">
              {/* Map Section */}
              {showMap && (
                <div className="flex-1 min-w-0">
                  <div className="border-4 border-teal-500 rounded-lg overflow-hidden">
                    <SpotsMap spots={spots} />
                  </div>
                </div>
              )}

              {/* Spots List Section - Right sidebar */}
              <div className="w-64 flex flex-col">
                <div className="flex gap-2 mb-4">
                  <Link
                    href="/spots/new"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                  >
                    ADD
                  </Link>
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    onClick={() => {
                      if (selectedSpot) {
                        window.location.href = `/spots/${selectedSpot.id}/edit`;
                      }
                    }}
                  >
                    MODIFY
                  </button>
                </div>

                {/* Scrollable spots list */}
                <div className="flex-1 overflow-y-auto space-y-2 bg-gray-900 border border-gray-700 rounded-lg p-3">
                  {spots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedSpot?.id === spot.id
                          ? 'bg-blue-600 border border-blue-500'
                          : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {/* Spot thumbnail and name */}
                      <div className="flex gap-3">
                        {/* Placeholder thumbnail */}
                        <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex-shrink-0 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {spot.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Info Panel */}
            {selectedSpot && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-8">
                  {/* Coordinates */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Coordinates
                    </h4>
                    <p className="text-white text-sm">
                      {selectedSpot.latitude?.toFixed(4) || 'N/A'}
                    </p>
                    <p className="text-white text-sm">
                      {selectedSpot.longitude?.toFixed(4) || 'N/A'}
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Notes
                    </h4>
                    <p className="text-white text-sm max-h-16 overflow-hidden">
                      {selectedSpot.description || 'Etc..'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        Spot
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedSpot.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    DELETE SPOT
                  </button>
                </div>
              </div>
            )}

            {/* Back link */}
            <div>
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

