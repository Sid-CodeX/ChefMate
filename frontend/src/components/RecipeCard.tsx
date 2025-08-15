import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, CheckCircle } from 'lucide-react';

const FALLBACK_IMAGE_URL = '/placeholder.svg';

interface RecipeCardDisplayProps {
  id: number;
  title: string;
  image: string;
  cookTime: string;
  difficulty: string;
  tags: string[];
  description: string;
  diet: string;
  course: string;
  flavorProfile: string;
  region: string;
  ingredients: string[];
  steps?: string[];
  prepTime?: number;
}

interface RecipeCardProps {
  recipe: RecipeCardDisplayProps;
  onClick?: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: (recipeId: number, isFavorited: boolean) => void;
  isCooked?: boolean;
}

const RecipeCard = React.memo(({ recipe, onClick, isFavorited = false, onFavoriteToggle, isCooked = false }: RecipeCardProps) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [recipe.image]);

  const handleClick = React.useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(recipe.id, isFavorited);
  }, [onFavoriteToggle, recipe.id, isFavorited]);

  return (
    <Card
      className="bg-[#2a2f45] border-gray-700 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        {recipe.image && !imageError && (
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        )}
        
        {/* FIX: Moved the Cooked Badge to the top-right */}
        {isCooked && (
          <div className="absolute top-2 right-2 bg-green-600/90 px-2 py-1 rounded-full text-sm font-medium text-white flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Cooked</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-orange-300 transition-colors duration-200">
            {recipe.title}
          </h3>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
          <span>⏰ {recipe.cookTime}</span>
          <span>📊 {recipe.difficulty}</span>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
          {recipe.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors duration-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Link to={`/recipe/${recipe.id}`} className="flex-1">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30">
              View Recipe 👁️‍🗨️
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleFavoriteClick}
            className={`border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-200 ${
              isFavorited
                ? 'text-red-500 hover:text-red-600 border-red-500'
                : 'hover:text-red-400 hover:border-red-400'
            }`}
          >
            <Heart className={isFavorited ? 'fill-red-500' : 'fill-none'} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;