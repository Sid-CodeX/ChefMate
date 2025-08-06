import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Copy } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { shoppingListService } from '@/services/shoppingListService';

const ShoppingList = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [shoppingListContent, setShoppingListContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to process the raw shopping list string and apply bold formatting
    const formatContent = (content: string) => {
        // Regex to find text wrapped in double asterisks and replace with <strong> tags
        return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

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
                // Access the 'content' property from the shoppingList object
                const listObject = response.shoppingList as { content: string, dishes: string[] };
                setShoppingListContent(listObject.content);
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
    
    const handleCopyToClipboard = useCallback(async () => {
        if (!shoppingListContent) {
            toast({
                title: "Nothing to copy",
                description: "The shopping list is empty.",
            });
            return;
        }
        try {
            await navigator.clipboard.writeText(shoppingListContent);
            toast({
                title: "Copied!",
                description: "Shopping list copied to clipboard.",
                variant: "success",
            });
        } catch (err) {
            console.error("Failed to copy:", err);
            toast({
                title: "Copy Failed",
                description: "Could not copy to clipboard. Please try again.",
                variant: "destructive",
            });
        }
    }, [shoppingListContent, toast]);

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

    const formattedContent = shoppingListContent ? formatContent(shoppingListContent) : null;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Shopping List</h1>
                <p className="text-gray-400">Your generated shopping list will appear here.</p>
            </div>

            <Card className="bg-[#2c2c3d] border-gray-700">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center space-x-2 text-white">
                            <ShoppingCart className="h-5 w-5 text-green-500" />
                            <span>Shopping List</span>
                        </CardTitle>
                        {shoppingListContent && (
                            <Button
                                onClick={handleCopyToClipboard}
                                size="sm"
                                variant="secondary"
                                className="h-8"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {formattedContent ? (
                        <div className="whitespace-pre-wrap text-gray-200 p-4 rounded-md bg-gray-800 max-h-[50vh] overflow-y-auto">
                            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
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