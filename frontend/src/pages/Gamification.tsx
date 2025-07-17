import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Award, ChefHat, Calendar, Heart } from "lucide-react";

const Gamification = () => {
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(2840);
  const [xpToNextLevel] = useState(3000);

  const achievements = [
    { name: "First Recipe Saved", description: "Saved your first recipe to your favorites.", icon: <Star className="h-4 w-4 text-yellow-500" />, date: "2024-03-15" },
    { name: "5 Recipes Cooked", description: "Successfully cooked 5 recipes from your collection.", icon: <ChefHat className="h-4 w-4 text-orange-500" />, date: "2024-03-20" },
    { name: "Weekly Meal Plan", description: "Created a meal plan for the entire week.", icon: <Calendar className="h-4 w-4 text-blue-500" />, date: "2024-03-25" },
  ];

  const badges = [
    { name: "Recipe Explorer", description: "Viewed 20 different recipes.", icon: <Star className="h-6 w-6 text-yellow-500" />, progress: 100 },
    { name: "Meal Planner Pro", description: "Planned meals for 3 weeks.", icon: <Calendar className="h-6 w-6 text-blue-500" />, progress: 75 },
    { name: "Cooking Enthusiast", description: "Cooked 10 recipes.", icon: <ChefHat className="h-6 w-6 text-orange-500" />, progress: 50 },
  ];

  const dailyChallenges = [
    { name: "Save a new recipe", description: "Find and save a recipe to your favorites today.", xp: 50 },
    { name: "Cook a meal", description: "Prepare any recipe from your collection.", xp: 75 },
    { name: "Plan tomorrow's meals", description: "Organize your meal plan for the next day.", xp: 60 },
  ];

  const currentLevelXP = (userLevel - 1) * 1000;
  const progressPercent = ((userXP - currentLevelXP) / (xpToNextLevel - currentLevelXP)) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Achievements & Progress 🏆
        </h1>
        <p className="text-gray-400">
          Track your cooking journey, earn XP, and unlock new badges as you explore recipes!
        </p>
      </div>

      {/* Level Progress */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Level {userLevel}</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            {userXP} / {xpToNextLevel} XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-4 bg-gray-700" />
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Recent Achievements</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your latest cooking milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  {achievement.icon}
                  <h3 className="font-semibold text-white">{achievement.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">Achieved: {achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Award className="h-5 w-5 text-purple-500" />
            <span>Badge Collection</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Show off your cooking expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  {badge.icon}
                  <h3 className="font-semibold text-white">{badge.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{badge.description}</p>
                <Progress value={badge.progress} className="h-2 bg-gray-700 mt-2" />
                <p className="text-xs text-gray-500 mt-1">{badge.progress}% completed</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="h-5 w-5 text-green-500" />
            <span>Daily Challenges</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Complete these tasks to earn bonus XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {dailyChallenges.map((challenge, index) => (
              <li key={index} className="p-3 rounded-lg bg-gray-800">
                <div className="flex items-start space-x-3">
                  <Star className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">{challenge.name}</h3>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                    <p className="text-xs text-green-500 mt-1">Reward: +{challenge.xp} XP</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gamification;
