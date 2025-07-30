// frontend/src/types/recipe.d.ts

/**
 * Defines the structure of a Recipe object throughout the frontend application.
 * Aligns with the data model returned by the backend API.
 */
export interface Recipe {
  id: number;
  name: string;
  image_url: string;
  ingredients: string; // Corrected: backend sends as a single string
  diet: string;
  prep_time: string; // Corrected: backend sends as string
  cook_time: string; // Corrected: backend sends as string
  total_time: string; // Added and corrected: backend sends as string
  difficulty: string;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
  instruction: string; // Added: backend sends instruction
}