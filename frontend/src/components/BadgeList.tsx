import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Keep these imports but remove their usage in the return
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Badge as BadgeIcon } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Interface for the full badge metadata from /api/badges/all
 */
interface BadgeMetadata {
  name: string;
  description: string;
  type: string;
  category: string;
  rarity: string;
  icon_url: string; // Assuming your backend provides an icon URL
  xpReward?: number; // Added xpReward for consistency if backend sends it for all badges
}

/**
 * Interface for a user's earned badge from /api/badges/user
 */
interface UserEarnedBadge {
  badge_name: string;
  earned_at: string; // ISO date string
}

/**
 * Interface for a badge to be displayed in the list (combination of metadata and user status)
 */
interface DisplayBadge extends BadgeMetadata {
  unlocked: boolean;
  earned_at?: string; // Optional, only present if unlocked
}

/**
 * BadgeList Component
 * Displays a collection of all available badges, highlighting those unlocked by the user.
 * Includes category filtering and progress summary.
 * This component is designed to be rendered INSIDE a CardContent.
 */
const BadgeList = () => {
  const { user } = useAuth(); // Only need user, not isLoading here
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allBadgeMetadata, setAllBadgeMetadata] = useState<BadgeMetadata[]>([]);
  const [userEarnedBadges, setUserEarnedBadges] = useState<UserEarnedBadge[]>([]);
  const [allBadgesLoading, setAllBadgesLoading] = useState(true);
  const [userBadgesLoading, setUserBadgesLoading] = useState(true);

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

  /**
   * Combines all badge metadata with user's earned badges to determine unlock status.
   * Memoized for performance to only re-calculate when source data changes.
   */
  const displayBadges = useMemo(() => {
    const earnedBadgeNames = new Set(userEarnedBadges.map(b => b.badge_name));
    const earnedBadgeMap = new Map(userEarnedBadges.map(b => [b.badge_name, b.earned_at]));

    return allBadgeMetadata.map(badge => ({
      ...badge,
      unlocked: earnedBadgeNames.has(badge.name),
      earned_at: earnedBadgeMap.get(badge.name) || undefined,
    }));
  }, [allBadgeMetadata, userEarnedBadges]);

  /**
   * Dynamically generates badge categories based on fetched metadata.
   */
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allBadgeMetadata.map(b => b.category));
    const dynamicCategories = Array.from(uniqueCategories).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize category name
      count: allBadgeMetadata.filter(b => b.category === cat).length,
    }));
    return [{ id: "all", name: "All Badges", count: allBadgeMetadata.length }, ...dynamicCategories];
  }, [allBadgeMetadata]);

  /**
   * Filters badges based on the selected category.
   */
  const filteredBadges = useMemo(() => {
    return selectedCategory === "all"
      ? displayBadges
      : displayBadges.filter(badge => badge.category === selectedCategory);
  }, [selectedCategory, displayBadges]);

  const unlockedCount = displayBadges.filter(b => b.unlocked).length;

  /**
   * Determines badge rarity color for styling.
   * @param rarity - The rarity string (e.g., "common", "rare").
   */
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

  // Render loading state while data is being fetched
  if (allBadgesLoading || userBadgesLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-400">
        Loading badge collection... {/* Placeholder for loading, can be spinner */}
      </div>
    );
  }

  // Render message if no badges are found after loading
  if (displayBadges.length === 0) {
    return (
      <div className="text-gray-400 text-center min-h-[200px] flex items-center justify-center">
        No badges found.
      </div>
    );
  }

  return (
    <> {/* Fragment to replace the outer Card */}
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id ? "bg-purple-500 hover:bg-purple-600 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.name} // Using badge name as a unique key
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
              badge.unlocked
                ? `${getRarityColor(badge.rarity)} hover:-translate-y-1 cursor-pointer`
                : "bg-gray-700/50 text-gray-400 border-gray-600 opacity-60" // Darker style for locked
            }`}
          >
            {/* Unlocked status indicator */}
            {badge.unlocked && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}

            <div className="text-center">
              {/* Badge Icon (use icon_url if available, else a placeholder) */}
              <div className="text-3xl mb-2">
                {badge.unlocked && badge.icon_url ? (
                    <img src={badge.icon_url} alt={badge.name} className="h-10 w-10 mx-auto" />
                ) : (
                    <Trophy className="h-10 w-10 mx-auto text-gray-500" /> // Generic locked icon or gray trophy
                )}
              </div>
              <h3 className={`font-semibold text-sm mb-1 ${badge.unlocked ? "text-white" : "text-gray-400"}`}>
                {badge.name}
              </h3>
              <p className={`text-xs leading-tight ${badge.unlocked ? "text-gray-300" : "text-gray-500"}`}>
                {badge.description}
              </p>
              {badge.unlocked && badge.earned_at && (
                <p className="text-xs text-gray-500 mt-1">Earned: {new Date(badge.earned_at).toLocaleDateString()}</p>
              )}
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${badge.unlocked ? getRarityColor(badge.rarity) : "bg-gray-600 text-gray-400 border-gray-500"}`}
                >
                  {badge.rarity}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 text-purple-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Keep Going, Chef! 🎯</h3>
            <p className="text-sm">
              You're doing amazing! {allBadgeMetadata.length - unlockedCount} more badges to unlock.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{allBadgeMetadata.length > 0 ? Math.round((unlockedCount / allBadgeMetadata.length) * 100) : 0}%</div>
            <div className="text-sm">Complete</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeList;