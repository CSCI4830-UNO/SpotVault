"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React from 'react';
import HelpButton from './HelpButton';
import { useAuth } from '@/lib/AuthContext';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {
  //UI States
  //checks if you're already logged in on pageload.
  useEffect(() => {
    const loggedIn = localStorage.getItem('spotvault_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  const [ModalOpen, setModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    isLoggedIn,
    setIsLoggedIn,
    userId,
    setUserId,
    username: authUsername,
    setUsername: setAuthUsername,
    favoriteListId,
    setFavoriteListId,
  } = useAuth()

  //Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  //form pre-validation handler (ensures form is populated, passes error messages)
  async function validateForm(): Promise<boolean> {
    if (!email.trim()) {
      setError("Email is required")
      return false;
    }
    if (!password.trim()) {
      setError("Password is required")
      return false;
    }
    if (isSignUp && !username.trim()) {
      setError("Username is required")
      return false;
    }
    setError("")
    return true;
  }

  //login/signup handler
  async function handleAuth() {
    if (!validateForm()) {
      return
    }
    setLoading(true)
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login'
      const body = isSignUp ? { email, password, username } : { email, password }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const userData = await response.json()
      if (!response.ok || userData.error) {
        setError("Failed to Log In. Try Again.")
        setLoading(false)
        return
      }
      //user is logged in
      setIsLoggedIn(true);
      setUserId(userData.user.id);
      setUsername(userData.user.username);
      setFavoriteListId(userData.user.favoriteListId);
      // Store in localStorage
      localStorage.setItem('spotvault_logged_in', 'true');
      localStorage.setItem('spotvault_user_id', userData.user.id);
      localStorage.setItem('spotvault_username', userData.user.username);
      localStorage.setItem('spotvault_favorite_list_id', userData.user.favoriteListId);
      //clear form for clarity
      setEmail("");
      setPassword("");
      setUsername("");
      setModalOpen(false);
      setIsSignUp(false);
    } catch (error) {
      setError("Potetial Network Error. Please Try Again.")
      console.log("Network error: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  //logout handler
  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', { method: "POST" })
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      setIsLoggedIn(false);
      setUserId(null);
      setAuthUsername(null);
      setFavoriteListId(null);
      setEmail("");
      setPassword("");
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      alert("Error logging out. Please try again.")
      console.error("Logout Error", error)
    }
  }
  //seperated the things didn't want to build new modal so it's 2 in one.
  function openSignUpModal() {
    setIsSignUp(true);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
    setModalOpen(true);
  };

  function openLoginModal() {
    setIsSignUp(false);
    setError("");
    setEmail("");
    setPassword("");
    setModalOpen(true);
  };

  return (
    <header>
      <div className="container mx-auto flex justify-between items-center px-7 py-4">
        <Link href="/" className="text-5xl font-bold tracking-widest">
          SpotVault
        </Link>
        <div className="flex items-center gap-4">
          <HelpButton />

          {isLoggedIn ? (
            // LOGGED IN: Show logout button
            <div className="flex items-center gap-4">
              {authUsername}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            // NOT LOGGED IN: Show login/signup buttons
            <div className="flex gap-2">
              <button
                onClick={openLoginModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Log In
              </button>
              <button
                onClick={openSignUpModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={ModalOpen} onClose={() => setModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">

          <DialogPanel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
            <DialogTitle className="text-2xl font-bold mb-4">
              {isSignUp ? "Create Account" : "Log In"}
            </DialogTitle>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm">
                {error}
              </div>
            )}
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />

            <div className="flex gap-4">
              <button
                onClick={handleAuth}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Logging in..." : isSignUp ? "Sign Up" : "Login"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header >
  );
};

export default Header;
