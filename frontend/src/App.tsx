
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/MainLayout";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for better performance
const Landing = React.lazy(() => import("./pages/Landing"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const RecipeCustomizer = React.lazy(() => import("./pages/RecipeCustomizer"));
const Gamification = React.lazy(() => import("./pages/Gamification"));
const MealPlanner = React.lazy(() => import("./pages/MealPlanner"));
const ChiefMateChat = React.lazy(() => import("./pages/ChiefMateChat"));
const ShoppingList = React.lazy(() => import("./pages/ShoppingList"));
const Favorites = React.lazy(() => import("./pages/Favorites"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const LoginForm = React.lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = React.lazy(() => import("./components/auth/RegisterForm"));
const ForgotPasswordForm = React.lazy(() => import("./components/auth/ForgotPasswordForm"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const RecipeDetail = React.lazy(() => import("./pages/RecipeDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#1f2636] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordForm /></PublicRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
      <Route path="/recipe-customizer" element={<ProtectedRoute><RecipeCustomizer /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
      <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
      <Route path="/chiefmate" element={<ProtectedRoute><ChiefMateChat /></ProtectedRoute>} />
      <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
