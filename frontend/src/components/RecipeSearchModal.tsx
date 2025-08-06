import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RecipePagination from "@/components/RecipePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipeService';
import { useToast } from '@/hooks/use-toast';

interface RecipeForSelection {
    id: number;
    name: string;
    prep_time: string;
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
    img_url?: string;
}

interface RecipeSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRecipe: (recipe: RecipeForSelection) => void;
}

const RECIPES_PER_PAGE = 6;

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

                {/* Updated section to display recipe names directly */}
                {!isLoading && !isError && paginatedRecipes.length > 0 && (
                    <div className="space-y-2 max-h-[calc(80vh-200px)] overflow-y-auto pr-2">
                        {paginatedRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                onClick={() => handleSelectRecipeForPlan(recipe)}
                                className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                            >
                                <h4 className="font-semibold text-white">{recipe.name}</h4>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Original pagination component remains */}
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