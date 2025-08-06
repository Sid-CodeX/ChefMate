import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChefHat, ShoppingCart, Plus, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mealPlannerService } from '@/services/mealPlannerService';
import RecipeSearchModal from "@/components/RecipeSearchModal";

interface PlannedMeal {
    id: number;
    day_of_week: string;
    meal_slot: string;
    recipe_id: number;
    recipe_name: string;
    prep_time: string;
    cook_time: string;
}

interface FormattedMealPlan {
    [day: string]: {
        breakfast: { name: string; prep: string; recipeId: number; planId: number } | null;
        lunch: { name: string; prep: string; recipeId: number; planId: number } | null;
        dinner: { name: string; prep: string; recipeId: number; planId: number } | null;
    };
}

interface RecipeForSelection {
    id: number;
    name: string;
    prep_time: string;
    
}

const MealPlanner = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mealTypes = ["breakfast", "lunch", "dinner"];

    const [mealPlan, setMealPlan] = useState<FormattedMealPlan>({});
    const [isLoadingPlan, setIsLoadingPlan] = useState(true);
    const [planError, setPlanError] = useState<string | null>(null);
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [currentSlotForSelection, setCurrentSlotForSelection] = useState<{ day: string; mealType: string } | null>(null);
    const [isRandomizing, setIsRandomizing] = useState(false); 

    const fetchWeeklyPlan = async () => {
        if (!user?.token) {
            setPlanError("Please log in to view your meal plan.");
            setIsLoadingPlan(false);
            setMealPlan({});
            return;
        }

        setIsLoadingPlan(true);
        setPlanError(null);
        try {
            const fetchedPlan = await mealPlannerService.getWeeklyPlan(user.token);
            const formatted: FormattedMealPlan = {};
            weekDays.forEach(day => {
                formatted[day] = { breakfast: null, lunch: null, dinner: null };
            });

            fetchedPlan.forEach(item => {
                if (formatted[item.day_of_week] && mealTypes.includes(item.meal_slot)) {
                    formatted[item.day_of_week][item.meal_slot as keyof FormattedMealPlan['Monday']] = {
                        name: item.recipe_name,
                        prep: item.prep_time || "N/A min",
                        recipeId: item.recipe_id,
                        planId: item.id,
                    };
                }
            });

            setMealPlan(formatted);
        } catch (err: any) {
            setPlanError(err.message || "Failed to load weekly plan.");
            toast({ title: "Error", description: err.message || "Failed to load weekly plan.", variant: "destructive" });
        } finally {
            setIsLoadingPlan(false);
        }
    };

    useEffect(() => {
        fetchWeeklyPlan();
    }, [user?.token]);

    const handleGenerateShoppingList = async () => {
        if (!user?.token) {
            toast({ title: "Login Required", description: "Please log in to generate a shopping list.", variant: "destructive" });
            return;
        }

        const meals = Object.values(mealPlan)
            .flatMap(day => Object.values(day).filter(Boolean))
            .map(meal => (meal as { name: string }).name); 
        
        if (meals.length === 0) {
            toast({ title: "No Meals Planned", description: "Please add recipes before generating a shopping list.", variant: "info" });
            return;
        }

        setIsGeneratingList(true);
        try {
            await mealPlannerService.generateShoppingList(user.token);
            toast({ title: "Success", description: "Shopping list generated.", variant: "success" });
            navigate('/shopping-list');
        } catch (error: any) {
            toast({ title: "Generation Failed", description: error.message || "Please try again later.", variant: "destructive" });
        } finally {
            setIsGeneratingList(false);
        }
    };

    // Function to handle random meal generation
    const handleRandomizeMeals = async () => {
        if (!user?.token) {
            toast({ title: "Login Required", description: "Please log in to randomize your meal plan.", variant: "destructive" });
            return;
        }
        
        setIsRandomizing(true);
        try {
            await mealPlannerService.randomizeMealPlan(user.token);
            await fetchWeeklyPlan(); // Re-fetch the plan to get the updated randomized meals
            toast({ title: "Success", description: "Empty slots filled with random meals.", variant: "success" });
        } catch (error: any) {
            toast({ title: "Randomization Failed", description: error.message || "Please try again later.", variant: "destructive" });
        } finally {
            setIsRandomizing(false);
        }
    };

    const handleOpenRecipeModal = (day: string, mealType: string) => {
        if (!user) {
            toast({ title: "Login Required", description: "Please log in to modify your meal plan.", variant: "destructive" });
            return;
        }
        setCurrentSlotForSelection({ day, mealType });
        setIsRecipeModalOpen(true);
    };

    const handleRecipeSelected = async (selectedRecipe: RecipeForSelection) => {
        if (!currentSlotForSelection || !user?.token) return;

        const { day, mealType } = currentSlotForSelection;
        const { id: recipeId, name, prep_time } = selectedRecipe;
        setIsRecipeModalOpen(false);
        setIsLoadingPlan(true);

        try {
            const response = await mealPlannerService.saveMealToPlan(day, mealType, recipeId, user.token);
            await fetchWeeklyPlan();
            toast({ title: "Meal Added", description: `${name} added to ${day} ${mealType}.`, variant: "success" });
        } catch (error: any) {
            toast({ title: "Failed to Add", description: error.message || "Unable to update plan.", variant: "destructive" });
        } finally {
            setIsLoadingPlan(false);
            setCurrentSlotForSelection(null);
        }
    };

    const handleRemoveMeal = async (day: string, mealType: string) => {
        if (!user?.token) {
            toast({ title: "Login Required", description: "Please log in to modify your meal plan.", variant: "destructive" });
            return;
        }

        setIsLoadingPlan(true);
        try {
            await mealPlannerService.deleteMealFromPlan(day, mealType, user.token);
            await fetchWeeklyPlan();
            toast({ title: "Meal Removed", description: `Removed from ${day} ${mealType}.`, variant: "success" });
        } catch (error: any) {
            toast({ title: "Failed to Remove", description: error.message || "Unable to update plan.", variant: "destructive" });
        } finally {
            setIsLoadingPlan(false);
        }
    };

    const getMealTypeColor = (mealType: string) => {
        switch (mealType) {
            case "breakfast": return "bg-orange-100 text-orange-700 border-orange-300";
            case "lunch": return "bg-green-100 text-green-700 border-green-300";
            case "dinner": return "bg-blue-100 text-blue-700 border-blue-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    if (isLoadingPlan) {
        return <div className="text-center py-12 text-white">Loading meal plan...</div>;
    }

    if (planError) {
        return (
            <div className="text-center py-12 text-red-400">
                <p>Error: {planError}</p>
                <Button onClick={fetchWeeklyPlan} className="mt-4">Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Meal Planner</h1>
                <p className="text-gray-400">Plan your weekly meals and generate shopping lists.</p>
            </div>

            <div className="flex justify-center mb-6">
                <Button
                    onClick={handleGenerateShoppingList}
                    disabled={isGeneratingList || !user}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isGeneratingList ? "Generating..." : "Generate Shopping List"}
                </Button>
            </div>

            <Card className="bg-[#2c2c3d] border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span>Weekly Meal Plan</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {weekDays.map(day => (
                            <div key={day} className="border rounded-lg p-3 bg-white">
                                <div className="text-center mb-3">
                                    <h3 className="font-semibold text-gray-900 text-sm">{day}</h3>
                                </div>
                                <div className="space-y-2">
                                    {mealTypes.map(mealType => {
                                        const meal = mealPlan[day]?.[mealType as keyof FormattedMealPlan['Monday']];
                                        return (
                                            <div
                                                key={mealType}
                                                className="min-h-[60px] border-2 border-dashed border-gray-200 rounded p-2 hover:border-gray-300 cursor-pointer relative"
                                                onClick={() => handleOpenRecipeModal(day, mealType)}
                                            >
                                                {meal ? (
                                                    <div className={`p-2 rounded text-xs ${getMealTypeColor(mealType)} flex justify-between items-center`}>
                                                        <div>
                                                            <div className="font-medium truncate">{meal.name}</div>
                                                            <div className="text-xs opacity-75">⏱ {meal.prep}</div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 absolute top-0 right-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveMeal(day, mealType);
                                                            }}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-400 text-xs hover:text-gray-600">
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add {mealType}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#2c2c3d] border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                        <ChefHat className="h-5 w-5 text-orange-500" />
                        <span>Quick Actions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
                            <span>Search Recipes</span>
                        </Button>
                        <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
                            <span>Copy Last Week</span>
                        </Button>
                        {/* Updated button for Random Meals */}
                        <Button 
                            variant="outline" 
                            className="p-6 h-auto flex-col space-y-2"
                            onClick={handleRandomizeMeals}
                            disabled={isRandomizing || !user}
                        >
                            <span>{isRandomizing ? "Randomizing..." : "Random Meals"}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {isRecipeModalOpen && (
                <RecipeSearchModal
                    isOpen={isRecipeModalOpen}
                    onClose={() => setIsRecipeModalOpen(false)}
                    onSelectRecipe={handleRecipeSelected}
                />
            )}
        </div>
    );
};

export default MealPlanner;