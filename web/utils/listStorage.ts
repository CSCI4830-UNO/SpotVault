// List Storage - Handles saving and loading lists
// Currently uses browser localStorage (data stays in browser only)

import { SpotList } from "@/types/list";

const STORAGE_KEY = "spotvault_lists";

/**
 * Get all lists from storage
 */
export async function getAllLists(userId: string): Promise<SpotList[]> {
  try {
    // Make API call
    const response = await fetch(`/api/lists?query_userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lists = await response.json();
    //local caching.
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    }
    return lists;
  } catch (error) {
    console.error("Error saving list to storage:", error);
    //in case of error, pull from storage.
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    //worst case (offline & no api) just load an empty list ig...
    return [];
  }
}
export function saveList(listId: string): void {

}


/**
 * Delete a list from storage
 */
export function deleteList(listId: string): void {
}

/**
 * Get a single list by ID
 */
export function getListById(listId: string): SpotList | null {
}

/**
 * Generate a unique ID for a new list
 */
export function generateListId(): string {
}

