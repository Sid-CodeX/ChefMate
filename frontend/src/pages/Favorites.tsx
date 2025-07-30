// Core imports
import React, { useEffect, useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { favoritesService } from '@/services/favoritesService';

// Fallback image for missing recipe images
const FALLBACK_IMAGE_URL = '/placeholder.svg';

/**
 * Favorites Page
 * Displays user's favorite recipes with stats and handles favorite toggle.
 */
export const Favorites = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's favorite recipes
  const {
    data: favoriteRecipes,
    isLoading: favoritesLoading,
    isError: favoritesError,
    error: favoritesFetchError
  } = useQuery<Recipe[], Error>({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.token) return [];
      const fetchedFavorites = await favoritesService.getFavorites(user.token);
      return Array.isArray(fetchedFavorites) ? fetchedFavorites : [];
    },
    enabled: !!user?.id,
    staleTime: 0
  });

  // Show toast on fetch error
  useEffect(() => {
    if (favoritesError && favoritesFetchError) {
      toast({
        title: "Favorites Load Error",
        description: favoritesFetchError.message || "Could not retrieve your favorite recipes.",
        variant: "destructive",
      });
    }
  }, [favoritesError, favoritesFetchError, toast]);

  // Mutation to add a recipe to favorites
  const addFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.addToFavorites(recipeId, user.token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Added to Favorites!', description: 'Recipe successfully favorited.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Add', description: err.message || 'Could not add recipe to favorites.', variant: 'destructive' });
    },
  });

  // Mutation to remove a recipe from favorites
  const removeFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.removeFromFavorites(recipeId, user.token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Removed from Favorites', description: 'Recipe successfully unfavorited.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Remove', description: err.message || 'Could not remove recipe from favorites.', variant: 'destructive' });
    },
  });

  // Toggle favorite status
  const handleFavoriteToggle = useCallback(async (recipeId: number, isFavorited: boolean) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to manage favorites.', variant: 'destructive' });
      return;
    }
    if (isFavorited) {
      await removeFavoriteMutation.mutateAsync(recipeId);
    } else {
      await addFavoriteMutation.mutateAsync(recipeId);
    }
  }, [user, addFavoriteMutation, removeFavoriteMutation, toast]);

  // Safely fallback to empty array
  const recipesToDisplay: Recipe[] = Array.isArray(favoriteRecipes) ? favoriteRecipes : [];

  // Compute stats: total count, average cook time, most common tag
  const stats = useMemo(() => {
    const totalFavorites = recipesToDisplay.length;

    const totalCookTime = recipesToDisplay.reduce((sum, recipe) => {
      const cookTime = parseInt(recipe.cook_time);
      return sum + (isNaN(cookTime) ? 0 : cookTime);
    }, 0);

    const avgCookTime = totalFavorites > 0 ? Math.round(totalCookTime / totalFavorites) : 0;

    const tagCounts: Record<string, number> = {};
    recipesToDisplay.forEach(recipe => {
      if (recipe.flavor_profile) tagCounts[recipe.flavor_profile] = (tagCounts[recipe.flavor_profile] || 0) + 1;
      if (recipe.course) tagCounts[recipe.course] = (tagCounts[recipe.course] || 0) + 1;
    });

    let mostPopularTag = 'N/A';
    let maxCount = 0;
    for (const tag in tagCounts) {
      if (tagCounts[tag] > maxCount) {
        maxCount = tagCounts[tag];
        mostPopularTag = tag;
      }
    }

    return { totalFavorites, avgCookTime, mostPopularTag };
  }, [recipesToDisplay]);

  // Loading state
  if (authLoading || favoritesLoading || addFavoriteMutation.isPending || removeFavoriteMutation.isPending) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center text-white">
        Loading your favorites...
      </div>
    );
  }

  // Error state
  if (favoritesError) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center text-red-400">
        <p>Error: {favoritesFetchError?.message || "Failed to load favorites."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>
        <p className="text-gray-300">Your saved recipes - ready to cook anytime! ❤️</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Favorites</p>
              <p className="text-2xl font-bold text-white">{stats.totalFavorites}</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Cook Time</p>
              <p className="text-2xl font-bold text-white">{stats.avgCookTime} min</p>
            </div>
            <div className="text-2xl text-gray-400">⏰</div>
          </div>
        </div>
        <div className="bg-[#2a2f45] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Most Popular Tag</p>
              <p className="text-2xl font-bold text-white">{stats.mostPopularTag}</p>
            </div>
            <div className="text-2xl text-gray-400">🏷️</div>
          </div>
        </div>
      </div>

      {/* Favorite Recipes List */}
      {recipesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipesToDisplay.map((recipe) => {
            const ingredientsArray = recipe.ingredients
              ? recipe.ingredients.split(',').map(item => item.trim())
              : [];

            return (
              <RecipeCard
                key={recipe.id}
                recipe={{
                  id: recipe.id,
                  title: recipe.name,
                  image: recipe.img_url || FALLBACK_IMAGE_URL,
                  cookTime: `${parseInt(recipe.cook_time)} mins`,
                  difficulty: recipe.difficulty,
                  tags: [recipe.flavor_profile, recipe.course].filter(Boolean) as string[],
                  rating: 4.5,
                  description: ingredientsArray.join(', '),
                  course: recipe.course,
                  flavorProfile: recipe.flavor_profile,
                  diet: recipe.diet,
                  region: recipe.region,
                  ingredients: ingredientsArray,
                  steps: recipe.instruction
                    ? recipe.instruction.split('\r\n').map(s => s.trim()).filter(Boolean)
                    : [],
                  prepTime: parseInt(recipe.prep_time)
                }}
                isFavorited={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            );
          })}
        </div>
      ) : (
        // Empty state UI
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