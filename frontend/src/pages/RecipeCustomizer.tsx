
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import CookingBox from "@/components/CookingBox";

const RecipeCustomizer = () => {
  const [originalRecipe, setOriginalRecipe] = useState(`Classic Spaghetti Carbonara

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

Prep: 10 min | Cook: 15 min | Serves: 4`);

  const [customizedRecipe, setCustomizedRecipe] = useState("");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);

  const customizationOptions = [
    { label: "Make it Vegan 🌱", description: "Replace animal products with plant-based alternatives", color: "bg-green-500" },
    { label: "Reduce Calories 📉", description: "Lower calorie version with lighter ingredients", color: "bg-blue-500" },
    { label: "Make it Quicker ⚡", description: "Speed up cooking time and simplify steps", color: "bg-orange-500" },
    { label: "Gluten-Free 🌾", description: "Replace gluten-containing ingredients", color: "bg-purple-500" },
    { label: "High Protein 💪", description: "Boost protein content for fitness goals", color: "bg-red-500" },
    { label: "Kid-Friendly 👶", description: "Make it appealing and safe for children", color: "bg-pink-500" }
  ];

  const handleCustomize = async (option: string) => {
    setIsCustomizing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock customized recipe based on option
    let customized = "";
    if (option.includes("Vegan")) {
      customized = `Vegan Spaghetti Carbonara

Ingredients:
• 400g spaghetti
• 200g shiitake mushrooms or vegan bacon
• 4 tbsp aquafaba (chickpea liquid)
• 100g nutritional yeast
• 2 tbsp cashew cream
• Black pepper
• Salt
• 1 tbsp olive oil

Instructions:
1. Cook spaghetti in salted boiling water until al dente
2. Sauté mushrooms until golden and crispy
3. Whisk aquafaba with nutritional yeast and cashew cream
4. Drain pasta, reserving pasta water
5. Mix hot pasta with mushrooms, then stir in aquafaba mixture
6. Add pasta water for creaminess
7. Serve with extra nutritional yeast

Prep: 10 min | Cook: 15 min | Serves: 4 | 100% Plant-Based`;
    } else if (option.includes("Calories")) {
      customized = `Light Spaghetti Carbonara

Ingredients:
• 300g whole wheat spaghetti
• 100g turkey bacon (reduced fat)
• 2 whole eggs + 2 egg whites
• 50g Parmesan cheese, grated
• Black pepper
• Salt
• 1 cup pasta water

Instructions:
1. Cook pasta until al dente (save extra cooking water)
2. Cook turkey bacon until crispy, drain on paper towel
3. Beat eggs and egg whites with half the cheese
4. Mix hot pasta with bacon and egg mixture
5. Use pasta water generously for creamy texture
6. Serve with remaining cheese

Prep: 10 min | Cook: 15 min | Serves: 4 | 30% Fewer Calories`;
    } else {
      customized = `Quick 10-Minute Carbonara

Ingredients:
• 400g thin spaghetti or angel hair
• 150g pre-cooked bacon bits
• 3 eggs (pre-beaten)
• 80g pre-grated Parmesan
• Pre-ground black pepper
• Salt

Instructions:
1. Cook thin pasta (only 3-4 minutes!)
2. Heat bacon bits in pan (1 minute)
3. Mix hot pasta with bacon
4. Quickly stir in beaten eggs and cheese
5. Add hot pasta water for creaminess
6. Serve immediately

Prep: 2 min | Cook: 8 min | Serves: 4 | Super Quick!`;
    }
    
    setCustomizedRecipe(customized);
    setIsCustomizing(false);
  };

  const handleStartCooking = () => {
    // Extract steps from customized recipe
    const steps = customizedRecipe.split('\n').filter(line => line.match(/^\d+\./)).map(step => step.replace(/^\d+\.\s*/, ''));
    setCookingSteps(steps);
    setShowCookingMode(true);
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        AI Recipe Customizer 🤖
      </h1>
      <p className="text-gray-300 mb-8">
        Transform any recipe to match your dietary needs, preferences, or time constraints.
      </p>

      <div className="max-w-4xl space-y-8">
        {/* Original Recipe Card */}
        <Card className="bg-[#2a2f45] border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <span>📝</span>
              <span>Original Recipe</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Paste your recipe here or use our sample recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={originalRecipe}
              onChange={(e) => setOriginalRecipe(e.target.value)}
              rows={12}
              className="font-mono text-sm bg-[#1e1e2f] border-gray-600 text-white placeholder-gray-400"
              placeholder="Paste your recipe here..."
            />
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card className="bg-[#2a2f45] border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <span>✨</span>
              <span>Choose Your Transformation</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Select how you'd like to customize your recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customizationOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-6 text-left hover:shadow-md transition-all bg-[#1e1e2f] border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-orange-500"
                  onClick={() => handleCustomize(option.label)}
                  disabled={isCustomizing}
                >
                  <div className="w-full">
                    <div className="font-semibold text-base mb-2">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            {isCustomizing && (
              <div className="mt-8 text-center">
                <div className="animate-spin h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-orange-400 font-medium">AI is customizing your recipe...</p>
                <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customized Recipe Result */}
        {customizedRecipe && (
          <Card className="border-2 border-green-500 bg-[#2a2f45] shadow-lg shadow-green-500/20">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent">
              <CardTitle className="flex items-center space-x-2 text-green-400 text-xl">
                <span>🎉</span>
                <span>Your Customized Recipe</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI has transformed your recipe based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#1e1e2f] p-6 rounded-lg border border-gray-600">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 leading-relaxed">
                  {customizedRecipe}
                </pre>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleStartCooking}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-medium"
                >
                  🍳 Start Cooking
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
                >
                  💾 Save Recipe
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
                >
                  📤 Share Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cooking Mode */}
      {showCookingMode && (
        <CookingBox 
          steps={cookingSteps}
          totalCookTime={25}
          title="AI Customized Recipe"
          onExit={() => setShowCookingMode(false)}
        />
      )}
    </div>
  );
};

export default RecipeCustomizer;
