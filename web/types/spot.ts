/**
 * Comment data model
 * Represents a comment on a spot
 */
export interface Comment {
  id: string;
  text: string;
  username: string;
  createdAt: string;
}

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
  comments?: Comment[];
  listId?: string; // ID of the list this spot belongs to
  createdAt: string;
  updatedAt: string;
}

