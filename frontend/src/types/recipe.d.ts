// Defines the structure of a Recipe object
export interface Recipe {
    id: number;
    name: string;
    image_url: string;
    ingredients: string;
    diet: string;
    prep_time: string;
    cook_time: string;
    total_time: string;
    difficulty: string;
    flavor_profile: string;
    course: string;
    state: string;
    region: string;
    instruction: string;
    is_cooked: boolean; 
}