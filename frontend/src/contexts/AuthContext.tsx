import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Type definition for the authenticated user
interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  avatar?: string;
  token?: string; 
}

// Interface for the authentication context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app and manage auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persist user and token in localStorage
  const saveUserToLocalStorage = (userData: User, token: string) => {
    const userToStore = { ...userData, token };
    localStorage.setItem('chefmate_user', JSON.stringify(userToStore));
    setUser(userToStore);
  };

  // Clear user data from localStorage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('chefmate_user');
    setUser(null);
  };

  // Load and validate stored user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUserString = localStorage.getItem('chefmate_user');
      if (storedUserString) {
        try {
          const storedUser: User = JSON.parse(storedUserString);
          if (storedUser.token) {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedUser.token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              saveUserToLocalStorage(data.user, storedUser.token);
            } else {
              console.warn('Token is invalid or expired.');
              removeUserFromLocalStorage();
            }
          } else {
            removeUserFromLocalStorage();
          }
        } catch (error) {
          console.error('Error loading user:', error);
          removeUserFromLocalStorage();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Handle login
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data.user, data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      return { success: false, message: error.message || 'Network error during login.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data.user, data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message || 'Network error during registration.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user data and optionally notify backend
  const logout = () => {
    removeUserFromLocalStorage();
    // Optionally trigger backend logout if using sessions
    // Example: fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${user?.token}` } });
  };

  // Send forgot password request
  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'Password reset link sent.' };
      } else {
        return { success: false, message: data.message || 'Unable to send reset link.' };
      }
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      return { success: false, message: error.message || 'Network error during password reset request.' };
    }
  };

  // Reset password using token
  const resetPassword = async (token: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'Password reset successful.' };
      } else {
        return { success: false, message: data.message || 'Failed to reset password.' };
      }
    } catch (error: any) {
      console.error('Reset password failed:', error);
      return { success: false, message: error.message || 'Network error during password reset.' };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    if (!user || !user.token) {
      return { success: false, message: 'User not authenticated.' };
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data.user, user.token);
        return { success: true, message: 'Profile updated successfully.' };
      } else {
        return { success: false, message: data.message || 'Failed to update profile.' };
      }
    } catch (error: any) {
      console.error('Update profile failed:', error);
      return { success: false, message: error.message || 'Network error during profile update.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Provide authentication state and actions to consumers
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
