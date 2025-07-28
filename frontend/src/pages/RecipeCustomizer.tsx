import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CookingBox from "@/components/CookingBox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

// Backend API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Default recipe content used as placeholder
const DEFAULT_SAMPLE_RECIPE = `Classic Spaghetti Carbonara

Ingredients:
• 400g spaghetti
• 200g pancetta or guanciale
• 4 large eggs
• 100g Pecorino Romano cheese, grated
• Black pepper
• Salt

Instructions:
1. Cook spaghetti in salted boiling water until al dente
2. While pasta cooks, dice pancetta and cook until crispy
3. Beat eggs with grated cheese and pepper
4. Drain pasta, reserving pasta water
5. Mix hot pasta with pancetta, then quickly stir in egg mixture
6. Add pasta water if needed for creaminess
7. Serve immediately with extra cheese

Prep: 10 min | Cook: 15 min | Serves: 4`;

/**
 * RecipeCustomizer
 * A feature to apply AI-powered transformations to user-provided recipes.
 */
const RecipeCustomizer = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user (used if API requires auth)
  const location = useLocation();

  // State for recipe input, output, and mode toggles
  const [originalRecipe, setOriginalRecipe] = useState(DEFAULT_SAMPLE_RECIPE);
  const [customizedRecipe, setCustomizedRecipe] = useState("");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);

  // Load recipe content passed via route state (e.g., from dashboard)
  useEffect(() => {
    if (location.state && (location.state as any).originalRecipeContent) {
      const { originalRecipeContent, originalRecipeName } = location.state as any;
      setOriginalRecipe(`--- Recipe from Dashboard: ${originalRecipeName} ---\n\n${originalRecipeContent}`);
      setCustomizedRecipe("");
      toast({
        title: "Recipe Loaded!",
        description: `"${originalRecipeName}" pre-loaded for customization.`,
        duration: 3000,
      });
    }
  }, [location.state, toast]);

  // Customization options shown as buttons
  const customizationOptions = [
    { label: "Make it Vegan 🌱", description: "Replace animal products with plant-based alternatives", param: "vegan", defaultBg: "bg-green-600/10", defaultBorder: "border-green-500", defaultText: "text-green-300" },
    { label: "Reduce Calories 📉", description: "Lower calorie version with lighter ingredients", param: "low-calorie", defaultBg: "bg-blue-600/10", defaultBorder: "border-blue-500", defaultText: "text-blue-300" },
    { label: "Make it Quicker ⚡", description: "Speed up cooking time and simplify steps", param: "quick", defaultBg: "bg-orange-600/10", defaultBorder: "border-orange-500", defaultText: "text-orange-300" },
    { label: "Gluten-Free 🌾", description: "Replace gluten-containing ingredients", param: "gluten-free", defaultBg: "bg-purple-600/10", defaultBorder: "border-purple-500", defaultText: "text-purple-300" },
    { label: "High Protein 💪", description: "Boost protein content for fitness goals", param: "high-protein", defaultBg: "bg-red-600/10", defaultBorder: "border-red-500", defaultText: "text-red-300" },
    { label: "Kid-Friendly 👶", description: "Make it appealing and safe for children", param: "kid-friendly", defaultBg: "bg-pink-600/10", defaultBorder: "border-pink-500", defaultText: "text-pink-300" },
    { label: "General Rewrite ✍️", description: "Get a new version with improved clarity or style", param: "general", defaultBg: "bg-gray-800", defaultBorder: "border-gray-500", defaultText: "text-gray-200" },
  ];

  /**
   * Sends the recipe and customization option to the backend for AI processing.
   */
  const handleCustomize = async (optionParam: string) => {
    if (!originalRecipe.trim()) {
      toast({
        title: "No Recipe Provided",
        description: "Please paste a recipe into the text area before customizing.",
        variant: "destructive",
      });
      return;
    }

    setIsCustomizing(true);
    setCustomizedRecipe("");

    try {
      const response = await fetch(`${API_BASE_URL}/ai/customize-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user?.token}`, // Uncomment if backend requires auth
        },
        body: JSON.stringify({
          originalRecipe,
          customizationOption: optionParam,
        }),
      });

      const data = await response.json();

      if (response.ok && data.customizedRecipe) {
        setCustomizedRecipe(data.customizedRecipe);
        toast({
          title: "Recipe Customized!",
          description: "Your recipe has been successfully transformed by AI.",
        });
      } else {
        toast({
          title: "Customization Failed",
          description: data.message || "Unable to customize the recipe.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast({
        title: "Network Error",
        description: error.message || "Failed to connect to AI service.",
        variant: "destructive",
      });
    } finally {
      setIsCustomizing(false);
    }
  };

  /**
   * Parses and extracts steps from the customized recipe for cooking mode.
   */
  const handleStartCooking = () => {
    const steps = customizedRecipe
      .split('\n')
      .filter(line => /^\d+\./.test(line))
      .map(step => step.replace(/^\d+\.\s*/, ''));

    if (steps.length === 0) {
      toast({
        title: "No Steps Found",
        description: "Could not extract valid cooking steps.",
        variant: "destructive",
      });
      return;
    }

    setCookingSteps(steps);
    setShowCookingMode(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-2">AI Recipe Customizer 🤖</h1>
      <p className="text-gray-300 mb-8">Transform any recipe to match your dietary needs, preferences, or time constraints.</p>

      <div className="max-w-4xl space-y-8">
        {/* Recipe input section */}
        <Card className="bg-[#2a2f45] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">📝 <span>Original Recipe</span></CardTitle>
            <CardDescription className="text-gray-400">Paste your recipe or use the sample one</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={originalRecipe}
              onChange={(e) => setOriginalRecipe(e.target.value)}
              rows={12}
              className="font-mono text-sm bg-[#1e1e2f] border-gray-600 text-white"
              placeholder="Paste your recipe here..."
            />
          </CardContent>
        </Card>

        {/* Customization options */}
        <Card className="bg-[#2a2f45] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">✨ <span>Choose Your Transformation</span></CardTitle>
            <CardDescription className="text-gray-400">Pick a customization style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customizationOptions.map(option => (
                <Button
                  key={option.param}
                  variant="outline"
                  className={`h-auto p-6 text-left ${option.defaultBg} ${option.defaultBorder} ${option.defaultText}
                            hover:bg-orange-500/30 hover:text-white hover:border-orange-500/80
                            ${isCustomizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCustomize(option.param)}
                  disabled={isCustomizing}
                >
                  <div>
                    <div className="font-semibold text-base mb-2">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Loading spinner */}
            {isCustomizing && (
              <div className="mt-8 text-center">
                <div className="animate-spin h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-orange-400 font-medium">AI is customizing your recipe...</p>
                <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customized output */}
        {customizedRecipe && (
          <Card className="border-2 border-green-500 bg-[#2a2f45] shadow-lg shadow-green-500/20">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent">
              <CardTitle className="text-green-400 text-xl flex items-center space-x-2">🎉 <span>Your Customized Recipe</span></CardTitle>
              <CardDescription className="text-gray-400">AI has transformed your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#1e1e2f] p-6 rounded-lg border border-gray-600">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300">{customizedRecipe}</pre>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleStartCooking}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-medium"
                >
                  🍳 Start Cooking
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 px-6 py-3" disabled>💾 Save Recipe</Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 px-6 py-3" disabled>📤 Share Recipe</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cooking step-by-step display */}
      {showCookingMode && (
        <React.Suspense fallback={<div>Loading cooking mode...</div>}>
          <CookingBox 
            steps={cookingSteps}
            totalCookTime={25} // Ideally should be parsed from recipe
            title="AI Customized Recipe"
            onExit={() => setShowCookingMode(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default RecipeCustomizer;
