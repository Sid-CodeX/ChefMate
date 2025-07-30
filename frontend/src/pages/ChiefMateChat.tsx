import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChefHat, User } from "lucide-react";
import { chatService } from "@/services/chatService"; 
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Message structure for backend communication
interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Message structure for UI display
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scrolls to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history or default greeting
  useEffect(() => {
    const loadHistory = async () => {
      const initialGreetingContent = "Hello! 👋 I'm ChiefMate, your personal cooking assistant. I can help you with recipes, cooking tips, ingredient substitutions, and meal planning. What would you like to cook today?";
      const initialGreeting: DisplayMessage = {
        id: "initial-greeting",
        role: "assistant", 
        content: initialGreetingContent,
        isUser: false,
        timestamp: new Date(Date.now() - 60000)
      };

      if (!user?.token) {
        setMessages([initialGreeting]);
        return;
      }

      setIsTyping(true);
      try {
        const historyFromBackend: LLMMessage[] = await chatService.getChatHistory(user.token);
        const formattedHistory: DisplayMessage[] = historyFromBackend.map((msg, index) => ({
          id: `${msg.role}-${index}-${new Date().getTime()}`,
          role: msg.role,
          content: msg.content || '',
          isUser: msg.role === 'user',
          timestamp: new Date(),
        }));

        const finalMessages = [];
        if (!formattedHistory.some(msg => msg.id === initialGreeting.id) && !formattedHistory.some(msg => msg.id === "initial-greeting-error")) {
             finalMessages.push(initialGreeting);
        }
        setMessages([...finalMessages, ...formattedHistory]);

      } catch (error: any) {
        console.error("Failed to load chat history:", error);
        toast({
          title: "Error loading chat history",
          description: error.message || "Could not retrieve previous conversations.",
          variant: "destructive",
        });
        setMessages([
          {
            id: "initial-greeting-error",
            role: "assistant",
            content: "Hello! 👋 I'm ChiefMate, your personal cooking assistant. There was an error loading your previous chat. How can I help you now?",
            isUser: false,
            timestamp: new Date()
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    };
    loadHistory();
  }, [user?.token, toast]);

  // Handles message send and response flow
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
      // Build clean history to send to backend
      const historyForLLM: LLMMessage[] = messages
        .filter(msg => 
          msg.id !== "initial-greeting" && 
          msg.id !== "initial-greeting-error" && 
          msg.content?.trim().length > 0
        )
        .map(msg => ({ role: msg.role, content: msg.content }));

      historyForLLM.push({ role: userDisplayMessage.role, content: userDisplayMessage.content });

      const response = await chatService.sendMessage(userMessageContent, historyForLLM, user.token); 
      
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

  // Handles Enter key for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">👨‍🍳 Talk to ChiefMate</h1>
        <p className="text-gray-400">Your personal cooking assistant — ask me anything about cooking, recipes, and meal planning!</p>
      </div>

      <Card className="flex-1 bg-[#2c2c3d] border-gray-700 flex flex-col">
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
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? 'bg-blue-500 ml-2' : 'bg-orange-500 mr-2'
                  }`}>
                    {message.isUser ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <ChefHat className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-700 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input section */}
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
