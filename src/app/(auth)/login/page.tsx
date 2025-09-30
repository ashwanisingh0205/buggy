"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/Components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ from env

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Assuming backend returns { token, user }
      localStorage.setItem("token", data.data.tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      

      router.push("/creator");
    } catch (err: any) {
      setError("Network error. Please try again later.");
      console.error("Login error:", err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        // allow starting Google without app auth; fall back to state with anonymous marker
        localStorage.setItem('token', 'guest');
      }
      const callbackUrl = `${window.location.origin}/auth/google/callback`;
      const res = await fetch(`${API_BASE_URL}/api/google/auth-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || 'guest'}` },
        body: JSON.stringify({ redirectUri: callbackUrl })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.authURL) {
        setError(data.message || data.error || 'Failed to start Google auth');
        return;
      }
      localStorage.setItem('google_state', data.state || '');
      window.location.href = data.authURL;
    } catch (e: any) {
      setError(e.message || 'Failed to start Google auth');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-black/70 backdrop-blur-md rounded-3xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 placeholder:text-white/50 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 placeholder:text-white/50 focus:outline-none"
          />
          <Button type="submit" size="md" className="w-full mt-2">
            Login
          </Button>
        </form>
        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        <div className="mt-4 flex justify-between text-sm text-white/70">
          <Link href="/forgot-password" className="hover:text-white">
            Forgot Password?
          </Link>
          <Link href="/signup" className="hover:text-white">
            Sign Up
          </Link>
        </div>
        <div className="mt-6">
          <button onClick={handleGoogle} className="w-full bg-white text-black rounded-xl py-2 font-medium hover:bg-gray-100">
            Continue with Google
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginPage;
