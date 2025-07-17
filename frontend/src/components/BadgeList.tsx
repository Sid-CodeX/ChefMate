
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Badge as BadgeIcon } from "lucide-react";

const BadgeList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const badges = [
    // Unlocked Badges
    { id: 1, name: "First Recipe", description: "Cook your very first recipe", category: "milestone", unlocked: true, rarity: "common", icon: "🍳" },
    { id: 2, name: "Speed Demon", description: "Cook 5 recipes in under 30 minutes", category: "speed", unlocked: true, rarity: "rare", icon: "⚡" },
    { id: 3, name: "Healthy Choice", description: "Cook 10 healthy recipes", category: "health", unlocked: true, rarity: "common", icon: "🥗" },
    { id: 4, name: "Streak Master", description: "Maintain a 10-day cooking streak", category: "consistency", unlocked: true, rarity: "epic", icon: "🔥" },
    { id: 5, name: "Recipe Explorer", description: "Try recipes from 5 different cuisines", category: "variety", unlocked: true, rarity: "rare", icon: "🌍" },
    { id: 6, name: "Kitchen Ninja", description: "Complete 25 recipes", category: "milestone", unlocked: true, rarity: "rare", icon: "🥷" },
    { id: 7, name: "Vegan Warrior", description: "Cook 15 vegan recipes", category: "health", unlocked: true, rarity: "uncommon", icon: "🌱" },
    { id: 8, name: "Weekend Chef", description: "Cook on 10 weekends", category: "consistency", unlocked: true, rarity: "common", icon: "🏖️" },
    
    // Locked Badges
    { id: 9, name: "Master Chef", description: "Reach level 15", category: "milestone", unlocked: false, rarity: "legendary", icon: "👨‍🍳" },
    { id: 10, name: "Speed of Light", description: "Complete a recipe in under 10 minutes", category: "speed", unlocked: false, rarity: "epic", icon: "💨" },
    { id: 11, name: "Perfectionist", description: "Get 5-star ratings on 20 recipes", category: "quality", unlocked: false, rarity: "epic", icon: "⭐" },
    { id: 12, name: "Iron Chef", description: "Cook 100 different recipes", category: "milestone", unlocked: false, rarity: "legendary", icon: "🏆" },
    { id: 13, name: "Macro Master", description: "Track macros for 30 recipes", category: "health", unlocked: false, rarity: "rare", icon: "📊" },
    { id: 14, name: "Social Butterfly", description: "Share 50 recipes with friends", category: "social", unlocked: false, rarity: "uncommon", icon: "🦋" },
    { id: 15, name: "Early Bird", description: "Cook breakfast 20 times", category: "consistency", unlocked: false, rarity: "common", icon: "🌅" },
    { id: 16, name: "Night Owl", description: "Cook dinner after 9 PM, 15 times", category: "consistency", unlocked: false, rarity: "uncommon", icon: "🦉" }
  ];

  const categories = [
    { id: "all", name: "All Badges", count: badges.length },
    { id: "milestone", name: "Milestones", count: badges.filter(b => b.category === "milestone").length },
    { id: "speed", name: "Speed", count: badges.filter(b => b.category === "speed").length },
    { id: "health", name: "Health", count: badges.filter(b => b.category === "health").length },
    { id: "consistency", name: "Consistency", count: badges.filter(b => b.category === "consistency").length },
    { id: "variety", name: "Variety", count: badges.filter(b => b.category === "variety").length }
  ];

  const filteredBadges = selectedCategory === "all" 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-300";
      case "uncommon": return "bg-green-100 text-green-700 border-green-300";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BadgeIcon className="h-5 w-5 text-purple-500" />
            <span>Badge Collection</span>
          </div>
          <Badge className="bg-purple-100 text-purple-700">
            {unlockedCount}/{badges.length} Unlocked
          </Badge>
        </CardTitle>
        <CardDescription>
          Collect badges by completing cooking challenges and reaching milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                badge.unlocked 
                  ? `${getRarityColor(badge.rarity)} hover:-translate-y-1 cursor-pointer` 
                  : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"
              }`}
            >
              {/* Unlock Animation Effect */}
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
              
              <div className="text-center">
                <div className="text-3xl mb-2">{badge.unlocked ? badge.icon : "🔒"}</div>
                <h3 className={`font-semibold text-sm mb-1 ${badge.unlocked ? "" : "text-gray-400"}`}>
                  {badge.name}
                </h3>
                <p className={`text-xs leading-tight ${badge.unlocked ? "" : "text-gray-400"}`}>
                  {badge.description}
                </p>
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${badge.unlocked ? getRarityColor(badge.rarity) : "bg-gray-100 text-gray-400 border-gray-300"}`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-900">Keep Going, Chef! 🎯</h3>
              <p className="text-purple-700 text-sm">
                You're doing amazing! {badges.length - unlockedCount} more badges to unlock.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900">{Math.round((unlockedCount / badges.length) * 100)}%</div>
              <div className="text-purple-700 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeList;
