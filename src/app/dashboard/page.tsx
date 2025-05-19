'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function Dashboard() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-8 rounded-2xl mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
          <p className="text-gray-300">
            Access your courses, get help from our AI assistant, and explore extracurricular opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'My Courses',
              description: 'Continue your learning journey',
              href: '/courses',
              icon: '📚',
            },
            {
              title: 'AI Assistant',
              description: 'Get instant help and guidance',
              href: '/ai-assistant',
              icon: '🤖',
            },
            {
              title: 'Extracurriculars',
              description: 'Explore opportunities beyond the classroom',
              href: '/extracurriculars',
              icon: '🌟',
            },
          ].map((card, index) => (
            <motion.a
              key={index}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect p-6 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-300">{card.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
} 