"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/Components/ui/Button";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ from env

const SignupPage: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("creator"); // default role
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ Basic validation
    if (!name || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      console.log("✅ Signup successful:", data);

      // If backend returns tokens and user, auto-login; else fallback to login
      if (data?.data?.tokens?.accessToken && data?.data?.user) {
        localStorage.setItem('token', data.data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        const role = data.data.user?.role;
        router.push(role === 'brand' ? '/brand' : '/creator');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      console.error("Signup error:", err instanceof Error ? err.message : 'Unknown error');
      setError("Network error. Please try again later.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 placeholder:text-white/50 focus:outline-none"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 placeholder:text-white/50 focus:outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 text-black focus:outline-none"
          >
            <option value="creator">Creator</option>
            <option value="brand">Brand</option>
          </select>
          <Button type="submit" size="md" className="w-full mt-2">
            Sign Up
          </Button>
        </form>

        {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}

        <div className="mt-4 text-sm text-white/70 text-center">
          Already have an account?{" "}
          <Link href="/login" className="hover:text-white font-medium">
            Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default SignupPage;
