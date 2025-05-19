'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // On mount, get user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tsa_user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name);
      setUserEmail(user.email);
      setShowGreeting(true);
    } else {
      window.location.replace('/login');
    }
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop for parallax and cursor
  useEffect(() => {
    const animate = () => {
      // Only apply parallax if NOT showing greeting
      if (!showGreeting && containerRef.current) {
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const relX = mouseRef.current.x - left;
        const relY = mouseRef.current.y - top;
        let x = (relX - width / 2) / 20;
        let y = (relY - height / 2) / 20;
        // Clamp the rotation to -10deg to 10deg
        x = Math.max(-10, Math.min(10, x));
        y = Math.max(-10, Math.min(10, y));
        containerRef.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
      } else if (containerRef.current) {
        // Reset transform when greeting is shown
        containerRef.current.style.transform = 'none';
      }
      // Cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [showGreeting]);

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => setShowGreeting(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  return (
    <main className="relative min-h-screen">
      <Navigation />
      <CustomCursor />
      
      {/* Interactive Background - Only subtle elements */}
      <div className="interactive-bg">
        <div className="dot-grid" />
        <div className="vignette" />
      </div>

      {/* Main Content Area - Conditional Rendering and Animation */}
      <div 
        ref={containerRef} /* Parallax container remains for both states */
        className="parallax-container flex items-center justify-center min-h-screen"
      >
        <div className="relative z-10 text-center px-4">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="loading-spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center justify-center min-h-screen"
              >
                <div className="w-20 h-20 border-4 border-silver-400 border-t-transparent rounded-full animate-spin mb-6" />
                <div className="text-silver-400 text-xl font-semibold tracking-wide">Loading courses...</div>
              </motion.div>
            ) : showGreeting ? (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl md:text-8xl font-bold mb-4 gradient-text tracking-tight">
                  Hello, {userName}!
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                  Welcome to The Start Academy
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="tsa-landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="p-16 md:p-24"
              >
                <h1 className="text-8xl md:text-[12rem] font-bold mb-6 gradient-text tracking-tight">
                  TSa
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide mb-12">
                  Welcome to The Start Academy
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <button
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        window.location.href = "/courses";
                      }, 700);
                    }}
                    className="primary-button px-16 py-5 text-xl font-medium rounded-full inline-block"
                  >
                    Get Started
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
} 