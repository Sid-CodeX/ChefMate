import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { shoppingListService } from '@/services/shoppingListService';

const ShoppingList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shoppingListContent, setShoppingListContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShoppingList = async () => {
    if (!user?.token) {
      setShoppingListContent(null);
      setLoading(false);
      setError("Please log in to view your shopping list.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await shoppingListService.getLatestList(user.token);
      if (response && response.shoppingList) {
        setShoppingListContent(response.shoppingList);
      } else {
        setShoppingListContent(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load shopping list.");
      toast({
        title: "Error",
        description: err.message || "Failed to load shopping list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingList();
  }, [user?.token]);

  if (loading) {
    return (
      <div className="text-center py-12 text-white">
        <p>Loading your shopping list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shopping List</h1>
          <p className="text-gray-400">Your generated shopping list will appear here.</p>
        </div>
        <Card className="bg-[#2c2c3d] border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              <span>Shopping List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-red-400">
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Shopping List</h1>
        <p className="text-gray-400">Your generated shopping list will appear here.</p>
      </div>

      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            <span>Shopping List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shoppingListContent ? (
            <div className="whitespace-pre-wrap text-gray-200 p-4 rounded-md bg-gray-800">
              {shoppingListContent}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                Generate a shopping list from your meal planner to see items here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingList;
