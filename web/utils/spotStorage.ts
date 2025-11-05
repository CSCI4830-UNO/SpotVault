import { Spot } from "@/types/spot";

const STORAGE_KEY = "spotvault_spots";

/**
 * Get all spots from storage
 */
export function getAllSpots(): Spot[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading spots from storage:", error);
    return [];
  }
}

/**
 * Save a spot to storage
 */
export function saveSpot(spot: Spot): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const spots = getAllSpots();
    const existingIndex = spots.findIndex((s) => s.id === spot.id);

    if (existingIndex >= 0) {
      // Update existing spot
      spots[existingIndex] = spot;
    } else {
      // Add new spot
      spots.push(spot);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (error) {
    console.error("Error saving spot to storage:", error);
  }
}

/**
 * Delete a spot from storage
 */
export function deleteSpot(spotId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const spots = getAllSpots();
    const filtered = spots.filter((s) => s.id !== spotId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting spot from storage:", error);
  }
}

/**
 * Get a single spot by ID
 */
export function getSpotById(spotId: string): Spot | null {
  const spots = getAllSpots();
  return spots.find((s) => s.id === spotId) || null;
}

/**
 * Generate a unique ID for a new spot
 */
export function generateSpotId(): string {
  return `spot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

