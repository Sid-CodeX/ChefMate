import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Mail, User as UserIcon, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Interface for a badge returned from the backend.
 * Includes earned_at for user-specific badges and metadata from the badges table.
 */
interface UserBadge {
  badge_name: string;
  earned_at: string; // ISO date string
  description: string;
  type: string;
  category: string;
  rarity: string;
  icon_url: string;
}

/**
 * Profile Component
 * Displays user profile information, including name, email, XP, level, and earned badges.
 * Provides functionality to update user's profile details via a dialog.
 */
const Profile = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth(); // Destructure authLoading
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || ''); // Keeping for display, not updated by current backend
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]); // State for fetched badges
  const [badgesLoading, setBadgesLoading] = useState(true); // Loading state for badges

  // Synchronize local edit state with user context on user data changes or dialog open
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user, isEditing]);

  // Fetch user badges when user data is available
  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!user || !user.token) {
        setBadgesLoading(false);
        setUserBadges([]);
        return;
      }

      setBadgesLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/badges/user`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserBadges(data.badges);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch user badges:', errorData.message || response.statusText);
          toast({
            title: 'Badge Fetch Failed',
            description: errorData.message || 'Could not retrieve user badges.',
            variant: 'destructive',
          });
          setUserBadges([]); // Clear badges on error
        }
      } catch (error) {
        console.error('Network error fetching user badges:', error);
        toast({
          title: 'Network Error',
          description: 'Failed to connect to badge service.',
          variant: 'destructive',
        });
        setUserBadges([]); // Clear badges on network error
      } finally {
        setBadgesLoading(false);
      }
    };

    fetchUserBadges();
  }, [user?.id, user?.token, toast]); // Re-fetch if user ID or token changes

  /**
   * Handles saving profile changes.
   * Calls the authentication context's updateProfile method and displays toast feedback.
   */
  const handleSaveProfile = async () => {
    // Collect updates. Only 'name' is sent if backend doesn't support email updates for this endpoint.
    const updates: Partial<typeof user> = { name: editName };
    // If your backend supports email updates, uncomment the line below after extending your API:
    // if (editEmail !== user?.email) updates.email = editEmail;

    const result = await updateProfile(updates); // AuthContext returns { success, message }

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: result.message || 'Your profile has been successfully updated.',
      });
      setIsEditing(false); // Close the dialog on successful update
    } else {
      toast({
        title: 'Update Failed',
        description: result.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Display loading spinner if auth data or badges are loading
  if (authLoading || badgesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading profile data...</p> {/* You can replace with a proper spinner */}
      </div>
    );
  }

  // Render nothing if user data is not available after loading
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4"> {/* Added p-4 for some padding */}
      {/* Profile Information Card */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Profile Information
            {/* Dialog for editing profile */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-600 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2c2c3d] border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Name input field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-[#1e1e2f] border-gray-600 text-white"
                    />
                  </div>
                  {/* Email input field - read-only as backend currently only updates name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-[#1e1e2f] border-gray-600 text-white"
                      readOnly // Set to readOnly as backend's updateProfile currently only updates name
                    />
                  </div>
                  {/* Action buttons for dialog */}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            {/* User Avatar display */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-orange-500 text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User details display */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">Name</span>
                  </div>
                  <p className="text-white font-medium">{user.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              {/* XP, Level, and Badges Earned statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-orange-500 mb-1">
                    <Trophy className="h-5 w-5" />
                    <span className="text-2xl font-bold">{user.level}</span>
                  </div>
                  <p className="text-sm text-gray-400">Level</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                    <Star className="h-5 w-5" />
                    <span className="text-2xl font-bold">{user.xp}</span>
                  </div>
                  <p className="text-sm text-gray-400">Total XP</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    {userBadges.length} {/* Display count of fetched badges */}
                  </div>
                  <p className="text-sm text-gray-400">Badges Earned</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cooking Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {userBadges.length === 0 && !badgesLoading ? (
            <p className="text-gray-400 text-center">No badges earned yet. Start cooking!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBadges.map((badge, index) => (
                <div
                  key={badge.badge_name || index} // Use badge_name as key if unique, otherwise index
                  className={`p-4 rounded-lg border-2 transition-all border-orange-500 bg-orange-500/10`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-orange-500">
                      {/* Using a generic Trophy icon, but you can use badge.icon_url here */}
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{badge.badge_name}</h3>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      <p className="text-xs text-gray-500">Earned: {new Date(badge.earned_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className="mt-2 bg-green-500 hover:bg-green-600">Unlocked</Badge>
                  {/* You could add more badge details here like rarity etc. */}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;