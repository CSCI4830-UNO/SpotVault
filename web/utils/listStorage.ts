// List Storage - Handles saving and loading lists
// Currently uses browser localStorage (data stays in browser only)

import { SpotList } from "@/types/list";

const STORAGE_KEY = "spotvault_lists";

/**
 * Get all lists from storage
 */
export function getAllLists(): SpotList[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading lists from storage:", error);
    return [];
  }
}

/**
 * Save a list to storage
 */
export function saveList(list: SpotList): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const lists = getAllLists();
    const existingIndex = lists.findIndex((l) => l.id === list.id);

    if (existingIndex >= 0) {
      // Update existing list
      lists[existingIndex] = list;
    } else {
      // Add new list
      lists.push(list);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error("Error saving list to storage:", error);
  }
}

/**
 * Delete a list from storage
 */
export function deleteList(listId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const lists = getAllLists();
    const filtered = lists.filter((l) => l.id !== listId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting list from storage:", error);
  }
}

/**
 * Get a single list by ID
 */
export function getListById(listId: string): SpotList | null {
  const lists = getAllLists();
  return lists.find((l) => l.id === listId) || null;
}

/**
 * Generate a unique ID for a new list
 */
export function generateListId(): string {
  return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

