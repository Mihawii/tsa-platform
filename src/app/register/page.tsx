"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// List of authorized students
const AUTHORIZED_STUDENTS = ["aerthea.branch@gmail.com"];
const FIXED_PASSWORD = "1323345tzxc";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is authorized
    if (!AUTHORIZED_STUDENTS.includes(email.trim().toLowerCase())) {
      setError("You are not authorized to access this platform.");
      return;
    }

    // Check if password matches the fixed password
    if (password !== FIXED_PASSWORD) {
      setError("Incorrect password.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Store user data in localStorage
    localStorage.setItem(
      "tsa_user",
      JSON.stringify({ 
        email: email.trim().toLowerCase(), 
        name: name.trim() || email.split("@")[0] 
      })
    );

    // Redirect to home page
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 p-10 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold mb-2">Student Registration</h1>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="px-4 py-3 rounded bg-gray-800 text-white mb-2"
        />
        {error && <div className="text-red-400 font-medium">{error}</div>}
        <button
          type="submit"
          className="bg-white text-black font-bold py-3 rounded-lg mt-2 hover:bg-gray-200 transition"
        >
          Register
        </button>
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-orange-400 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </main>
  );
} 