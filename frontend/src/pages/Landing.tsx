import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Bot, Calendar, Star, Users, Sparkles, MessageSquare } from 'lucide-react'; // Added MessageSquare

const Landing = () => {
    const features = [
        {
            icon: <Bot className="h-12 w-12 text-orange-500" />,
            title: "Intelligent Ingredient Matching",
            description: "Input your pantry items and get personalized recipe suggestions instantly to minimize waste."
        },
        {
            icon: <Sparkles className="h-12 w-12 text-orange-500" />,
            title: "AI-Powered Recipe Rewriting",
            description: "Transform any recipe to be vegan, gluten-free, or faster to cook with instant AI modification."
        },
        {
            icon: <MessageSquare className="h-12 w-12 text-orange-500" />, // Replaced Trophy with MessageSquare
            title: "Interactive AI Chat Assistant",
            description: "Get real-time answers and personalized cooking advice from our dedicated chatbot, ChiefMate."
        },
        {
            icon: <Calendar className="h-12 w-12 text-orange-500" />,
            title: "Smart Meal Planning",
            description: "Plan your entire week's meals with drag-and-drop simplicity and generate a consolidated grocery list."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Home Cook",
            content: "ChefMate transformed my cooking! I've discovered so many new recipes using ingredients I already had.",
            rating: 5
        },
        {
            name: "Mike Rodriguez",
            role: "Busy Parent",
            content: "The AI rewriter is amazing—I can make any recipe work for my family's dietary needs.",
            rating: 5
        },
        // FIX: Updated testimonial to remove gamification reference
        {
            name: "Emma Thompson",
            role: "Cooking Enthusiast",
            content: "The real-time performance and instant access to shopping lists make cooking so much more efficient.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#1f2636]">
            {/* Navigation */}
            <nav className="bg-[#242c3c] border-b border-gray-700 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ChefHat className="h-8 w-8 text-orange-500" />
                        <span className="text-xl font-bold text-white">ChefMate</span>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/login">
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-300 text-sm font-medium">AI-Powered Cooking Assistant</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Your Personal
                            <span className="text-orange-500 block">Cooking Companion</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Transform your cooking experience with AI-powered recipe suggestions, 
                            intelligent meal planning, and streamlined grocery tracking.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link to="/register">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-3">
                                Start Cooking for Free 🍳
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-3">
                                I Already Have an Account
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Image Placeholder */}
                    <div className="relative">
                        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-8 rounded-2xl border border-gray-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-6xl">
                                <div className="animate-bounce" style={{ animationDelay: '0s' }}>🍳</div>
                                <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>🥘</div>
                                <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍲</div>
                                <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>👨‍🍳</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 bg-[#1e1e2f]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Everything You Need to Cook Better
                        </h2>
                        <p className="text-xl text-gray-400">
                            Powerful features designed to make cooking easier and more enjoyable
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-[#2a2f45] border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                                <CardHeader className="text-center">
                                    <div className="flex justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-white">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-400 text-center">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Loved by Home Cooks Everywhere
                        </h2>
                        <p className="text-xl text-gray-400">
                            See what our community is saying about ChefMate
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-[#2a2f45] border-gray-700">
                                <CardContent className="pt-6">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{testimonial.name}</p>
                                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Cooking?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of home cooks who are already cooking smarter with ChefMate
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-3">
                            Start Your Culinary Journey Today 🚀
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#242c3c] border-t border-gray-700 px-6 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <ChefHat className="h-6 w-6 text-orange-500" />
                        <span className="text-lg font-bold text-white">ChefMate</span>
                    </div>
                    <p className="text-gray-400">
                        © 2025 ChefMate. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;