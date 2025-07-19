import { useState, useEffect, useMemo } from "react"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Award, ChefHat, Calendar, Heart, CheckCircle } from "lucide-react"; 
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BadgeList from '@/components/BadgeList';

// Define the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interface for the full badge metadata from /api/badges/all
interface BadgeMetadata {
  name: string;
  description: string;
  type: string;
  category: string;
  rarity: string;
  icon_url: string;
  xpReward: number; 
}

// Interface for a user's earned badge from /api/badges/user
interface UserEarnedBadge {
  badge_name: string;
  earned_at: string; // ISO date string
}

/*
 * Gamification Component
 * Displays user's overall progress, level, XP, recent achievements (earned badges), and daily challenges.
 * Integrates the BadgeList component for comprehensive badge display.
 */
const Gamification = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // User Level & XP from AuthContext
  const userLevel = user?.level || 1;
  const userXP = user?.xp || 0;

  // State for all badge metadata and user's earned badges
  const [allBadgeMetadata, setAllBadgeMetadata] = useState<BadgeMetadata[]>([]);
  const [userEarnedBadges, setUserEarnedBadges] = useState<UserEarnedBadge[]>([]);
  const [allBadgesLoading, setAllBadgesLoading] = useState(true);
  const [userBadgesLoading, setUserBadgesLoading] = useState(true);


  // Data Fetching Logic 

  // Fetch all badge metadata on component mount
  useEffect(() => {
    const fetchAllBadgeMetadata = async () => {
      setAllBadgesLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/badges/all`);
        if (response.ok) {
          const data = await response.json();
          setAllBadgeMetadata(data.badges);
        } else {
          console.error('Failed to fetch all badge metadata:', response.statusText);
          toast({
            title: 'Error Loading Badges',
            description: 'Could not retrieve all badge definitions.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Network error fetching all badge metadata:', error);
        toast({
          title: 'Network Error',
          description: 'Failed to connect to badge service for all metadata.',
          variant: 'destructive',
        });
      } finally {
        setAllBadgesLoading(false);
      }
    };

    fetchAllBadgeMetadata();
  }, [toast]);

  // Fetch user-specific earned badges when user is authenticated or changes
  useEffect(() => {
    const fetchUserEarnedBadges = async () => {
      if (!user || !user.token) {
        setUserEarnedBadges([]);
        setUserBadgesLoading(false);
        return;
      }

      setUserBadgesLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/badges/user`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserEarnedBadges(data.badges);
        } else {
          console.error('Failed to fetch user-earned badges:', response.statusText);
          setUserEarnedBadges([]);
        }
      } catch (error) {
        console.error('Network error fetching user-earned badges:', error);
        setUserEarnedBadges([]);
      } finally {
        setUserBadgesLoading(false);
      }
    };

    fetchUserEarnedBadges();
  }, [user?.id, user?.token]);

  // Derived State for Display 

  // Combines all badge metadata with user's earned badges to determine unlock status.
  const displayBadges = useMemo(() => {
    const earnedBadgeNames = new Set(userEarnedBadges.map(b => b.badge_name));
    const earnedBadgeMap = new Map(userEarnedBadges.map(b => [b.badge_name, b.earned_at]));

    return allBadgeMetadata.map(badge => ({
      ...badge,
      unlocked: earnedBadgeNames.has(badge.name),
      earned_at: earnedBadgeMap.get(badge.name) || undefined,
    }));
  }, [allBadgeMetadata, userEarnedBadges]);

  // Filter for Daily Challenges (assuming category "Daily")
  const dailyChallenges = useMemo(() => {
    return displayBadges.filter(badge => badge.category === 'Daily');
  }, [displayBadges]);

  // Filter for Recent Achievements (e.g., last 3 earned badges)
  const recentAchievements = useMemo(() => {
    // Sort earned badges by earned_at date descending and take the top 3
    return userEarnedBadges
      .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
      .slice(0, 3)
      .map(earned => {
        // Find the full metadata for the earned badge
        const metadata = allBadgeMetadata.find(meta => meta.name === earned.badge_name);
        return metadata ? { ...metadata, unlocked: true, earned_at: earned.earned_at } : null;
      })
      .filter(Boolean) as (BadgeMetadata & { unlocked: true; earned_at: string })[];
  }, [userEarnedBadges, allBadgeMetadata]);


  // Calculate progress towards the next level
  // Assuming XP for next level is current level * 1000 + some base, or similar logic
  const xpForCurrentLevelStart = (userLevel - 1) * 1000; 
  const xpForNextLevel = userLevel * 1000;
  const progressPercent = xpForNextLevel > xpForCurrentLevelStart 
    ? ((userXP - xpForCurrentLevelStart) / (xpForNextLevel - xpForCurrentLevelStart)) * 100 
    : 0;


  // Render loading state if auth data or badge data is loading
  if (authLoading || allBadgesLoading || userBadgesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading gamification data...</p> {/* You can replace with a proper spinner */}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
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
            {userXP} / {xpForNextLevel} XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-4 bg-gray-700 [&::-webkit-progress-value]:bg-yellow-500 [&::-moz-progress-bar]:bg-yellow-500 [&::value]:bg-yellow-500" />
        </CardContent>
      </Card>

      {/* Recent Achievements - now uses real user-earned badges */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Recent Achievements</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your latest cooking milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAchievements.length === 0 ? (
            <p className="text-gray-400 text-center">No recent achievements yet. Keep cooking!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.name} className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    {achievement.icon_url ? (
                        <img src={achievement.icon_url} alt={achievement.name} className="h-5 w-5" />
                    ) : (
                        <Trophy className="h-5 w-5 text-yellow-500" /> 
                    )}
                    <h3 className="font-semibold text-white">{achievement.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Achieved: {new Date(achievement.earned_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges Collection - Uses the BadgeList component */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Award className="h-5 w-5 text-purple-500" />
            <span>Badge Collection</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Explore and collect all cooking badges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeList /> {/* Renders the BadgeList component, which now fetches its own data */}
        </CardContent>
      </Card>

      {/* Daily Challenges - now dynamic */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="h-5 w-5 text-green-500" />
            <span>Daily Challenges</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Complete these tasks to earn bonus XP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyChallenges.length === 0 ? (
            <p className="text-gray-400 text-center">No daily challenges available today.</p>
          ) : (
            <ul className="space-y-3">
              {dailyChallenges.map((challenge) => (
                <li key={challenge.name} className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    {challenge.unlocked ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" /> 
                    ) : (
                        <Star className="h-4 w-4 text-gray-500 mt-0.5" /> 
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{challenge.name}</h3>
                      <p className="text-sm text-gray-400">{challenge.description}</p>
                      <p className="text-xs text-green-500 mt-1">Reward: +{challenge.xpReward} XP</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Gamification;