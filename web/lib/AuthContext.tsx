"use client";
import { User } from '@supabase/supabase-js';
//we're using authcontext so I don't have to prop drill. 
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  username: string | null;
  setUsername: (name: string | null) => void;
  favoriteListId: string | null;
  setFavoriteListId: (id: string | null) => void;
}
//acts as universal state, provides context to all the react components about whether you're logged in or not. 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [favoriteListId, setFavoriteListId] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('spotvault_logged_in') === 'true';
    const userId = localStorage.getItem('spotvault_user_id');
    const username = localStorage.getItem('spotvault_username');
    const favoriteListId = localStorage.getItem('spotvault_favorite_list_id');
    setIsLoggedIn(loggedIn);
    setUserId(userId);
    setUsername(username);
    setFavoriteListId(favoriteListId);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, favoriteListId, setFavoriteListId, setUserId, setUsername, username, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
