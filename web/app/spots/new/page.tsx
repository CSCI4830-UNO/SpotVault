"use client";

// Create New Spot Page - Form to create a new spot
// To edit: Add/remove form fields, change validation, modify submit button

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spot } from "@/types/spot";
import { saveSpot, generateSpotId } from "@/utils/spotStorage";
import Map from "@/components/Map";

export default function NewSpotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a spot name");
      return;
    }

    setIsSubmitting(true);

    // Parse tags from comma-separated string
    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newSpot: Spot = {
      id: generateSpotId(),
      name: name.trim(),
      description: description.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      latitude,
      longitude,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveSpot(newSpot);
    
    // Navigate to spots list after saving
    router.push("/spots");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New Spot</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Spot Name field - required field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
            >
              Spot Name <span className="text-red-500">*</span>
            </label>
            {/* Change placeholder text or make it optional by removing "required" */}
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter spot name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a short description (optional)"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium mb-2"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas (e.g. hiking, scenic, viewpoint)"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Map for selecting location - optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Click on the map to select a location, or drag the marker to adjust it.
            </p>
            {/* Map component - see components/Map.tsx to change map settings */}
            <Map
              onLocationSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
            {latitude && longitude && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Create Spot"}
            </button>
            <Link
              href="/spots"
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <Link href="/spots" className="text-blue-500 hover:underline">
            ← Back to Spots
          </Link>
        </div>
      </div>
    </div>
  );
}

