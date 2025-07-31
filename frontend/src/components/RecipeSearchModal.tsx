import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import RecipePagination from "@/components/RecipePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipeService';
import { useToast } from '@/hooks/use-toast';

interface RecipeForSelection {
  id: number;
  name: string;
  prep_time: string;
  img_url?: string;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  instruction: string;
  prep_time: string;
  cook_time: string;
  difficulty: string;
  cuisine?: string;
  course?: string;
  flavor_profile?: string;
  diet?: string;
  region?: string;
  image_url?: string;
  rating?: number;
}

interface RecipeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: RecipeForSelection) => void;
}

const RECIPES_PER_PAGE = 6;
const FALLBACK_IMAGE_URL = '/placeholder.svg';

const RecipeSearchModal: React.FC<RecipeSearchModalProps> = ({ isOpen, onClose, onSelectRecipe }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: recipes, isLoading, isError, error } = useQuery<Recipe[], Error>({
    queryKey: ['searchRecipes', debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery) {
        return recipeService.searchRecipes(debouncedSearchQuery);
      }
      return Promise.resolve([]);
    },
    enabled: isOpen && debouncedSearchQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const { paginatedRecipes, totalPages } = useMemo(() => {
    const allRecipes = Array.isArray(recipes) ? recipes : [];
    const totalPages = Math.ceil(allRecipes.length / RECIPES_PER_PAGE);
    const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
    return {
      paginatedRecipes: allRecipes.slice(startIndex, startIndex + RECIPES_PER_PAGE),
      totalPages,
    };
  }, [recipes, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectRecipeForPlan = (recipe: Recipe) => {
    onSelectRecipe({
      id: recipe.id,
      name: recipe.name,
      prep_time: recipe.prep_time || "N/A min",
      img_url: recipe.image_url
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto bg-[#1e1e2f] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Search Recipes to Add</DialogTitle>
          <DialogDescription className="text-gray-400">
            Find recipes to add to your meal plan by searching below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search recipes..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {debouncedSearchQuery.length === 0 && !isLoading && (
          <p className="text-center text-gray-400">Start typing to search for recipes.</p>
        )}
        {isLoading && debouncedSearchQuery.length > 0 && (
          <p className="text-center text-gray-400">Searching recipes...</p>
        )}
        {isError && debouncedSearchQuery.length > 0 && (
          <p className="text-center text-red-400">Error loading recipes: {error?.message}</p>
        )}
        {!isLoading && !isError && debouncedSearchQuery.length > 0 && paginatedRecipes.length === 0 && (
          <p className="text-center text-gray-400">No recipes found matching "{debouncedSearchQuery}".</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(80vh-200px)] overflow-y-auto pr-2">
          {!isLoading && !isError && paginatedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id,
                title: recipe.name,
                image: recipe.image_url || FALLBACK_IMAGE_URL,
                cookTime: `${parseInt(recipe.cook_time || '0')} mins`,
                difficulty: recipe.difficulty,
                tags: [recipe.flavor_profile, recipe.course].filter(Boolean) as string[],
                rating: recipe.rating || 4.5,
                description: recipe.description || '',
                course: recipe.course || '',
                flavorProfile: recipe.flavor_profile || '',
                diet: recipe.diet || '',
                region: recipe.region || '',
                ingredients: recipe.ingredients?.split(',').map(item => item.trim()) || [],
                steps: recipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [],
                prepTime: parseInt(recipe.prep_time || '0')
              }}
              onClick={() => handleSelectRecipeForPlan(recipe)}
              isFavorited={false}
              onFavoriteToggle={() => {}}
            />
          ))}
        </div>

        {!isLoading && !isError && paginatedRecipes.length > 0 && (
          <RecipePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSearchModal;
