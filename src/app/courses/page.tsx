"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useSession } from '../session';
import { useRouter } from 'next/navigation';

const COURSE_DATA = [
  {
    week: 1,
    title: 'Introduction to Entrepreneurship',
    lessons: [
      {
        title: 'What is Entrepreneurship?',
        description: 'Learn the fundamentals of entrepreneurship and what it takes to be a successful entrepreneur.',
        slug: 'lesson-1',
      },
      {
        title: 'Business vs Entrepreneurship',
        description: 'Understand the key differences between traditional business and entrepreneurship.',
        slug: 'lesson-2',
      },
    ],
  },
  {
    week: 2,
    title: 'Branding & Identity',
    lessons: [
      {
        title: 'What Is a Brand?',
        description: 'Explore the fundamentals of branding through interactive activities and real-world examples.',
        slug: 'lesson-1',
      },
      {
        title: 'Building Your Brand Identity',
        description: 'Learn how to create a compelling brand identity that resonates with your target audience.',
        slug: 'lesson-2',
      },
    ],
  },
  {
    week: 3,
    title: 'Agile Project Management',
    lessons: [
      {
        title: 'Agile Basics',
        description: 'Learn the basics of agile methodology and how to apply it to your project.',
        slug: 'lesson-1',
      },
    ],
  },
];

const STATUS_COLORS = {
  'Completed': 'bg-green-700 text-green-100',
  'In Progress': 'bg-yellow-700 text-yellow-100',
  'Not Started': 'bg-gray-700 text-gray-300',
};

interface LessonProgress {
  status: 'Completed' | 'In Progress' | 'Not Started';
  score: number;
}

export default function CoursesPage() {
  const [openWeek, setOpenWeek] = useState<number | null>(0);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const { user, logout } = useSession();
  const router = useRouter();

  // Store all lesson progress in state to avoid SSR issues
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: LessonProgress }>({});

  // Initialize progress in localStorage and state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tsa_user');
    if (!stored) {
      window.location.replace('/login');
    } else {
      setIsAuthChecked(true);
      const progressObj: { [key: string]: LessonProgress } = {};
      COURSE_DATA.forEach((week, weekIndex) => {
        week.lessons.forEach((_, lessonIndex) => {
          const key = `week${week.week}_lesson${lessonIndex + 1}_progress`;
          let value = localStorage.getItem(key);
          if (!value) {
            // For testing: Mark Week 1 lessons as completed
            if (week.week === 1) {
              value = JSON.stringify({ status: 'Completed', score: 100 });
              localStorage.setItem(key, value);
            } else {
              value = JSON.stringify({ status: 'Not Started', score: 0 });
              localStorage.setItem(key, value);
            }
          }
          progressObj[key] = JSON.parse(value);
        });
      });
      setLessonProgress(progressObj);
    }
  }, []);

  // Helper to get lesson progress from state
  const getLessonProgress = (week: number, lesson: number): LessonProgress => {
    const key = `week${week}_lesson${lesson}_progress`;
    return lessonProgress[key] || { status: 'Not Started', score: 0 };
  };

  // Update lesson progress in state and localStorage
  const updateLessonProgress = (week: number, lesson: number, status: 'Completed' | 'In Progress' | 'Not Started', score: number = 0) => {
    const key = `week${week}_lesson${lesson}_progress`;
    const newProgress = { status, score };
    setLessonProgress(prev => ({ ...prev, [key]: newProgress }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newProgress));
    }
  };

  // Calculate week progress
  const calculateWeekProgress = (week: number): number => {
    const weekData = COURSE_DATA[week - 1];
    if (!weekData) return 0;
    const lessonProgresses = weekData.lessons.map((_, lessonIndex) =>
      getLessonProgress(week, lessonIndex + 1)
    );
    const completedLessons = lessonProgresses.filter(p => p.status === 'Completed').length;
    return (completedLessons / weekData.lessons.length) * 100;
  };

  // Calculate all week progress
  const weekProgressArray = COURSE_DATA.map((_, index) => calculateWeekProgress(index + 1));

  // Calculate overall progress
  const overall = weekProgressArray.reduce((acc, curr) => acc + curr, 0) / weekProgressArray.length;

  // Check if a lesson is accessible
  const isLessonAccessible = (week: number, lesson: number): boolean => {
    if (week === 1) return true;
    if (week === 2) {
      const week1Progress = calculateWeekProgress(1);
      return week1Progress === 100;
    }
    // For Week 3+, always accessible
    if (week === 3) return true;
    // For Week 4+, check if previous week is completed
    const prevWeekProgress = calculateWeekProgress(week - 1);
    return prevWeekProgress === 100;
  };

  // Get lesson status
  const getLessonStatus = (week: number, lesson: number): 'Completed' | 'In Progress' | 'Not Started' => {
    const progress = getLessonProgress(week, lesson);
    return progress.status;
  };

  // Mark lesson as in progress when clicked
  const handleLessonClick = (week: number, lesson: number, slug: string) => {
    const currentStatus = getLessonStatus(week, lesson);
    if (currentStatus === 'Not Started') {
      updateLessonProgress(week, lesson, 'In Progress');
    }
    setIsTransitioning(true);
    setPendingRoute(`/courses/week-${week}/${slug}`);
    setTimeout(() => {
      router.push(`/courses/week-${week}/${slug}`);
    }, 700);
  };

  if (!isAuthChecked) return null;

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navigation />
      <AnimatePresence mode="wait">
        {!isTransitioning ? (
          <motion.div
            key="courses-list"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="max-w-3xl mx-auto pt-40 pb-16 px-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {user && (
                <div className="mb-6 text-2xl font-bold text-silver-400">Welcome, {user.name}!</div>
              )}
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text text-left">Course Modules</h1>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl">Explore our comprehensive curriculum designed to help you build a successful entrepreneurial journey. Each week focuses on different aspects of entrepreneurship.</p>
              {/* Overall Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold text-silver-400">Overall Progress</span>
                  <span className="text-silver-400 font-bold">{Math.round(overall)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-silver-400 to-silver-600" style={{ width: `${overall}%` }} />
                </div>
              </div>
              {/* Weeks */}
              <div className="space-y-6">
                {COURSE_DATA.map((week, i) => {
                  const weekProgress = weekProgressArray[i];
                  const completedLessons = week.lessons.filter((_, lessonIndex) => 
                    getLessonStatus(week.week, lessonIndex + 1) === 'Completed'
                  ).length;

                  return (
                    <div
                      key={week.week}
                      className={`rounded-2xl shadow-lg bg-gray-900/90 transition-all duration-300 ${openWeek === i ? 'ring-2 ring-silver-400' : ''}`}
                    >
                      <button
                        className={`w-full flex items-center justify-between px-6 py-5 text-left font-bold text-xl md:text-2xl transition focus:outline-none ${openWeek === i ? 'bg-gray-800/80' : 'bg-gray-900/80'}`}
                        onClick={() => setOpenWeek(openWeek === i ? null : i)}
                      >
                        <span>Week {week.week}: {week.title}</span>
                        <span className="ml-4 text-base font-normal text-silver-400">{completedLessons}/{week.lessons.length} done</span>
                        <svg className={`ml-4 w-6 h-6 transition-transform ${openWeek === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {openWeek === i && (
                        <motion.div
                          initial={{ x: -40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 40, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden px-6 pb-6"
                        >
                          <div className="flex items-center gap-4 mt-4 mb-2">
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-silver-400 to-silver-600" style={{ width: `${weekProgress}%` }} />
                            </div>
                            <span className="text-xs text-silver-400 font-bold">{Math.round(weekProgress)}%</span>
                            <span className="text-xs text-gray-400">{week.lessons.length - completedLessons} left</span>
                          </div>
                          <div className="space-y-4 mt-2">
                            {week.lessons.map((lesson, j) => {
                              const status = getLessonStatus(week.week, j + 1);
                              const isAccessible = isLessonAccessible(week.week, j + 1);

                              return (
                                <button
                                  key={j}
                                  className={`flex items-center bg-gray-800/80 rounded-xl px-4 py-3 shadow border border-gray-700 w-full text-left transition ${
                                    isAccessible 
                                      ? 'hover:ring-2 hover:ring-orange-400' 
                                      : 'opacity-50 cursor-not-allowed'
                                  }`}
                                  onClick={() => {
                                    if (!isAccessible) return;
                                    handleLessonClick(week.week, j + 1, lesson.slug);
                                  }}
                                  disabled={isTransitioning || !isAccessible}
                                >
                                  <div className="mr-4 text-2xl text-silver-400">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-lg text-white mb-1">Lesson {j + 1}: {lesson.title}</div>
                                    <div className="text-gray-400 text-sm">{lesson.description}</div>
                                  </div>
                                  <div className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[status]}`}>
                                    {status}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loading-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center justify-center min-h-screen"
          >
            <div className="w-20 h-20 border-4 border-silver-400 border-t-transparent rounded-full animate-spin mb-6" />
            <div className="text-silver-400 text-xl font-semibold tracking-wide">Loading lesson...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 