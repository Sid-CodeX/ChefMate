
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const ShoppingList = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Shopping List 🛒
        </h1>
        <p className="text-gray-400">
          Your generated shopping list will appear here.
        </p>
      </div>

      <Card className="bg-[#2c2c3d] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            <span>Shopping List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              Generate a shopping list from your meal planner to see items here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingList;
