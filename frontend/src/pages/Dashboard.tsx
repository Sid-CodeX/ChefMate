import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import RecipePagination from "@/components/RecipePagination";
import FilterDropdown from "@/components/FilterDropdown";

import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { recipeService } from '@/services/recipeService';
import { favoritesService } from '@/services/favoritesService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import { Recipe } from '../types/recipe';

const CookingBox = React.lazy(() => import("@/components/CookingBox"));

export interface FilterOptions {
    diet: string[];
    course: string[];
    flavorProfile: string[];
    difficulty: string[];
    region: string[];
}

interface CookableRecipeDisplayProps {
    id: number;
    title: string;
    image: string;
    prepTime: number;
    cookTime: number;
    difficulty: string;
    tags: string[];
    description: string;
    course: string;
    flavorProfile: string;
    diet: string;
    region: string;
    ingredients: string[];
    steps: string[];
    is_cooked: boolean;
}

const RECIPES_PER_PAGE = 6;
const FALLBACK_IMAGE_URL = '/placeholder.svg';

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

    const { data: recipes, isLoading, isError, error } = useQuery<Recipe[], Error>({
        queryKey: ['recipes', debouncedSearchQuery, filters, user?.token],
        queryFn: async () => {
            if (!user?.token) return [];
            if (debouncedSearchQuery) return recipeService.searchRecipes(debouncedSearchQuery, user.token);
            if (Object.values(filters).some(f => f.length > 0)) return recipeService.filterRecipes(filters, user.token);
            return recipeService.getAllRecipes(user.token);
        },
        enabled: !!user?.token,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (isError && error) {
            toast({
                title: "Recipe Fetch Error",
                description: error.message || "Failed to load recipes. Please try again.",
                variant: "destructive",
            });
        }
    }, [isError, error, toast]);

    const { data: favoritedRecipeIds, isLoading: favoritesLoading, refetch: refetchFavorites } = useQuery<Set<number>, Error>({
        queryKey: ['favorites', user?.id],
        queryFn: async () => {
            if (!user?.token) return new Set();
            try {
                const favorites = await favoritesService.getFavorites(user.token);
                if (Array.isArray(favorites)) {
                    if (favorites.length > 0 && typeof favorites[0] === 'object' && 'id' in favorites[0]) {
                        return new Set(favorites.map((fav: any) => fav.id));
                    }
                    return new Set(favorites);
                }
                return new Set();
            } catch (err) {
                return new Set();
            }
        },
        enabled: !!user?.id,
        staleTime: 0,
        initialData: new Set()
    });
    
    const addFavoriteMutation = useMutation<void, Error, number>({
        mutationFn: async (recipeId) => {
            if (!user?.token) throw new Error('Not authenticated.');
            await favoritesService.addToFavorites(recipeId, user.token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
            refetchFavorites();
            toast({ title: 'Added to Favorites!', description: 'Recipe successfully favorited.' });
        },
        onError: (err) => {
            toast({ title: 'Failed to Add', description: err.message, variant: 'destructive' });
        },
    });

    const removeFavoriteMutation = useMutation<void, Error, number>({
        mutationFn: async (recipeId) => {
            if (!user?.token) throw new Error('Not authenticated.');
            await favoritesService.removeFromFavorites(recipeId, user.token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
            refetchFavorites();
            toast({ title: 'Removed from Favorites', description: 'Recipe removed from favorites.' });
        },
        onError: (err) => {
            toast({ title: 'Failed to Remove', description: err.message, variant: 'destructive' });
        },
    });

    const handleFavoriteToggle = useCallback(async (recipeId: number, isFavorited: boolean) => {
        if (!user) {
            toast({ title: 'Authentication Required', description: 'Please log in to manage favorites.', variant: 'destructive' });
            return;
        }
        isFavorited
            ? await removeFavoriteMutation.mutateAsync(recipeId)
            : await addFavoriteMutation.mutateAsync(recipeId);
    }, [user, addFavoriteMutation, removeFavoriteMutation, toast]);

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
            image: recipe.image_url || FALLBACK_IMAGE_URL,
            prepTime: parseInt(recipe.prep_time),
            cookTime: parseInt(recipe.cook_time),
            difficulty: recipe.difficulty,
            tags: [recipe.flavor_profile, recipe.course].filter(Boolean) as string[],
            description: ingredients.join(', '),
            course: recipe.course,
            flavorProfile: recipe.flavor_profile,
            diet: recipe.diet,
            region: recipe.region,
            ingredients,
            steps,
            is_cooked: recipe.is_cooked || false
        });
        setShowCookingMode(true);
        setSelectedRecipe(null);
    }, []);

    const handleCloseCookingMode = useCallback(() => {
        setShowCookingMode(false);
        setSelectedRecipeForCooking(null);
        if (user?.id) {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    }, [user, queryClient]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (
        isLoading || favoritesLoading ||
        addFavoriteMutation.isPending || removeFavoriteMutation.isPending
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

    const safeFavoritedRecipeIds = favoritedRecipeIds instanceof Set ? favoritedRecipeIds : new Set();

    const paginatedRecipesWithStatus = paginatedRecipes.map(recipe => ({
        ...recipe,
        is_cooked: recipe.is_cooked || false
    }));

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Explore Our Delicious Recipes 🍽️</h1>
                <p className="text-gray-400">Discover new and exciting recipes to try in your kitchen.</p>
            </div>

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

            {(debouncedSearchQuery || Object.values(filters).some(f => f.length > 0)) && (
                <div className="text-center text-gray-400 text-sm">
                    Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                    {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRecipesWithStatus?.map((recipe) => {
                    const ingredientsArray = recipe.ingredients?.split(',').map(item => item.trim()) || [];
                    const isFavorited = safeFavoritedRecipeIds.has(recipe.id);
                    return (
                        <RecipeCard
                            key={recipe.id}
                            recipe={{
                                id: recipe.id,
                                title: recipe.name,
                                image: recipe.image_url || FALLBACK_IMAGE_URL,
                                cookTime: `${parseInt(recipe.cook_time)} mins`,
                                difficulty: recipe.difficulty,
                                tags: [recipe.flavor_profile, recipe.course].filter(Boolean) as string[],
                                description: ingredientsArray.join(', '),
                                course: recipe.course,
                                flavorProfile: recipe.flavor_profile,
                                diet: recipe.diet,
                                region: recipe.region,
                                ingredients: ingredientsArray,
                                steps: recipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [],
                                prepTime: parseInt(recipe.prep_time),
                            }}
                            onClick={() => handleRecipeClick(recipe)}
                            isFavorited={isFavorited}
                            onFavoriteToggle={handleFavoriteToggle}
                            isCooked={recipe.is_cooked}
                        />
                    );
                })}

                {paginatedRecipesWithStatus?.length === 0 && (
                    <div className="text-center py-12 col-span-full">
                        <p className="text-gray-400">No recipes found matching your criteria.</p>
                        <Button asChild className="mt-4">
                            <Link to="/recipe-customizer">Try the AI Recipe Customizer</Link>
                        </Button>
                    </div>
                )}
            </div>

            <RecipePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            {selectedRecipe && (
                <RecipeModal
                    recipe={{
                        id: selectedRecipe.id,
                        title: selectedRecipe.name,
                        image: selectedRecipe.image_url || FALLBACK_IMAGE_URL,
                        prepTime: parseInt(selectedRecipe.prep_time),
                        cookTime: parseInt(selectedRecipe.cook_time),
                        difficulty: selectedRecipe.difficulty,
                        tags: [selectedRecipe.flavor_profile, selectedRecipe.course].filter(Boolean) as string[],
                        description: selectedRecipe.ingredients?.split(',').map(item => item.trim()).join(', ') || '',
                        course: selectedRecipe.course,
                        flavorProfile: selectedRecipe.flavor_profile,
                        diet: selectedRecipe.diet,
                        region: selectedRecipe.region,
                        ingredients: selectedRecipe.ingredients?.split(',').map(item => item.trim()) || [],
                        steps: selectedRecipe.instruction?.split('\r\n').map(s => s.trim()).filter(Boolean) || [],
                        is_cooked: selectedRecipe.is_cooked || false
                    }}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onStartCooking={() => selectedRecipe && handleStartCooking(selectedRecipe)}
                    is_cooked={selectedRecipe.is_cooked || false}
                />
            )}

            {showCookingMode && selectedRecipeForCooking && (
                <React.Suspense fallback={<div>Loading cooking mode...</div>}>
                    <CookingBox
                        steps={selectedRecipeForCooking.steps}
                        totalCookTime={selectedRecipeForCooking.cookTime}
                        title={selectedRecipeForCooking.title}
                        onExit={handleCloseCookingMode}
                        recipeId={selectedRecipeForCooking.id}
                        difficulty={selectedRecipeForCooking.difficulty}
                    />
                </React.Suspense>
            )}
        </div>
    );
};

export default Dashboard;