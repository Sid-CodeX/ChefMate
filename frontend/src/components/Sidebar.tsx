
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, CookingPot, Trophy, Calendar, Heart, Menu, X, MessageCircle } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: <ChefHat className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <CookingPot className="h-5 w-5" />, label: "AI Rewriter", path: "/recipe-customizer" },
    { icon: <Heart className="h-5 w-5" />, label: "Favorites", path: "/favorites" },
    { icon: <Trophy className="h-5 w-5" />, label: "Achievements", path: "/gamification" },
    { icon: <Calendar className="h-5 w-5" />, label: "Meal Planner", path: "/meal-planner" },
    { icon: <MessageCircle className="h-5 w-5" />, label: "ChiefMate Chat", path: "/chiefmate" },
  ];

  return (
    <div className={`bg-[#242c3c] border-r border-gray-700 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <ChefHat className="h-8 w-8 text-orange-500" />
          {!collapsed && <span className="text-xl font-bold text-white">ChefMate</span>}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-orange-500 text-white hover:bg-orange-600" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
