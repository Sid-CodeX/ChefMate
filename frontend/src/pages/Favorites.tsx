// Imports
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { favoritesService } from '@/services/favoritesService';

// Default fallback image
const FALLBACK_IMAGE_URL = '/placeholder.svg';

/**
 * Favorites Component
 * Displays and manages the user's favorite recipes.
 */
const Favorites = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch favorite recipes (enabled only when user is authenticated)
  const { data: favoriteRecipes, isLoading: favoritesLoading, isError: favoritesError, error: favoritesFetchError } = useQuery<Recipe[], Error>({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.token) return [];
      const fetchedFavorites = await favoritesService.getFavorites(user.token);
      return fetchedFavorites;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // Show error toast if fetching favorites fails
  useEffect(() => {
    if (favoritesError && favoritesFetchError) {
      toast({
        title: "Favorites Load Error",
        description: favoritesFetchError.message || "Could not retrieve your favorite recipes.",
        variant: "destructive",
      });
    }
  }, [favoritesError, favoritesFetchError, toast]);

  // Mutation: Add a recipe to favorites
  const addFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId: number) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.addToFavorites(recipeId, user.token);
    },
    onSuccess: (data, recipeId) => {
      queryClient.setQueryData<Recipe[]>(['favorites', user?.id], (old) => {
        const existing = old ? new Set(old.map(r => r.id)) : new Set();
        if (!existing.has(recipeId)) {
          return old ? [...old, { id: recipeId } as Recipe] : [{ id: recipeId } as Recipe];
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Added to Favorites!', description: 'Recipe successfully favorited.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Add', description: err.message || 'Could not add recipe to favorites.', variant: 'destructive' });
    },
  });

  // Mutation: Remove a recipe from favorites
  const removeFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId: number) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.removeFromFavorites(recipeId, user.token);
    },
    onSuccess: (data, recipeId) => {
      queryClient.setQueryData<Recipe[]>(['favorites', user?.id], (old) =>
        (old || []).filter(recipe => recipe.id !== recipeId)
      );
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Removed from Favorites', description: 'Recipe successfully unfavorited.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Remove', description: err.message || 'Could not remove recipe from favorites.', variant: 'destructive' });
    },
  });

  // Handle favorite toggle action from UI
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

  // Fallback to empty list if no data is loaded
  const recipesToDisplay: Recipe[] = favoriteRecipes || [];

  // Compute basic stats: total favorites, average cook time, and most popular tag
  const stats = useMemo(() => {
    const totalFavorites = recipesToDisplay.length;

    const totalCookTime = recipesToDisplay.reduce((sum, recipe) => {
      const cookTimeNum = parseInt(recipe.cook_time);
      return sum + (isNaN(cookTimeNum) ? 0 : cookTimeNum);
    }, 0);
    const avgCookTime = totalFavorites > 0 ? Math.round(totalCookTime / totalFavorites) : 0;

    const tagCounts: { [key: string]: number } = {};
    recipesToDisplay.forEach(recipe => {
      if (recipe.flavor_profile) {
        tagCounts[recipe.flavor_profile] = (tagCounts[recipe.flavor_profile] || 0) + 1;
      }
      if (recipe.course) {
        tagCounts[recipe.course] = (tagCounts[recipe.course] || 0) + 1;
      }
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

  // Loading UI while fetching or mutating
  if (authLoading || favoritesLoading || addFavoriteMutation.isPending || removeFavoriteMutation.isPending) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center text-white">
        Loading your favorites...
      </div>
    );
  }

  // Error fallback UI
  if (favoritesError) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center text-red-400">
        <p>Error: {favoritesFetchError?.message || "Failed to load favorites."}</p>
      </div>
    );
  }

  // Render UI
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
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

      {/* Favorite Recipes Grid */}
      {recipesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipesToDisplay.map((recipe) => {
            const ingredientsArrayForCard = recipe.ingredients
              ? recipe.ingredients.split(',').map(item => item.trim())
              : [];

            const cookTimeNumber = parseInt(recipe.cook_time);

            return (
              <RecipeCard
                key={recipe.id}
                recipe={{
                  id: recipe.id,
                  title: recipe.name,
                  image: recipe.img_url || FALLBACK_IMAGE_URL,
                  cookTime: `${cookTimeNumber} mins`,
                  difficulty: recipe.difficulty,
                  tags: [recipe.flavor_profile, recipe.course],
                  rating: 4.5,
                  description: ingredientsArrayForCard.join(', '),
                  course: recipe.course,
                  flavorProfile: recipe.flavor_profile,
                  diet: recipe.diet,
                  region: recipe.region,
                  ingredients: ingredientsArrayForCard,
                  steps: recipe.instruction ? recipe.instruction.split('\r\n').map(step => step.trim()).filter(step => step.length > 0) : [],
                  prepTime: parseInt(recipe.prep_time)
                }}
                isFavorited={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            );
          })}
        </div>
      ) : (
        // Empty state
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
