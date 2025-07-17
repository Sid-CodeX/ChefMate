
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Mail, User, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      name: editName,
      email: editEmail,
    });

    if (success) {
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockBadges = [
    { name: "First Recipe", description: "Cooked your first recipe!", unlocked: true },
    { name: "Healthy Chef", description: "Made 10 healthy recipes", unlocked: true },
    { name: "Speed Demon", description: "Completed 5 quick recipes", unlocked: true },
    { name: "Vegan Master", description: "Made 20 vegan recipes", unlocked: false },
    { name: "Recipe Creator", description: "Created 5 custom recipes", unlocked: false },
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Info Card */}
      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Profile Information
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-[#1e1e2f] border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-[#1e1e2f] border-gray-600 text-white"
                    />
                  </div>
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
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-orange-500 text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="h-4 w-4" />
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
                    {mockBadges.filter(b => b.unlocked).length}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBadges.map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  badge.unlocked
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-600 bg-gray-700/50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    badge.unlocked ? 'bg-orange-500' : 'bg-gray-600'
                  }`}>
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      badge.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-400">{badge.description}</p>
                  </div>
                </div>
                {badge.unlocked && (
                  <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
