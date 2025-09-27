"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/Components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";



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

    // Development mode - bypass backend
    console.log("Development login for:", email);
    
    // Create mock token and user data
    const mockToken = `dev_token_${Date.now()}`;
    const mockUser = {
      email,
      name: email.split('@')[0],
      role: 'creator'
    };

    // Save to localStorage
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    // Redirect to dashboard
    router.push("/creator");
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
      </motion.div>
    </section>
  );
};

export default LoginPage;
