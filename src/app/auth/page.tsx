'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Removed useState and motion as they are no longer needed for the form
// import { useState } from 'react';
// import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate login for aerthea.branch@gmail.com
    const userName = 'Aerthea Branch'; // Using a name associated with the email
    const userEmail = 'aerthea.branch@gmail.com';
    
    // Redirect to home page with the simulated user's name
    // We are only passing the name as the landing page currently uses this for the greeting
    router.push(`/?name=${encodeURIComponent(userName)}`);
    
    // Note: In a real application, you would perform actual authentication here
    // and store user session information (e.g., in cookies or local storage)
    // instead of just redirecting with query parameters.
    
  }, [router]); // Dependency array includes router to ensure effect runs correctly

  // No need to render the form, as the redirect happens immediately
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Optional: Add a loading spinner or message here if needed */}
      <p className="text-white text-xl">Authorizing...</p>
    </main>
  );
} 