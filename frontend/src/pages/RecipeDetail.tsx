// React & Routing
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, ChefHat, MapPin, Utensils, Share2, Sparkles } from "lucide-react";
import CookingBox from "@/components/CookingBox";

// Hooks & Types
import { useToast } from "@/hooks/use-toast";
import { Recipe } from '@/types/recipe';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FALLBACK_IMAGE_URL = '/placeholder.svg';

/**
 * Displays detailed information for a single recipe.
 * Includes loading state, error handling, share, and rewrite features.
 */
const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCookingMode, setShowCookingMode] = useState(false);

  // Fetch recipe by ID on component mount or ID change
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Recipe ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
        const data = await response.json();

        if (response.ok) {
          setRecipe(data.recipe);
        } else {
          setError(data.message || "Failed to load recipe details.");
          toast({
            title: "Recipe Load Failed",
            description: data.message || "Could not retrieve recipe details.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error. Please check your connection.");
        toast({
          title: "Network Error",
          description: "Failed to connect to the recipe service.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, toast]);

  /**
   * Copies formatted recipe details to clipboard.
   */
  const handleShareRecipe = async () => {
    if (!recipe) {
      toast({
        title: "No Recipe to Share",
        description: "Please wait for the recipe to load.",
        variant: "destructive",
      });
      return;
    }

    const ingredientsArray = recipe.ingredients
      ? recipe.ingredients.split(',').map(ing => ing.trim())
      : [];

    const stepsArray = recipe.instruction
      ? recipe.instruction.split('\r\n').map(step => step.trim()).filter(Boolean)
      : [];

    const recipeText = `
🍽️ ${recipe.name}

📋 Ingredients:
${ingredientsArray.map(ing => `• ${ing}`).join('\n')}

👨‍🍳 Cooking Steps:
${stepsArray.map((step, i) => `${i + 1}. ${step}`).join('\n')}

⏱️ Prep Time: ${recipe.prep_time} min | Cook Time: ${recipe.cook_time} min
🥗 Diet: ${recipe.diet}
📍 Origin: ${recipe.state}, ${recipe.region}
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      toast({
        title: "Recipe Copied!",
        description: "Details copied to clipboard for sharing.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy recipe. Try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Navigates to AI-based recipe customizer with pre-filled content.
   */
  const handleRewriteRecipe = () => {
    if (!recipe) {
      toast({
        title: "Recipe Not Loaded",
        description: "Please wait for the recipe to load.",
        variant: "destructive",
      });
      return;
    }

    const formattedRecipeContent = `
${recipe.name}

Ingredients:
${recipe.ingredients.split(',').map(ing => `• ${ing.trim()}`).join('\n')}

Instructions:
${recipe.instruction.split('\r\n').map((step, i) => `${i + 1}. ${step.trim()}`).filter(Boolean).join('\n')}

Prep: ${recipe.prep_time} min | Cook: ${recipe.cook_time} min
    `.trim();

    navigate('/recipe-customizer', {
      state: {
        originalRecipeContent: formattedRecipeContent,
        originalRecipeName: recipe.name,
      },
    });
  };

  // Loading State UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white">Loading recipe...</p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // No Recipe Found UI
  if (!recipe) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Recipe not found.</p>
        </div>
      </div>
    );
  }

  // Parse data for rendering
  const ingredientsForDisplay = recipe.ingredients
    ? recipe.ingredients.split(',').map(item => item.trim())
    : [];

  const stepsForDisplay = recipe.instruction
    ? recipe.instruction.split('\r\n').map(step => step.trim()).filter(Boolean)
    : [];

  const prepTimeNum = parseInt(recipe.prep_time);
  const cookTimeNum = parseInt(recipe.cook_time);
  const totalTimeNum = parseInt(recipe.total_time);

  return (
    <div className="space-y-6 p-4">

      {/* Navigation & Action Buttons */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button
            onClick={handleShareRecipe}
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 text-white hover:bg-orange-500 hover:border-orange-500"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleRewriteRecipe}
            variant="outline"
            size="sm"
            className="bg-orange-600 border-orange-500 text-white hover:bg-orange-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Rewrite Recipe
          </Button>
        </div>
      </div>

      {/* Recipe Header with Image and Metadata */}
      <Card className="bg-[#2c2f3d] border-gray-700">
        <div className="relative">
          <img
            src={recipe.img_url || FALLBACK_IMAGE_URL}
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

      {/* Recipe Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Time & Location Info */}
        <div className="space-y-6">
          <Card className="bg-[#2c2f3d] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recipe Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<Clock className="h-4 w-4 text-blue-400" />} label="Prep Time" value={`${prepTimeNum} min`} />
              <InfoRow icon={<ChefHat className="h-4 w-4 text-green-400" />} label="Cook Time" value={`${cookTimeNum} min`} />
              <InfoRow icon={<MapPin className="h-4 w-4 text-red-400" />} label="Origin" value={`${recipe.state}, ${recipe.region}`} />
              <InfoRow icon={<Utensils className="h-4 w-4 text-yellow-400" />} label="Total Time" value={`${totalTimeNum} min`} />
            </CardContent>
          </Card>

          {/* Cooking Mode Toggle */}
          <Button
            onClick={() => setShowCookingMode(!showCookingMode)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
          >
            {showCookingMode ? "Hide Cooking Mode" : "🍳 Start Cooking"}
          </Button>
        </div>

        {/* Right Column - Ingredients List */}
        <Card className="bg-[#2c2f3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ingredientsForDisplay.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cooking Mode UI */}
      {showCookingMode && (
        <CookingBox
          steps={stepsForDisplay}
          totalCookTime={cookTimeNum}
          title={recipe.name}
          onExit={() => setShowCookingMode(false)}
        />
      )}

      {/* Cooking Steps */}
      <Card className="bg-[#2c2f3d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Cooking Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 list-decimal list-inside">
            {stepsForDisplay.map((step, index) => (
              <li key={index} className="text-gray-300 leading-relaxed">
                <span className="font-semibold text-white mr-1">Step {index + 1}:</span> {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component to render rows in the recipe info card
const InfoRow = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2 text-gray-300">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default RecipeDetail;
