"use client";
import { useState, useEffect } from "react";
import { APPROVED_STUDENTS } from "../students";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Debug output
    console.log("Login attempt:", { email, password, APPROVED_STUDENTS });
    const isApproved = APPROVED_STUDENTS.some(
      (approvedEmail) => approvedEmail.toLowerCase() === email.trim().toLowerCase()
    );
    if (!isApproved) {
      setError("You are not authorized to access this platform.");
      return;
    }
    if (password !== "1323345tzxc") {
      setError("Incorrect password.");
      return;
    }
    // Use entered name for greeting
    const displayName = name.trim() || email.split("@")[0];
    localStorage.setItem(
      "tsa_user",
      JSON.stringify({ email: email.trim().toLowerCase(), name: displayName })
    );
    setError("");
    window.location.replace("/");
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tsa_user', JSON.stringify({ name: 'Student', email: 'student@tsa.com' }));
      window.location.replace("/");
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 p-10 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold mb-2">Student Login</h1>
        <input
          type="text"
          placeholder="Full Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-3 rounded bg-gray-800 text-white mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded bg-gray-800 text-white mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded bg-gray-800 text-white mb-2"
        />
        {error && <div className="text-red-400 font-medium" data-testid="login-error">{error}</div>}
        <button
          type="submit"
          className="bg-white text-black font-bold py-3 rounded-lg mt-2 hover:bg-gray-200 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
} 