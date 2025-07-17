
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookTime: string;
  difficulty: string;
  tags: string[];
  rating: number;
  description: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard = React.memo(({ recipe, onClick }: RecipeCardProps) => {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <Card 
      className="bg-[#2a2f45] border-gray-700 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-sm font-medium text-white">
          ⭐ {recipe.rating}
        </div>
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
            <Badge key={index} variant="secondary" className="text-xs bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors duration-200">
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
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-red-400 hover:border-red-400 transition-all duration-200">
            ❤️
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;
