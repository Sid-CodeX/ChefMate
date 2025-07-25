// React and core libraries
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import RecipePagination from "@/components/RecipePagination";
import FilterDropdown from "@/components/FilterDropdown";

// Hooks and services
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { recipeService } from '@/services/recipeService';
import { favoritesService } from '@/services/favoritesService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Types
import { Recipe } from '../types/recipe';

// Lazy-loaded component
const CookingBox = React.lazy(() => import("@/components/CookingBox"));

// Filter type for dropdowns and API filters
export interface FilterOptions {
  diet: string[];
  course: string[];
  flavorProfile: string[];
  difficulty: string[];
  region: string[];
}

// Recipe shape for CookingBox and RecipeModal
interface CookableRecipeDisplayProps {
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
  diet: string;
  region: string;
  ingredients: string[];
  steps: string[];
}

const RECIPES_PER_PAGE = 6;
const FALLBACK_IMAGE_URL = '/placeholder.svg';

/**
 * Dashboard Component
 * Handles recipe listing with search, filters, pagination, modals, and cooking view.
 */
const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [selectedRecipeForCooking, setSelectedRecipeForCooking] = useState<CookableRecipeDisplayProps | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    diet: [],
    course: [],
    flavorProfile: [],
    difficulty: [],
    region: []
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch all recipes based on search or filters
  const { data: recipes, isLoading, isError, error } = useQuery<Recipe[], Error>({
    queryKey: ['recipes', debouncedSearchQuery, filters],
    queryFn: async () => {
      if (debouncedSearchQuery) return recipeService.searchRecipes(debouncedSearchQuery);
      if (Object.values(filters).some(f => f.length > 0)) return recipeService.filterRecipes(filters);
      return recipeService.getAllRecipes();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Show toast on error
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Recipe Fetch Error",
        description: error.message || "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Fetch user's favorite recipe IDs
  const { data: favoritedRecipeIds, isLoading: favoritesLoading } = useQuery<Set<number>, Error>({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.token) return new Set();
      try {
        const favorites = await favoritesService.getFavorites(user.token);
        return Array.isArray(favorites) ? new Set(favorites.map(fav => fav.id)) : new Set();
      } catch {
        return new Set();
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Add recipe to favorites
  const addFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.addToFavorites(recipeId, user.token);
    },
    onSuccess: (_, recipeId) => {
      queryClient.setQueryData<Set<number>>(['favorites', user?.id], (old) => {
        const newSet = new Set(old || []);
        newSet.add(recipeId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Added to Favorites!', description: 'Recipe successfully favorited.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Add', description: err.message, variant: 'destructive' });
    },
  });

  // Remove recipe from favorites
  const removeFavoriteMutation = useMutation<void, Error, number>({
    mutationFn: async (recipeId) => {
      if (!user?.token) throw new Error('Not authenticated.');
      await favoritesService.removeFromFavorites(recipeId, user.token);
    },
    onSuccess: (_, recipeId) => {
      queryClient.setQueryData<Set<number>>(['favorites', user?.id], (old) => {
        const newSet = new Set(old || []);
        newSet.delete(recipeId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({ title: 'Removed from Favorites', description: 'Recipe removed from favorites.' });
    },
    onError: (err) => {
      toast({ title: 'Failed to Remove', description: err.message, variant: 'destructive' });
    },
  });

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(async (recipeId: number, isFavorited: boolean) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to manage favorites.', variant: 'destructive' });
      return;
    }
    isFavorited
      ? await removeFavoriteMutation.mutateAsync(recipeId)
      : await addFavoriteMutation.mutateAsync(recipeId);
  }, [user, toast]);

  // Memoized recipe pagination
  const { filteredRecipes, totalPages, paginatedRecipes } = useMemo(() => {
    const allRecipes = Array.isArray(recipes) ? recipes : [];
    const totalPages = Math.ceil(allRecipes.length / RECIPES_PER_PAGE);
    const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
    return {
      filteredRecipes: allRecipes,
      totalPages,
      paginatedRecipes: allRecipes.slice(startIndex, startIndex + RECIPES_PER_PAGE)
    };
  }, [recipes, currentPage]);

  // Reset pagination when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filters]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ diet: [], course: [], flavorProfile: [], difficulty: [], region: [] });
    setSearchQuery('');
  }, []);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  }, []);

  const handleStartCooking = useCallback((recipe: Recipe) => {
    const ingredients = recipe.ingredients?.split(',').map(i => i.trim()) || [];
    const steps = recipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [];
    setSelectedRecipeForCooking({
      id: recipe.id,
      title: recipe.name,
      image: recipe.img_url || FALLBACK_IMAGE_URL,
      prepTime: parseInt(recipe.prep_time),
      cookTime: parseInt(recipe.cook_time),
      difficulty: recipe.difficulty,
      tags: [recipe.flavor_profile, recipe.course].filter(Boolean) as string[],
      rating: 4.5,
      description: ingredients.join(', '),
      course: recipe.course,
      flavorProfile: recipe.flavor_profile,
      diet: recipe.diet,
      region: recipe.region,
      ingredients,
      steps,
    });
    setShowCookingMode(true);
    setSelectedRecipe(null);
  }, []);

  const handleCloseCookingMode = useCallback(() => {
    setShowCookingMode(false);
    setSelectedRecipeForCooking(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (
    isLoading || favoritesLoading ||
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending ||
    !(favoritedRecipeIds instanceof Set)
  ) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[500px]">
        <p className="text-white">Loading recipes and favorites...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 text-center text-red-400">
        <p>Error: {error?.message || "Failed to load recipes."}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Explore Our Delicious Recipes 🍽️</h1>
        <p className="text-gray-400">Discover new and exciting recipes to try in your kitchen.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <div className="flex items-center flex-1">
          <Input
            type="text"
            placeholder="Search for recipes..."
            className="bg-[#1e1e2f] border-gray-600 text-white placeholder-gray-400 shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" className="p-3 -ml-10 text-gray-400 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <FilterDropdown filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
      </div>

      {/* Filter result info */}
      {(debouncedSearchQuery || Object.values(filters).some(f => f.length > 0)) && (
        <div className="text-center text-gray-400 text-sm">
          Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
        </div>
      )}

      {/* Recipe List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRecipes.map((recipe) => {
          const ingredientsArray = recipe.ingredients?.split(',').map(item => item.trim()) || [];
          const isFavorited = favoritedRecipeIds.has(recipe.id);
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
                steps: recipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [],
                prepTime: parseInt(recipe.prep_time)
              }}
              onClick={() => handleRecipeClick(recipe)}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            />
          );
        })}

        {paginatedRecipes.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-400">No recipes found matching your criteria.</p>
            <Button asChild className="mt-4">
              <Link to="/recipe-customizer">Try the AI Recipe Customizer</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <RecipePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={{
            id: selectedRecipe.id,
            title: selectedRecipe.name,
            image: selectedRecipe.img_url || FALLBACK_IMAGE_URL,
            prepTime: parseInt(selectedRecipe.prep_time),
            cookTime: parseInt(selectedRecipe.cook_time),
            difficulty: selectedRecipe.difficulty,
            tags: [selectedRecipe.flavor_profile, selectedRecipe.course].filter(Boolean) as string[],
            rating: 4.5,
            description: selectedRecipe.ingredients?.split(',').map(item => item.trim()).join(', ') || '',
            course: selectedRecipe.course,
            flavorProfile: selectedRecipe.flavor_profile,
            diet: selectedRecipe.diet,
            region: selectedRecipe.region,
            ingredients: selectedRecipe.ingredients?.split(',').map(item => item.trim()) || [],
            steps: selectedRecipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [],
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStartCooking={() => selectedRecipe && handleStartCooking(selectedRecipe)}
        />
      )}

      {/* Cooking Mode */}
      {showCookingMode && selectedRecipeForCooking && (
        <React.Suspense fallback={<div>Loading cooking mode...</div>}>
          <CookingBox
            steps={selectedRecipeForCooking.steps}
            totalCookTime={selectedRecipeForCooking.cookTime}
            title={selectedRecipeForCooking.title}
            onExit={handleCloseCookingMode}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default Dashboard;
