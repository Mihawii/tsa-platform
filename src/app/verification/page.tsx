"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function Verification() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically make an API call to verify the user
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to dashboard after verification
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect w-full max-w-md p-8 rounded-2xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Student Verification</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Gmail Address
              </label>
              <input
                type="email"
                id="email"
                required
                pattern="[a-z0-9._%+-]+@gmail\.com$"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="mt-1 text-sm text-gray-400">
                Please use your Gmail address
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
} 