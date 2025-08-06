import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChefHat, User } from "lucide-react";
import { chatService } from "@/services/chatService"; 
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatMessages from "@/components/ChatMessages";

interface LLMMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface DisplayMessage { 
    id: string; 
    role: 'user' | 'assistant';
    content: string; 
    timestamp: Date;
    isUser: boolean; 
}

const ChiefMateChat = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const initialGreetingContent = "Hello! 👋 I'm ChiefMate, your personal cooking assistant. How can I help you today?";
        const initialGreeting: DisplayMessage = {
            id: "initial-greeting",
            role: "assistant", 
            content: initialGreetingContent,
            isUser: false,
            timestamp: new Date()
        };
        setMessages([initialGreeting]);
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user?.token) {
            toast({ title: "Login Required", description: "Please log in to chat with ChiefMate.", variant: "destructive" });
            return;
        }

        const userMessageContent = newMessage.trim();
        const userDisplayMessage: DisplayMessage = {
            id: Date.now().toString(),
            role: "user", 
            content: userMessageContent,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userDisplayMessage]);
        setNewMessage(""); 
        setIsTyping(true);

        try {
            const response = await chatService.sendMessage(userMessageContent, user.token); 
            
            const aiDisplayMessage: DisplayMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.reply,
                isUser: false,
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, aiDisplayMessage]);

        } catch (error: any) {
            console.error("Error sending message to AI:", error);
            toast({
                title: "Chat Error",
                description: `Failed to get a response from ChiefMate: ${error.message}. Please try again.`,
                variant: "destructive",
            });
            setMessages(prev => prev.filter(msg => msg.id !== userDisplayMessage.id)); 
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh]"> 
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">👨‍🍳 Talk to ChiefMate</h1>
                <p className="text-gray-400">Your personal cooking assistant — ask me anything about cooking, recipes, and meal planning!</p>
            </div>

            {/* FIX: Removed flex-1 and added a fixed height to the Card component */}
            <Card className="bg-[#2c2c3d] border-gray-700 flex flex-col h-[65vh]">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-white">
                        <ChefHat className="h-5 w-5 text-orange-500" />
                        <span>ChiefMate Assistant</span>
                        <div className="ml-auto flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-400">Online</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                    <ChatMessages messages={messages} isTyping={isTyping} />

                    <div className="border-t border-gray-700 p-4">
                        <div className="flex space-x-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask ChiefMate about cooking, recipes, or meal planning..."
                                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                disabled={isTyping || !user}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || isTyping || !user}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChiefMateChat;