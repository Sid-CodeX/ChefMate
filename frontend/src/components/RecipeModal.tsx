
import React from 'react';
import { X, Clock, ChefHat, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Recipe {
  id: number;
  title: string;
  image: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  tags: string[];
  rating: number;
  description: string;
  course: string;
  flavorProfile: string;
  diet: 'Vegetarian' | 'Non-Vegetarian';
  region?: string;
  ingredients?: string[];
}

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCooking: () => void;
}

const RecipeModal = ({ recipe, isOpen, onClose, onStartCooking }: RecipeModalProps) => {
  if (!isOpen || !recipe) return null;

  const handleStartCooking = () => {
    onStartCooking();
    onClose();
  };

  // Mock ingredients if not provided
  const ingredients = recipe.ingredients || [
    "Main protein or base ingredient",
    "Spices and seasonings",
    "Fresh vegetables",
    "Cooking oil or butter",
    "Additional flavoring agents"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2a2f45] border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">{recipe.title}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⭐ {recipe.rating}</span>
              <Badge 
                variant="secondary" 
                className={`${
                  recipe.diet === 'Vegetarian' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {recipe.diet === 'Vegetarian' ? '🥬 Vegetarian' : '🍖 Non-Vegetarian'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Prep Time</p>
                <p className="font-medium text-white">{recipe.prepTime} min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ChefHat className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Cook Time</p>
                <p className="font-medium text-white">{recipe.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Utensils className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Total Time</p>
                <p className="font-medium text-white">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
            </div>
          </div>

          {/* Flavor Profile & Course */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-purple-300 border-purple-500">
              {recipe.flavorProfile}
            </Badge>
            <Badge variant="outline" className="text-blue-300 border-blue-500">
              {recipe.course}
            </Badge>
            <Badge variant="outline" className="text-gray-300 border-gray-500">
              {recipe.difficulty}
            </Badge>
            {recipe.region && (
              <Badge variant="outline" className="text-orange-300 border-orange-500">
                {recipe.region}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">About this recipe</h3>
            <p className="text-gray-300 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <span className="text-orange-400 mt-1 text-sm">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-500/20 text-orange-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Start Cooking Button */}
          <div className="pt-4 border-t border-gray-700">
            <Button 
              onClick={handleStartCooking}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30"
            >
              🍳 Start Cooking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
