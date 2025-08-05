import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Mail, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Profile Component
 * Displays user profile information.
 */
const Profile = () => {
    const { user, updateProfile, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editEmail, setEditEmail] = useState(user?.email || '');

    useEffect(() => {
        if (user) {
            setEditName(user.name);
            setEditEmail(user.email);
        }
    }, [user, isEditing]);

    const handleSaveProfile = async () => {
        const updates: Partial<typeof user> = { name: editName };
        const result = await updateProfile(updates);

        if (result.success) {
            toast({
                title: 'Profile Updated',
                description: result.message || 'Your profile has been successfully updated.',
            });
            setIsEditing(false);
        } else {
            toast({
                title: 'Update Failed',
                description: result.message || 'Failed to update profile. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white">Loading profile data...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">
                    Manage your personal details and account information.
                </p>
            </div>
            
            <Card className="bg-[#2c2c3d] border-gray-700 p-8">
                <CardContent className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
                    <Avatar className="h-32 w-32 border-4 border-orange-500 shadow-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-orange-500 text-white text-3xl font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                        <p className="text-lg text-gray-400">
                            <span className="inline-flex items-center space-x-1">
                                <Mail className="h-5 w-5" />
                                <span>{user.email}</span>
                            </span>
                        </p>
                        <div className="flex justify-center md:justify-start pt-4">
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#2c2c3d] border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Edit Profile</DialogTitle>
                                        <CardDescription className="text-gray-400">
                                            Update your personal details.
                                        </CardDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
                                            <Input
                                                id="name"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="col-span-3 bg-[#1e1e2f] border-gray-600 text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right text-gray-300">Email</Label>
                                            <Input
                                                id="email"
                                                value={editEmail}
                                                className="col-span-3 bg-[#1e1e2f] border-gray-600 text-white"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600">
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
    
export default Profile;