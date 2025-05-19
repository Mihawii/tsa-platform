"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "characteristics", label: "Entrepreneur Traits" },
  { id: "stories", label: "Stories Carousel" },
  { id: "brainstorm", label: "Problem/Solution" },
  { id: "riskreward", label: "Risk/Reward" },
  { id: "empathy", label: "Empathy Map" },
  { id: "mindset", label: "Mindset" },
  { id: "yc", label: "YC Scenario" },
  { id: "reflection", label: "Mini-Reflection" },
  { id: "quiz", label: "Quiz" },
];

// Add new sections to the lesson flow
const extendedSections = [
  "introduction",
  "characteristics",
  "stories",
  "brainstorm",
  "riskreward",
  "empathy",
  "mindset",
  "yc",
  "reflection",
  "quiz"
];

export default function Lesson1Page() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [sectionProgress, setSectionProgress] = useState<string[]>([]);
  // Interactive checklist for characteristics
  const characteristicsList = [
    "Vision and Creativity",
    "Resilience and Persistence",
    "Risk Tolerance",
    "Adaptability",
    "Customer Focus",
  ];
  const [checkedTraits, setCheckedTraits] = useState(Array(characteristicsList.length).fill(false));
  // Mindset slider
  const [mindsetValue, setMindsetValue] = useState(50);
  // YC scenario
  const [ycChoice, setYcChoice] = useState("");
  const [ycFeedback, setYcFeedback] = useState("");
  // Quiz
  const quizQuestions = [
    {
      q: "What is the most important trait for an entrepreneur?",
      options: ["Creativity", "Persistence", "Luck", "Money"],
      answer: 1,
    },
    {
      q: "What does YC emphasize most?",
      options: ["Perfect product", "Solving real problems", "Big team", "Fancy office"],
      answer: 1,
    },
  ];
  const [quizAnswers, setQuizAnswers] = useState<(number|null)[]>([null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  // Entrepreneurial Stories Carousel
  const stories = [
    {
      name: "Airbnb",
      problem: "Expensive hotels, lack of affordable lodging.",
      solution: "Let people rent out their homes to travelers.",
    },
    {
      name: "Spanx",
      problem: "Uncomfortable, visible undergarments for women.",
      solution: "Invented comfortable, invisible shapewear.",
    },
    {
      name: "Stripe",
      problem: "Hard for startups to accept online payments.",
      solution: "Easy-to-integrate payment platform for developers.",
    },
  ];
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyReflection, setStoryReflection] = useState(["", "", ""]);
  // Problem/Solution Brainstorm
  const [userProblem, setUserProblem] = useState("");
  const [userSolution, setUserSolution] = useState("");
  const [brainstormFeedback, setBrainstormFeedback] = useState(false);
  // Risk/Reward Analyzer
  const riskItems = ["Running out of money", "Competitors copying idea", "Learning new skills", "Making a difference", "Flexible schedule", "Uncertain income", "Personal growth", "Helping others"];
  const [risks, setRisks] = useState<string[]>([]);
  const [rewards, setRewards] = useState<string[]>([]);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [riskRewardFeedback, setRiskRewardFeedback] = useState(false);
  // Customer Empathy Map
  const [empathy, setEmpathy] = useState({ see: "", hear: "", think: "", feel: "" });
  const [empathyFeedback, setEmpathyFeedback] = useState(false);
  // Mini-Reflection
  const [miniReflection, setMiniReflection] = useState("");
  const [miniReflectionFeedback, setMiniReflectionFeedback] = useState(false);

  // Load section progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = "week1_lesson1_sections";
      const stored = localStorage.getItem(key);
      if (stored) {
        setSectionProgress(JSON.parse(stored));
      }
    }
  }, []);

  // Save section progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = "week1_lesson1_sections";
      localStorage.setItem(key, JSON.stringify(sectionProgress));
      // If all sections (except quiz) are completed, mark lesson as completed
      if (sectionProgress.length === sections.length - 1) {
        localStorage.setItem("week1_lesson1_progress", JSON.stringify({ status: "Completed", score: 100 }));
      } else if (sectionProgress.length > 0) {
        localStorage.setItem("week1_lesson1_progress", JSON.stringify({ status: "In Progress", score: 0 }));
      }
    }
  }, [sectionProgress]);

  // Progress bar calculation
  const progressPercent = Math.round((sectionProgress.length / (sections.length - 1)) * 100);

  // Handle Next button
  const currentSectionIdx = sections.findIndex(s => s.id === activeSection);
  const hasNextSection = currentSectionIdx < sections.length - 1;
  const nextSectionId = hasNextSection ? sections[currentSectionIdx + 1].id : null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">TS</span><span className="text-orange-400">a</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-300 text-sm">aerthea.branch@gmail.com</span>
          <button className="text-orange-400 hover:underline font-semibold">Logout</button>
        </div>
      </header>
      {/* Content */}
      <div className="flex flex-1 w-full max-w-6xl mx-auto mt-8 gap-8 px-4">
        {/* Sidebar */}
        <aside className="w-72 flex flex-col bg-gray-900/80 rounded-xl p-6 gap-2 h-fit sticky top-8 self-start shadow-lg">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all mb-1 ${
                activeSection === section.id
                  ? "bg-orange-400 text-black shadow"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
            >
              {section.label}
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <section className="flex-1 bg-gray-900/80 rounded-xl p-10 shadow-xl min-h-[600px] max-h-[80vh] overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold text-silver-400">Lesson Progress</span>
              <span className="text-silver-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          {/* Metadata */}
          <div className="mb-6 flex items-center gap-6 text-gray-400 text-sm">
            <Link href="/courses" className="hover:underline text-orange-400">&larr; Back to Week 1</Link>
            <span>45 minutes</span>
            <span>5 sections</span>
            <span>Includes quiz</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Week 1 Lesson 1: What is Entrepreneurship?
          </h1>
          {/* Section Content */}
          <AnimatePresence mode="wait">
            {activeSection === "introduction" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Introduction to Entrepreneurship</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Entrepreneurship is the process of designing, launching, and running a new business...</motion.p>
                <motion.blockquote className="border-l-4 border-orange-400 pl-4 italic text-orange-200 mb-4" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>"The best entrepreneurs aren't just building companies; they're solving meaningful problems and creating value for society."<br /><span className="text-xs">- Paul Graham, Co-founder of Y Combinator</span></motion.blockquote>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("characteristics")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "characteristics" && (
              <motion.div key="characteristics" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Key Characteristics of Entrepreneurs</h2>
                <div className="mb-6">
                  <div className="mb-2 text-lg text-gray-100">Check off the traits you feel you have:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characteristicsList.map((trait, i) => (
                      <label key={trait} className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${checkedTraits[i] ? "bg-orange-400/80 text-black shadow" : "bg-gray-800 hover:bg-gray-700"}`}>
                        <input type="checkbox" checked={checkedTraits[i]} onChange={() => setCheckedTraits(checkedTraits.map((v, idx) => idx === i ? !v : v))} className="accent-orange-400 w-5 h-5" />
                        <span>{trait}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("stories")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "stories" && (
              <motion.div key="stories" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Entrepreneurial Stories</h2>
                <div className="mb-6 flex flex-col items-center">
                  <motion.div className="bg-gray-800/80 rounded-xl p-6 shadow-lg w-full max-w-xl mb-4" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="text-xl font-bold text-orange-200 mb-2">{stories[storyIdx].name}</div>
                    <div className="mb-2 text-gray-100">Problem: <span className="font-semibold">{stories[storyIdx].problem}</span></div>
                    <div className="mb-2 text-gray-100">Solution: <span className="font-semibold">{stories[storyIdx].solution}</span></div>
                    <textarea className="w-full mt-4 p-3 rounded bg-gray-700 text-white" placeholder="What would you do differently?" value={storyReflection[storyIdx]} onChange={e => setStoryReflection(storyReflection.map((v, i) => i === storyIdx ? e.target.value : v))} />
                  </motion.div>
                  <div className="flex gap-4 mt-2">
                    <button className="px-4 py-2 rounded bg-gray-700 text-white font-bold" onClick={() => setStoryIdx(Math.max(0, storyIdx - 1))} disabled={storyIdx === 0}>Prev</button>
                    <button className="px-4 py-2 rounded bg-gray-700 text-white font-bold" onClick={() => setStoryIdx(Math.min(stories.length - 1, storyIdx + 1))} disabled={storyIdx === stories.length - 1}>Next</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("brainstorm")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "brainstorm" && (
              <motion.div key="brainstorm" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Problem/Solution Brainstorm</h2>
                <div className="mb-4 text-lg text-gray-100">Think of a real-world problem you notice. How would you solve it as an entrepreneur?</div>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" placeholder="Describe a problem..." value={userProblem} onChange={e => setUserProblem(e.target.value)} />
                <textarea className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" placeholder="How would you solve it?" value={userSolution} onChange={e => setUserSolution(e.target.value)} />
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setBrainstormFeedback(true)}>Submit</button>
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("riskreward")} disabled={!hasNextSection}>Next</button>
                </div>
                {brainstormFeedback && <motion.div className="mt-4 p-4 bg-green-800/80 rounded-lg text-green-200 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Great entrepreneurial thinking! Every business starts with a problem and a solution.</motion.div>}
              </motion.div>
            )}
            {activeSection === "riskreward" && (
              <motion.div key="riskreward" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Risk/Reward Analyzer</h2>
                <div className="mb-4 text-lg text-gray-100">Drag each item to either "Risk" or "Reward" for a startup founder:</div>
                <div className="flex gap-8 mb-4">
                  <div className="flex-1">
                    <div className="font-bold text-orange-200 mb-2">Unsorted</div>
                    <div className="space-y-2">
                      {riskItems.filter(item => !risks.includes(item) && !rewards.includes(item)).map(item => (
                        <div key={item} draggable onDragStart={() => setDragItem(item)} className="p-2 rounded bg-gray-700 text-white cursor-move shadow">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-orange-200 mb-2">Risk</div>
                    <div className="min-h-[60px] p-2 bg-gray-800 rounded" onDragOver={e => e.preventDefault()} onDrop={() => { if (dragItem && !risks.includes(dragItem)) { setRisks([...risks, dragItem]); setDragItem(null); } }}>
                      {risks.map(item => (
                        <div key={item} className="p-2 rounded bg-orange-400/80 text-black mb-2 shadow">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-orange-200 mb-2">Reward</div>
                    <div className="min-h-[60px] p-2 bg-gray-800 rounded" onDragOver={e => e.preventDefault()} onDrop={() => { if (dragItem && !rewards.includes(dragItem)) { setRewards([...rewards, dragItem]); setDragItem(null); } }}>
                      {rewards.map(item => (
                        <div key={item} className="p-2 rounded bg-green-400/80 text-black mb-2 shadow">{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setRiskRewardFeedback(true)}>Submit</button>
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("empathy")} disabled={!hasNextSection}>Next</button>
                </div>
                {riskRewardFeedback && <motion.div className="mt-4 p-4 bg-green-800/80 rounded-lg text-green-200 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Nice! Every founder faces both risks and rewards. Knowing the difference is key.</motion.div>}
              </motion.div>
            )}
            {activeSection === "empathy" && (
              <motion.div key="empathy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Customer Empathy Map</h2>
                <div className="mb-4 text-lg text-gray-100">Fill in the empathy map for your customer:</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-orange-200 font-semibold mb-1">What do they see?</label>
                    <input className="w-full p-3 bg-gray-700 rounded-lg text-white mb-2" value={empathy.see} onChange={e => setEmpathy({ ...empathy, see: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-orange-200 font-semibold mb-1">What do they hear?</label>
                    <input className="w-full p-3 bg-gray-700 rounded-lg text-white mb-2" value={empathy.hear} onChange={e => setEmpathy({ ...empathy, hear: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-orange-200 font-semibold mb-1">What do they think?</label>
                    <input className="w-full p-3 bg-gray-700 rounded-lg text-white mb-2" value={empathy.think} onChange={e => setEmpathy({ ...empathy, think: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-orange-200 font-semibold mb-1">What do they feel?</label>
                    <input className="w-full p-3 bg-gray-700 rounded-lg text-white mb-2" value={empathy.feel} onChange={e => setEmpathy({ ...empathy, feel: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setEmpathyFeedback(true)}>Submit</button>
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("mindset")} disabled={!hasNextSection}>Next</button>
                </div>
                {empathyFeedback && <motion.div className="mt-4 p-4 bg-green-800/80 rounded-lg text-green-200 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Empathy is the secret weapon of great entrepreneurs. Understanding your customer is everything!</motion.div>}
              </motion.div>
            )}
            {activeSection === "mindset" && (
              <motion.div key="mindset" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">The Entrepreneurial Mindset</h2>
                <div className="mb-6">
                  <div className="mb-2 text-lg text-gray-100">Where do you fall on the mindset spectrum?</div>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-200">Fixed</span>
                    <input type="range" min={0} max={100} value={mindsetValue} onChange={e => setMindsetValue(Number(e.target.value))} className="w-full accent-orange-400" />
                    <span className="text-orange-200">Growth</span>
                  </div>
                  <div className="mt-2 text-silver-400">{mindsetValue < 40 ? "More Fixed" : mindsetValue > 60 ? "More Growth" : "Balanced"}</div>
                </div>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("yc")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "yc" && (
              <motion.div key="yc" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Y Combinator's Approach</h2>
                <div className="mb-6 text-lg text-gray-100">What would you do first as a founder?</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <button className={`p-4 rounded-lg font-semibold shadow transition-all ${ycChoice === "users" ? "bg-orange-400 text-black" : "bg-gray-800 hover:bg-gray-700 text-white"}`} onClick={() => { setYcChoice("users"); setYcFeedback("Correct! YC says: Talk to users and solve real problems."); }}>Talk to users</button>
                  <button className={`p-4 rounded-lg font-semibold shadow transition-all ${ycChoice === "product" ? "bg-orange-400 text-black" : "bg-gray-800 hover:bg-gray-700 text-white"}`} onClick={() => { setYcChoice("product"); setYcFeedback("Not quite! YC says: Focus on the problem, not just the product."); }}>Perfect the product</button>
                </div>
                {ycFeedback && <motion.div className="mb-4 p-4 rounded-lg bg-green-800/80 text-green-200 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{ycFeedback}</motion.div>}
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("reflection")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "reflection" && (
              <motion.div key="reflection" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Mini-Reflection</h2>
                <div className="mb-4 text-lg text-gray-100">What's one thing you learned about entrepreneurship today?</div>
                <textarea className="w-full p-3 bg-gray-700 rounded-lg text-white mb-4" value={miniReflection} onChange={e => setMiniReflection(e.target.value)} />
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setMiniReflectionFeedback(true)}>Submit</button>
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("quiz")} disabled={!hasNextSection}>Next</button>
                </div>
                {miniReflectionFeedback && <motion.div className="mt-4 p-4 bg-green-800/80 rounded-lg text-green-200 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Awesome! Reflection is how you turn experience into wisdom.</motion.div>}
              </motion.div>
            )}
            {activeSection === "quiz" && (
              <motion.div key="quiz" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Quiz</h2>
                <div className="space-y-8">
                  {quizQuestions.map((q, i) => (
                    <div key={i} className="mb-4">
                      <div className="mb-2 text-lg text-gray-100">{q.q}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, idx) => (
                          <button
                            key={opt}
                            className={`p-4 rounded-lg font-semibold shadow transition-all ${quizAnswers[i] === idx ? "bg-orange-400 text-black" : "bg-gray-800 hover:bg-gray-700 text-white"}`}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers(quizAnswers.map((v, j) => j === i ? idx : v));
                              }
                            }}
                            disabled={quizSubmitted}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-6">
                    <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => {
                      let score = 0;
                      quizQuestions.forEach((q, i) => {
                        if (quizAnswers[i] === q.answer) score++;
                      });
                      setQuizScore(score);
                      setQuizSubmitted(true);
                    }} disabled={quizSubmitted}>Submit</button>
                    <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => {
                      setQuizAnswers([null, null]);
                      setQuizSubmitted(false);
                      setQuizScore(0);
                    }} disabled={!quizSubmitted}>Retry</button>
                  </div>
                  {quizSubmitted && (
                    <motion.div className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {quizScore === quizQuestions.length ? "Perfect! You're ready to move on." : `You got ${quizScore} out of ${quizQuestions.length}. Review and try again!`}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      {/* Footer */}
      <footer className="w-full flex justify-end items-center px-8 py-4 mt-8">
        <div className="bg-gray-800/80 rounded-full px-4 py-2 text-xs text-gray-300 flex items-center gap-2 shadow">
          Made with Manus
        </div>
      </footer>
    </main>
  );
} 