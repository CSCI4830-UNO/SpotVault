"use client";

// Spots List Page - Shows all saved spots
// To edit: Change how spots are displayed, add/remove info shown, change delete/edit buttons

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spot } from "@/types/spot";
import { getAllSpots, deleteSpot } from "@/utils/spotStorage";

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    setSpots(getAllSpots());
  }, []);

  const handleDelete = (spotId: string) => {
    if (confirm("Are you sure you want to delete this spot?")) {
      deleteSpot(spotId);
      setSpots(getAllSpots());
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Spots</h1>
          <Link
            href="/spots/new"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            + New Spot
          </Link>
        </div>

        {spots.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No spots yet. Create your first spot!
            </p>
            <Link
              href="/spots/new"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Spot
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Spot name - change text size/color here */}
                    <h2 className="text-2xl font-semibold mb-2">{spot.name}</h2>
                    {/* Description - only shows if spot has one */}
                    {spot.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {spot.description}
                      </p>
                    )}
                    {/* Location coordinates - only shows if spot has location */}
                    {(spot.latitude !== undefined ||
                      spot.longitude !== undefined) && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Location: {spot.latitude?.toFixed(6)},{" "}
                        {spot.longitude?.toFixed(6)}
                      </p>
                    )}
                    {/* Created date - change format here if you want */}
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                      Created: {new Date(spot.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Link
                      href={`/spots/${spot.id}/edit`}
                      className="text-blue-500 hover:text-blue-700 transition-colors px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(spot.id)}
                      className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-500 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

