
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

const Favorites = () => {
  // Mock favorite recipes data - in real app this would come from state/API
  const [favoriteRecipes] = useState([
    {
      id: 1,
      title: "Mediterranean Quinoa Bowl",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      cookTime: "25 min",
      difficulty: "Easy",
      tags: ["Healthy", "Vegetarian", "Mediterranean"],
      rating: 4.8,
      description: "A nutritious and colorful quinoa bowl with fresh vegetables, feta cheese, and a zesty lemon dressing."
    },
    {
      id: 2,
      title: "Spicy Thai Basil Chicken",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      cookTime: "20 min",
      difficulty: "Medium",
      tags: ["Spicy", "Thai", "Quick"],
      rating: 4.9,
      description: "Authentic Thai stir-fry with tender chicken, aromatic basil, and a perfect balance of sweet and spicy flavors."
    },
    {
      id: 3,
      title: "Classic Beef Bolognese",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
      cookTime: "45 min",
      difficulty: "Medium",
      tags: ["Italian", "Comfort Food", "Pasta"],
      rating: 4.7,
      description: "Rich and hearty traditional Italian meat sauce slow-cooked to perfection with fresh herbs and tomatoes."
    },
    {
      id: 4,
      title: "Avocado Toast Deluxe",
      image: "https://images.unsplash.com/photo-1541519869434-d3d9f32977c3?w=400",
      cookTime: "10 min",
      difficulty: "Easy",
      tags: ["Breakfast", "Healthy", "Quick"],
      rating: 4.5,
      description: "Elevated avocado toast with poached egg, cherry tomatoes, and everything bagel seasoning."
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>
        <p className="text-gray-300">
          Your saved recipes - ready to cook anytime! ❤️
        </p>
      </div>

      {/* Favorites Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Favorites</p>
              <p className="text-2xl font-bold text-white">{favoriteRecipes.length}</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Cook Time</p>
              <p className="text-2xl font-bold text-white">25 min</p>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>
        
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Most Popular Tag</p>
              <p className="text-2xl font-bold text-white">Healthy</p>
            </div>
            <div className="text-2xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No favorites yet</h3>
          <p className="text-gray-500">
            Start exploring recipes and save your favorites by clicking the ❤️ button!
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
