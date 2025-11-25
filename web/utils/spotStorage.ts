// Spot Storage - Handles saving and loading spots

import { Spot } from "@/types/spot";
//import the type to use. 

export async function getAllSpots(): Promise<Spot[]> {
  try {
    const response = await fetch("/api/spots");
    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error fetching spots: ${error}");
    return [];
  }
}

/**
* Get a single spot by ID
*/
export async function getSpotById(spotId: string): Promise<Spot | null> {
  try {
    const response = await fetch("/api/spots/${spotId}");
    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error fetching spots: ${error}");
    return null;
  }
}

export async function saveSpot(spot: Spot): Promise<Spot | null> {
  try {
    const isUpdate = spot.id;
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate ? '/api/spots/${spot.id}' : '/api/spots';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot),
    })
    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error saving spot: ${error}");
    return null;
  }
}
export async function deleteSpot(spotId: string): Promise<boolean> {
  //returns true (successfully deleted) or false (unable to delete).
  try {

    const response = await fetch('/api/spots/${spotId}', { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }
    return true;

  } catch (error) {
    console.error("Error deleting spot: ${error}");
    return false;
  }

}


/**
 * Generate a unique ID for a new spot
 */
export function generateSpotId(): string {
  return `spot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

}

