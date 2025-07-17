
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, ChefHat, MapPin, Utensils, Share2 } from "lucide-react";
import CookingBox from "@/components/CookingBox";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: number;
  name: string;
  img_url: string;
  ingredients: string[];
  diet: 'Vegetarian' | 'Non-Vegetarian';
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
  steps: string[];
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showCookingMode, setShowCookingMode] = useState(false);

  // Mock recipe data - in real app, this would be fetched from backend
  useEffect(() => {
    const mockRecipes: Recipe[] = [
      {
        id: 1,
        name: "Butter Chicken",
        img_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
        ingredients: ["2 lbs chicken breast", "1 cup heavy cream", "2 tbsp butter", "1 onion, diced", "3 cloves garlic", "1 tbsp garam masala", "1 can tomato sauce", "Salt to taste"],
        diet: "Non-Vegetarian",
        prep_time: 20,
        cook_time: 30,
        flavor_profile: "Mild & Creamy",
        course: "Main Course",
        state: "Punjab",
        region: "North India",
        steps: [
          "Marinate chicken with spices for 30 minutes",
          "Heat butter in a pan and cook chicken until golden",
          "Remove chicken and sauté onions and garlic",
          "Add tomato sauce and cream, simmer for 10 minutes",
          "Return chicken to sauce and cook for 15 minutes",
          "Garnish with fresh cilantro and serve hot"
        ]
      },
      {
        id: 2,
        name: "Spicy Thai Basil Chicken",
        img_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        ingredients: ["1 lb ground chicken", "3 Thai chilies", "4 cloves garlic", "1 cup Thai basil", "2 tbsp fish sauce", "1 tbsp oyster sauce", "1 tbsp sugar", "2 tbsp oil"],
        diet: "Non-Vegetarian",
        prep_time: 15,
        cook_time: 20,
        flavor_profile: "Spicy",
        course: "Main Course",
        state: "International",
        region: "Southeast Asia",
        steps: [
          "Heat oil in wok over high heat",
          "Add minced garlic and chilies, stir-fry for 30 seconds",
          "Add ground chicken and cook until no longer pink",
          "Add fish sauce, oyster sauce, and sugar",
          "Stir in Thai basil leaves until wilted",
          "Serve immediately over rice"
        ]
      },
      {
        id: 3,
        name: "Classic Beef Bolognese",
        img_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
        ingredients: ["1 lb ground beef", "1 onion diced", "2 carrots diced", "2 celery stalks", "4 cloves garlic", "1 can crushed tomatoes", "1/2 cup red wine", "2 tbsp tomato paste"],
        diet: "Non-Vegetarian",
        prep_time: 20,
        cook_time: 45,
        flavor_profile: "Rich & Savory",
        course: "Main Course",
        state: "International",
        region: "Europe",
        steps: [
          "Heat oil and sauté onions, carrots, and celery until soft",
          "Add garlic and cook for 1 minute",
          "Add ground beef and cook until browned",
          "Stir in tomato paste and cook for 2 minutes",
          "Add wine and let it reduce by half",
          "Add crushed tomatoes and simmer for 45 minutes"
        ]
      },
      {
        id: 4,
        name: "Avocado Toast Deluxe",
        img_url: "https://images.unsplash.com/photo-1541519869434-d3d9f32977c3?w=800",
        ingredients: ["2 slices sourdough bread", "1 ripe avocado", "2 eggs", "Cherry tomatoes", "Everything bagel seasoning", "Olive oil", "Salt and pepper", "Lemon juice"],
        diet: "Vegetarian",
        prep_time: 5,
        cook_time: 10,
        flavor_profile: "Fresh & Light",
        course: "Breakfast",
        state: "International",
        region: "Modern",
        steps: [
          "Toast bread slices until golden brown",
          "Mash avocado with lemon juice, salt, and pepper",
          "Poach eggs in simmering water for 3-4 minutes",
          "Spread avocado mixture on toast",
          "Top with poached egg and cherry tomatoes",
          "Sprinkle with everything bagel seasoning"
        ]
      }
    ];

    const foundRecipe = mockRecipes.find(r => r.id === parseInt(id || '0'));
    setRecipe(foundRecipe || null);
  }, [id]);

  const handleShareRecipe = async () => {
    if (!recipe) return;

    const recipeText = `
🍽️ ${recipe.name}

📋 Ingredients:
${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}

👨‍🍳 Cooking Steps:
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

⏱️ Prep Time: ${recipe.prep_time} min | Cook Time: ${recipe.cook_time} min
🥗 Diet: ${recipe.diet}
📍 Origin: ${recipe.state}, ${recipe.region}
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      toast({
        title: "Recipe copied to clipboard ✅",
        description: "Share it with your friends!",
      });
    } catch (err) {
      toast({
        title: "Failed to copy recipe",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!recipe) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Recipe not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
        <Button onClick={handleShareRecipe} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Share2 className="h-4 w-4 mr-2" />
          Share Recipe
        </Button>
      </div>

      {/* Recipe Header */}
      <Card className="bg-[#2c2f3d] border-gray-700">
        <div className="relative">
          <img 
            src={recipe.img_url} 
            alt={recipe.name}
            className="w-full h-64 md:h-80 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={recipe.diet === 'Vegetarian' ? 'secondary' : 'destructive'} className="text-sm">
                {recipe.diet}
              </Badge>
              <Badge variant="outline" className="text-sm text-gray-300 border-gray-500">
                {recipe.course}
              </Badge>
              <Badge variant="outline" className="text-sm text-orange-300 border-orange-500">
                {recipe.flavor_profile}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recipe Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-6">
          {/* Time & Location Info */}
          <Card className="bg-[#2c2f3d] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recipe Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Prep Time</span>
                </div>
                <span className="text-white font-medium">{recipe.prep_time} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-300">
                  <ChefHat className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Cook Time</span>
                </div>
                <span className="text-white font-medium">{recipe.cook_time} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-sm">Origin</span>
                </div>
                <span className="text-white font-medium">{recipe.state}, {recipe.region}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Utensils className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Total Time</span>
                </div>
                <span className="text-white font-medium">{recipe.prep_time + recipe.cook_time} min</span>
              </div>
            </CardContent>
          </Card>

          {/* Start Cooking Button */}
          <Button 
            onClick={() => setShowCookingMode(!showCookingMode)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
          >
            {showCookingMode ? "Hide Cooking Mode" : "🍳 Start Cooking"}
          </Button>
        </div>

        {/* Right Column - Ingredients */}
        <Card className="bg-[#2c2f3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cooking Mode */}
      {showCookingMode && (
        <CookingBox 
          steps={recipe.steps}
          totalCookTime={recipe.cook_time}
          title={recipe.name}
          onExit={() => setShowCookingMode(false)}
        />
      )}
    </div>
  );
};

export default RecipeDetail;
