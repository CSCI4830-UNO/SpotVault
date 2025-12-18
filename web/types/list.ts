import { Spot } from "./spot";

/**
 * List data model
 * Represents a collection of spots
 */
export interface SpotList {
  id: string;
  name: string;
  description?: string;
  spotIds: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  spots?: Spot[];
}

