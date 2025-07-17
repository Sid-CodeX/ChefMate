
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChefHat, ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MealPlanner = () => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["breakfast", "lunch", "dinner"];

  const [mealPlan, setMealPlan] = useState({
    Monday: {
      breakfast: { name: "Overnight Oats", prep: "5 min" },
      lunch: { name: "Caesar Salad", prep: "15 min" },
      dinner: { name: "Grilled Salmon", prep: "25 min" }
    },
    Tuesday: {
      breakfast: { name: "Avocado Toast", prep: "10 min" },
      lunch: null,
      dinner: { name: "Pasta Carbonara", prep: "20 min" }
    },
    Wednesday: {
      breakfast: { name: "Greek Yogurt Bowl", prep: "5 min" },
      lunch: { name: "Quinoa Buddha Bowl", prep: "30 min" },
      dinner: null
    },
    Thursday: {
      breakfast: null,
      lunch: { name: "Turkey Sandwich", prep: "10 min" },
      dinner: { name: "Stir Fry Vegetables", prep: "20 min" }
    },
    Friday: {
      breakfast: { name: "Smoothie Bowl", prep: "10 min" },
      lunch: { name: "Chicken Wrap", prep: "15 min" },
      dinner: { name: "Pizza Night", prep: "45 min" }
    },
    Saturday: {
      breakfast: { name: "Pancakes", prep: "20 min" },
      lunch: { name: "Soup & Salad", prep: "25 min" },
      dinner: { name: "BBQ Ribs", prep: "3 hours" }
    },
    Sunday: {
      breakfast: { name: "French Toast", prep: "15 min" },
      lunch: { name: "Leftover Ribs", prep: "5 min" },
      dinner: { name: "Meal Prep Sunday", prep: "2 hours" }
    }
  });

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "breakfast": return "bg-orange-100 text-orange-700 border-orange-300";
      case "lunch": return "bg-green-100 text-green-700 border-green-300"; 
      case "dinner": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Meal Planner 📅
        </h1>
        <p className="text-gray-400">
          Plan your weekly meals and generate shopping lists.
        </p>
      </div>

      {/* Generate Shopping List Button */}
      <div className="flex justify-center mb-6">
        <Link to="/shopping-list">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            🛒 Generate Shopping List
          </Button>
        </Link>
      </div>

      {/* Weekly Meal Grid */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>This Week's Meal Plan</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Click on empty slots to add meals or use the search bar to find recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div key={day} className="border rounded-lg p-3 bg-white">
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{day}</h3>
                </div>
                
                <div className="space-y-2">
                  {mealTypes.map((mealType) => {
                    const meal = mealPlan[day as keyof typeof mealPlan][mealType as keyof typeof mealPlan.Monday];
                    return (
                      <div key={mealType} className="min-h-[60px] border-2 border-dashed border-gray-200 rounded p-2 hover:border-gray-300 transition-colors cursor-pointer">
                        {meal ? (
                          <div className={`p-2 rounded text-xs ${getMealTypeColor(mealType)}`}>
                            <div className="font-medium truncate">{meal.name}</div>
                            <div className="text-xs opacity-75">⏱️ {meal.prep}</div>
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

      {/* Quick Actions */}
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
              <div className="text-2xl">🔍</div>
              <span>Search Recipes</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
              <div className="text-2xl">📋</div>
              <span>Copy Last Week</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
              <div className="text-2xl">🎲</div>
              <span>Random Meals</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanner;
