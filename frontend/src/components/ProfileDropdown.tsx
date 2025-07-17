
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20">
        <Avatar className="h-9 w-9 ring-2 ring-white/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
          <p className="text-xs text-gray-300">
            Level {user.level}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-300 hidden md:block" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-1"
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500">Level {user.level} Chef</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="py-1">
          <Link to="/profile">
            <DropdownMenuItem className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer rounded-md mx-1 transition-colors">
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span className="font-medium">View Profile</span>
            </DropdownMenuItem>
          </Link>
          
          <Link to="/settings">
            <DropdownMenuItem className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer rounded-md mx-1 transition-colors">
              <Settings className="h-4 w-4 mr-3 text-gray-500" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
          </Link>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-200 my-1" />
        
        <div className="py-1">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md mx-1 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
