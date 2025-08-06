import React, { useRef, useEffect } from 'react';
import { ChefHat, User } from 'lucide-react';

interface DisplayMessage { 
    id: string; 
    role: 'user' | 'assistant';
    content: string; 
    timestamp: Date;
    isUser: boolean; 
}

interface ChatMessagesProps {
    messages: DisplayMessage[];
    isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
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
                            {/* FIX: Added break-words to handle long content */}
                            <p className="text-sm break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                                message.isUser ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

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
    );
};

export default ChatMessages;