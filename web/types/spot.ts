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
  tags?: string[];
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

