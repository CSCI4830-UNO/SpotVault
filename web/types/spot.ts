// Spot Data Type - Defines what information a spot contains
// To add a new field: Add it here, then update the create/edit forms to include it

/**
 * Spot data model
 * Represents a location that users can save and manage
 */
export interface Spot {
  id: string;
  name: string;
  description?: string; // Optional field (the ? means it's optional)
  latitude?: number; // Location coordinates
  longitude?: number;
  photos?: string[]; // URLs or base64 strings for now (not implemented yet)
  createdAt: string; // When the spot was created
  updatedAt: string; // When the spot was last updated
}

