import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * RegisterForm Component
 * Facilitates new user registration, including name, email, and password.
 * Integrates with AuthContext for registration logic and provides user feedback.
 */
const RegisterForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * Handles form submission for user registration.
   * Includes password confirmation validation. Calls the authentication context's
   * register method and provides user feedback.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: 'Please ensure both password fields match.',
        variant: 'destructive',
      });
      return;
    }

    const result = await register(name, email, password); // AuthContext now returns { success, message }

    if (result.success) {
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Redirecting to dashboard.',
      });
      navigate('/dashboard'); // Navigate to dashboard on successful registration
    } else {
      toast({
        title: 'Registration Failed',
        description: result.message || 'An error occurred during registration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with blur and gradient overlay for visual depth */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        {/* Changed opacity from /60 to /30 and backdrop-blur-sm to backdrop-blur-xs for less blur */}
        <div className="absolute inset-0 backdrop-blur-xs bg-black/30"></div>
      </div>

      {/* Stylized overlay with floating shapes and grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f2e]/90 via-[#121825]/85 to-[#0f1419]/90">
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-60 left-32 w-24 h-24 bg-blue-400/10 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-pink-500/10 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDM)”] opacity-20"></div>
      </div>

      {/* Main registration card container */}
      <div className="relative z-10 animate-fade-in">
        <Card className="w-full max-w-lg bg-[#2c2f3d]/90 backdrop-blur-xl border-gray-700/50 rounded-2xl shadow-2xl border">
          <CardHeader className="text-center pb-2">
            {/* ChefMate logo and title */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-full">
                  <ChefHat className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Join ChefMate
            </CardTitle>
            <p className="text-gray-400 text-lg font-medium">Your AI Cooking Companion</p>
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
              Start your culinary adventure today! <span className="text-orange-400"></span>
            </p>
          </CardHeader>
          <CardContent className="pt-6 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Full name input field */}
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 bg-[#1e1e2f]/80 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    required
                  />
                </div>

                {/* Email input field */}
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-[#1e1e2f]/80 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    required
                  />
                </div>

                {/* Password input field */}
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-[#1e1e2f]/80 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    required
                  />
                </div>

                {/* Confirm password input field */}
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-12 bg-[#1e1e2f]/80 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit button with loading state */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login link and value proposition */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <span>Join thousands of home chefs!</span>
                <span className="text-orange-400">👨‍🍳👩‍🍳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;