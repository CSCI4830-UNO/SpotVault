"use client";
import Link from 'next/link';
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React from 'react';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {
  //useState() returns curr_val, setter_function()
  const [ModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    if (!email || !password) {
      alert("email & password required");
      return;
    }
    setLoading(true);
    const response = await fetch('/api/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, isSignUp: false }),
    })
    const data = await response.json();
    setLoading(false);
    if (data.error) {
      alert("Login failed: " + data.error)
    } else {
      setEmail("");
      setPassword("");
      setModalOpen(false);
    }
  }

  return (
    <header>
      <nav className="container mx-auto flex justify-center p-7">
        <Link href="/" className="text-5xl font-bold tracking-widest">
          SpotVault
        </Link>
      </nav>
      <button onClick={() => setModalOpen(true)} className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30">log in</button>
      <Dialog open={ModalOpen} onClose={() => setModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
            <DialogTitle className="text-2xl font-bold mb-4">
              Login
            </DialogTitle>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />

            <div className="flex gap-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
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
