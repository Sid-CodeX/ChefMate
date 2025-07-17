
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    
    if (success) {
      setIsSubmitted(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#121826] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#2c2c3d] border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <p className="text-gray-400">
              We've sent password reset instructions to {email}
            </p>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121826] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2c2c3d] border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <p className="text-gray-400">Enter your email to receive reset instructions</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#1e1e2f] border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-orange-500 hover:text-orange-400 flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
