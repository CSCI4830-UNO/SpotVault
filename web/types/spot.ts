/**
 * Spot data model
 * Represents a location that users can save and manage
 */
export interface Spot {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[]; // URLs or base64 strings for now
  createdAt: string;
  updatedAt: string;
}

