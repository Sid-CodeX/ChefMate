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

// Lazy load CookingBox
const CookingBox = React.lazy(() => import("@/components/CookingBox"));

interface Recipe {
  id: number;
  name: string;
  img_url: string;
  ingredients: string[];
  diet: 'Vegetarian' | 'Non-Vegetarian';
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
  steps: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface FilterOptions {
  diet: string[];
  course: string[];
  flavorProfile: string[];
  difficulty: string[];
  region: string[];
}

const RECIPES_PER_PAGE = 6;

const Dashboard = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [selectedRecipeForCooking, setSelectedRecipeForCooking] = useState<any | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    diet: [],
    course: [],
    flavorProfile: [],
    difficulty: [],
    region: []
  });

  // Debounce search query to reduce unnecessary filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered and paginated recipes
  const { filteredRecipes, totalPages, paginatedRecipes } = useMemo(() => {
    let filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    // Apply filters
    if (filters.diet.length > 0) {
      filtered = filtered.filter(recipe => filters.diet.includes(recipe.diet));
    }
    if (filters.course.length > 0) {
      filtered = filtered.filter(recipe => filters.course.includes(recipe.course));
    }
    if (filters.flavorProfile.length > 0) {
      filtered = filtered.filter(recipe => filters.flavorProfile.includes(recipe.flavor_profile));
    }
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(recipe => filters.difficulty.includes(recipe.difficulty));
    }
    if (filters.region.length > 0) {
      filtered = filtered.filter(recipe => filters.region.includes(recipe.region));
    }
    
    const totalPages = Math.ceil(filtered.length / RECIPES_PER_PAGE);
    const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + RECIPES_PER_PAGE);
    
    return {
      filteredRecipes: filtered,
      totalPages,
      paginatedRecipes: paginated
    };
  }, [recipes, debouncedSearchQuery, currentPage, filters]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filters]);

  useEffect(() => {
    // Mock recipe data - in real app, this would be fetched from backend
    const mockRecipes: Recipe[] = [
      {
        id: 1,
        name: "Butter Chicken",
        img_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
        ingredients: ["2 lbs chicken breast", "1 cup heavy cream", "2 tbsp butter", "1 onion, diced", "3 cloves garlic", "1 tbsp garam masala", "1 can tomato sauce", "Salt to taste"],
        diet: "Non-Vegetarian",
        prep_time: 20,
        cook_time: 30,
        flavor_profile: "Mild & Creamy",
        course: "Main Course",
        state: "Punjab",
        region: "North India",
        difficulty: "Medium",
        steps: [
          "Marinate chicken with spices for 30 minutes",
          "Heat butter in a pan and cook chicken until golden",
          "Remove chicken and sauté onions and garlic",
          "Add tomato sauce and cream, simmer for 10 minutes",
          "Return chicken to sauce and cook for 15 minutes",
          "Garnish with fresh cilantro and serve hot"
        ]
      },
      {
        id: 2,
        name: "Spicy Thai Basil Chicken",
        img_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        ingredients: ["1 lb ground chicken", "3 Thai chilies", "4 cloves garlic", "1 cup Thai basil", "2 tbsp fish sauce", "1 tbsp oyster sauce", "1 tbsp sugar", "2 tbsp oil"],
        diet: "Non-Vegetarian",
        prep_time: 15,
        cook_time: 20,
        flavor_profile: "Spicy",
        course: "Main Course",
        state: "International",
        region: "Southeast Asia",
        difficulty: "Easy",
        steps: [
          "Heat oil in wok over high heat",
          "Add minced garlic and chilies, stir-fry for 30 seconds",
          "Add ground chicken and cook until no longer pink",
          "Add fish sauce, oyster sauce, and sugar",
          "Stir in Thai basil leaves until wilted",
          "Serve immediately over rice"
        ]
      },
      {
        id: 3,
        name: "Classic Beef Bolognese",
        img_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
        ingredients: ["1 lb ground beef", "1 onion diced", "2 carrots diced", "2 celery stalks", "4 cloves garlic", "1 can crushed tomatoes", "1/2 cup red wine", "2 tbsp tomato paste"],
        diet: "Non-Vegetarian",
        prep_time: 20,
        cook_time: 45,
        flavor_profile: "Rich & Savory",
        course: "Main Course",
        state: "International",
        region: "Europe",
        difficulty: "Hard",
        steps: [
          "Heat oil and sauté onions, carrots, and celery until soft",
          "Add garlic and cook for 1 minute",
          "Add ground beef and cook until browned",
          "Stir in tomato paste and cook for 2 minutes",
          "Add wine and let it reduce by half",
          "Add crushed tomatoes and simmer for 45 minutes"
        ]
      },
      {
        id: 4,
        name: "Avocado Toast Deluxe",
        img_url: "https://images.unsplash.com/photo-1541519869434-d3d9f32977c3?w=800",
        ingredients: ["2 slices sourdough bread", "1 ripe avocado", "2 eggs", "Cherry tomatoes", "Everything bagel seasoning", "Olive oil", "Salt and pepper", "Lemon juice"],
        diet: "Vegetarian",
        prep_time: 5,
        cook_time: 10,
        flavor_profile: "Fresh & Light",
        course: "Breakfast",
        state: "International",
        region: "Modern",
        difficulty: "Easy",
        steps: [
          "Toast bread slices until golden brown",
          "Mash avocado with lemon juice, salt, and pepper",
          "Poach eggs in simmering water for 3-4 minutes",
          "Spread avocado mixture on toast",
          "Top with poached egg and cherry tomatoes",
          "Sprinkle with everything bagel seasoning"
        ]
      }
    ];
    setRecipes(mockRecipes);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      diet: [],
      course: [],
      flavorProfile: [],
      difficulty: [],
      region: []
    });
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
    setSelectedRecipeForCooking({
      id: recipe.id,
      title: recipe.name,
      image: recipe.img_url,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      difficulty: recipe.difficulty,
      tags: [recipe.flavor_profile, recipe.course],
      rating: 4.5,
      description: `Delicious ${recipe.name} from ${recipe.region}`,
      course: recipe.course,
      flavorProfile: recipe.flavor_profile,
      diet: recipe.diet,
      region: recipe.region,
      ingredients: recipe.ingredients,
      steps: recipe.steps || []
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

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Explore Our Delicious Recipes 🍽️
        </h1>
        <p className="text-gray-400">
          Discover new and exciting recipes to try in your kitchen.
        </p>
      </div>

      {/* Search Bar and Filter */}
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
        <FilterDropdown
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Results Info */}
      {(debouncedSearchQuery || Object.values(filters).some(f => f.length > 0)) && (
        <div className="text-center text-gray-400 text-sm">
          Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={{
              id: recipe.id,
              title: recipe.name,
              image: recipe.img_url,
              cookTime: `${recipe.cook_time} mins`,
              difficulty: recipe.difficulty,
              tags: [recipe.flavor_profile, recipe.course],
              rating: 4.5,
              description: recipe.ingredients.join(', '),
            }}
            onClick={() => handleRecipeClick(recipe)}
          />
        ))}
        {paginatedRecipes.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-400">No recipes found</p>
            <Button asChild>
              <Link to="/recipe-customizer" className="mt-4">
                Try the AI Recipe Customizer
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <RecipePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe ? {
          id: selectedRecipe.id,
          title: selectedRecipe.name,
          image: selectedRecipe.img_url,
          prepTime: selectedRecipe.prep_time,
          cookTime: selectedRecipe.cook_time,
          difficulty: selectedRecipe.difficulty,
          tags: [selectedRecipe.flavor_profile, selectedRecipe.course],
          rating: 4.5,
          description: selectedRecipe.ingredients.join(', '),
          course: selectedRecipe.course,
          flavorProfile: selectedRecipe.flavor_profile,
          diet: selectedRecipe.diet,
          region: selectedRecipe.region,
          ingredients: selectedRecipe.ingredients
        } : null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStartCooking={() => {
          if (selectedRecipe) {
            handleStartCooking(selectedRecipe);
          }
        }}
      />

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
