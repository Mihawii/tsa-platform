"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const sections = [
  { id: "value", label: "Marketing as Value Delivery" },
  { id: "framework", label: "Foundational Questions" },
  { id: "pricing", label: "Psychology of Pricing" },
  { id: "pestle", label: "PESTLE Analysis" },
  { id: "place", label: "Place & Distribution" },
  { id: "promotion", label: "Transition to Promotion" },
  { id: "takeaway", label: "Takeaway" },
];

export default function Lesson2Page() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [sectionProgress, setSectionProgress] = useState<string[]>([]);
  const [frameworkStep, setFrameworkStep] = useState(0);
  const [userBrand, setUserBrand] = useState("");
  const [userAnswers, setUserAnswers] = useState(["", "", "", ""]);
  const [showUserFeedback, setShowUserFeedback] = useState(false);
  // Pricing
  const pricingOptions = [
    {
      label: "Prestige Pricing",
      desc: "High price signals high value. Used by Rolex, Apple.",
      example: "Apple iPhone Pro, Rolex watches",
    },
    {
      label: "Exclusivity & Rarity",
      desc: "Limited editions create desire and urgency.",
      example: "Supreme drops, Yeezy sneakers",
    },
    {
      label: "Discount Perception",
      desc: "Sales can boost volume but may cheapen the brand.",
      example: "Black Friday deals, outlet stores",
    },
    {
      label: "Emotional Value",
      desc: "People pay for meaning, not just features.",
      example: "Charity:Water, TOMS shoes",
    },
  ];
  const [activePricing, setActivePricing] = useState<number | null>(null);
  const [pricingStrategy, setPricingStrategy] = useState("");
  const [pricingFeedback, setPricingFeedback] = useState(false);
  // PESTLE
  const pestleFactors = ["Political", "Economic", "Social", "Technological", "Legal", "Environmental"];
  const [selectedCountry, setSelectedCountry] = useState("");
  const [pestleInputs, setPestleInputs] = useState(Array(6).fill(""));
  const [pestleFeedback, setPestleFeedback] = useState(false);
  // Place
  const placeOptions = [
    {
      label: "Physical",
      desc: "Retail stores, pop-ups, flagship locations.",
      example: "Apple Store, Supreme, Nike Town",
    },
    {
      label: "Digital",
      desc: "E-commerce, apps, digital-first brands.",
      example: "Shein, Amazon, Gymshark",
    },
    {
      label: "Hybrid",
      desc: "Combines physical and digital for reach and experience.",
      example: "Warby Parker, Glossier",
    },
  ];
  const [activePlace, setActivePlace] = useState<number | null>(null);
  const [placeQuiz, setPlaceQuiz] = useState("");
  const [placeFeedback, setPlaceFeedback] = useState(false);
  // Promotion
  const promoQuestions = [
    "How does promotion reflect your brand?",
    "Can promotion be emotional instead of informational?",
  ];
  const [promoAnswers, setPromoAnswers] = useState(["", ""]);
  const [showPromoFeedback, setShowPromoFeedback] = useState(false);

  // Load section progress from localStorage
  useEffect(() => {
    const key = "week2_lesson2_sections";
    const stored = localStorage.getItem(key);
    if (stored) setSectionProgress(JSON.parse(stored));
  }, []);

  // Save section progress to localStorage
  useEffect(() => {
    const key = "week2_lesson2_sections";
    localStorage.setItem(key, JSON.stringify(sectionProgress));
    if (sectionProgress.length === sections.length - 1) {
      localStorage.setItem("week2_lesson2_progress", JSON.stringify({ status: "Completed", score: 100 }));
    } else if (sectionProgress.length > 0) {
      localStorage.setItem("week2_lesson2_progress", JSON.stringify({ status: "In Progress", score: 0 }));
    }
  }, [sectionProgress]);

  const progressPercent = Math.round((sectionProgress.length / (sections.length - 1)) * 100);

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
      setActiveSection(nextSection.id);
      if (!sectionProgress.includes(activeSection) && activeSection !== "takeaway") {
        setSectionProgress([...sectionProgress, activeSection]);
      }
    }
  };

  const foundationalQuestions = [
    "Who is our client?",
    "What are we selling?",
    "Why does it matter to them?",
    "How will they find out about it?",
  ];
  const nikeAnswers = [
    "Athletes and aspirational performers",
    "Performance wear",
    "Endorsed by champions, symbolizes achievement",
    "Emotional storytelling, athlete partnerships, motivational ads",
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">TS</span><span className="text-orange-400">a</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-orange-400 hover:underline font-semibold">Logout</button>
        </div>
      </header>
      <div className="flex flex-1 w-full max-w-6xl mx-auto mt-8 gap-8 px-4">
        {/* Sidebar */}
        <aside className="w-72 flex flex-col bg-gray-900/80 rounded-xl p-6 gap-2 h-fit sticky top-8 self-start shadow-lg">
          {sections.slice(0, -1).map((section) => (
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
          <div className="flex-1" />
          <button
            onClick={() => setActiveSection("takeaway")}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg ${
              activeSection === "takeaway"
                ? "bg-orange-400 text-black"
                : "bg-gray-800 text-orange-300 hover:bg-orange-400 hover:text-black"
            }`}
          >
            Takeaway
          </button>
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
            <Link href="/courses" className="hover:underline text-orange-400">&larr; Back to Week 2</Link>
            <span>60 minutes</span>
            <span>7 sections</span>
            <span>Includes activities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Week 2 Lesson 2: Marketing & Value Delivery
          </h1>
          {/* Section Content */}
          <AnimatePresence mode="wait">
            {activeSection === "value" && (
              <motion.div
                key="value"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Marketing as the Delivery of Perceived Value</h2>
                <motion.p
                  className="mb-6 text-lg text-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  You started by breaking down what marketing actually is — not just selling, but understanding the customer and delivering a product's value in the clearest, most compelling way possible.
                </motion.p>
                <motion.blockquote
                  className="border-l-4 border-orange-400 pl-4 italic text-orange-200 mb-8 text-xl"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                >
                  "Marketing is about showing the right person why your solution matters — not just what it is."
                </motion.blockquote>
                <button
                  className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </motion.div>
            )}
            {/* Placeholders for other sections, to be filled in next steps */}
            {activeSection === "framework" && (
              <motion.div key="framework" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Foundational Questions of Marketing Strategy</h2>
                {/* Animated reveal of each question */}
                {frameworkStep < 4 && (
                  <motion.div
                    key={frameworkStep}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                  >
                    <div className="text-xl font-semibold text-silver-200 mb-4">{foundationalQuestions[frameworkStep]}</div>
                    <button
                      className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                      onClick={() => setFrameworkStep(frameworkStep + 1)}
                    >
                      Next Question
                    </button>
                  </motion.div>
                )}
                {/* Nike case study animated answers */}
                {frameworkStep === 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
                    <div className="mb-6 text-lg text-gray-100">Let's see how Nike answers these questions:</div>
                    <div className="space-y-4 mb-8">
                      {foundationalQuestions.map((q, i) => (
                        <motion.div
                          key={q}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 * i, duration: 0.5 }}
                          className="flex items-center gap-4"
                        >
                          <span className="font-semibold text-orange-300">{q}</span>
                          <span className="bg-gray-800 text-orange-200 px-4 py-2 rounded-lg ml-2 animate-pulse">{nikeAnswers[i]}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mb-6 text-lg text-gray-100">Now try it for your own brand or idea:</div>
                    <input
                      className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"
                      placeholder="Your brand or product name..."
                      value={userBrand}
                      onChange={e => setUserBrand(e.target.value)}
                    />
                    <div className="space-y-4 mb-4">
                      {foundationalQuestions.map((q, i) => (
                        <div key={q}>
                          <label className="block text-orange-200 font-semibold mb-1">{q}</label>
                          <input
                            className="w-full p-3 bg-gray-800 rounded-lg text-white"
                            placeholder={`Your answer for: ${q}`}
                            value={userAnswers[i]}
                            onChange={e => {
                              const updated = [...userAnswers];
                              updated[i] = e.target.value;
                              setUserAnswers(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                      onClick={() => setShowUserFeedback(true)}
                    >
                      Submit My Answers
                    </button>
                    {showUserFeedback && (
                      <motion.div
                        className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        Great job! You've just built the foundation of your marketing strategy for <span className="text-orange-300">{userBrand || "your brand"}</span>.
                      </motion.div>
                    )}
                    <button
                      className="mt-8 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
            {activeSection === "pricing" && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Psychology of Pricing</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {pricingOptions.map((opt, i) => (
                    <motion.div
                      key={opt.label}
                      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all border-2 ${activePricing === i ? "border-orange-400 bg-gray-800/80" : "border-gray-700 bg-gray-900/70"}`}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => setActivePricing(i)}
                    >
                      <div className="text-xl font-bold text-orange-200 mb-2">{opt.label}</div>
                      <div className="text-gray-200 mb-2">{opt.desc}</div>
                      {activePricing === i && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-300 font-semibold mt-2">
                          Example: {opt.example}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="mb-6 text-lg text-gray-100">Describe your own pricing strategy for your brand:</div>
                <textarea
                  className="w-full p-4 bg-gray-700 rounded-lg text-white h-24 mb-4"
                  placeholder="Describe your pricing approach..."
                  value={pricingStrategy}
                  onChange={e => setPricingStrategy(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={() => setPricingFeedback(true)}
                >
                  Submit Pricing Strategy
                </button>
                {pricingFeedback && (
                  <motion.div className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    Nice! Pricing is a powerful lever for your brand's perception and success.
                  </motion.div>
                )}
                <button className="mt-8 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={handleNext}>Next</button>
              </motion.div>
            )}
            {activeSection === "pestle" && (
              <motion.div key="pestle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">PESTLE Analysis Introduction</h2>
                <motion.div className="flex gap-4 mb-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
                  {pestleFactors.map((factor, i) => (
                    <motion.div key={factor} className="text-orange-200 text-lg font-bold px-3 py-2 rounded bg-gray-800/80 shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      {factor[0]}
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mb-4">
                  <label className="block text-orange-200 font-semibold mb-2">Choose a country for your analysis:</label>
                  <select
                    className="w-full p-3 bg-gray-700 rounded-lg text-white mb-4"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                  >
                    <option value="">Select a country...</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {selectedCountry && (
                  <div className="space-y-4 mb-4">
                    {pestleFactors.map((factor, i) => (
                      <div key={factor}>
                        <label className="block text-orange-200 font-semibold mb-1">{factor}</label>
                        <input
                          className="w-full p-3 bg-gray-800 rounded-lg text-white"
                          placeholder={`How does ${factor} affect your brand in ${selectedCountry}?`}
                          value={pestleInputs[i]}
                          onChange={e => {
                            const updated = [...pestleInputs];
                            updated[i] = e.target.value;
                            setPestleInputs(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={() => setPestleFeedback(true)}
                  disabled={!selectedCountry}
                >
                  Submit PESTLE Analysis
                </button>
                {pestleFeedback && (
                  <motion.div className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    Great! You've just completed a surface-level PESTLE analysis for {selectedCountry}.
                  </motion.div>
                )}
                <button className="mt-8 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={handleNext}>Next</button>
              </motion.div>
            )}
            {activeSection === "place" && (
              <motion.div key="place" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Place (Distribution Strategy)</h2>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {placeOptions.map((opt, i) => (
                    <motion.div
                      key={opt.label}
                      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all border-2 ${activePlace === i ? "border-orange-400 bg-gray-800/80" : "border-gray-700 bg-gray-900/70"}`}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => setActivePlace(i)}
                    >
                      <div className="text-xl font-bold text-orange-200 mb-2">{opt.label}</div>
                      <div className="text-gray-200 mb-2">{opt.desc}</div>
                      {activePlace === i && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-300 font-semibold mt-2">
                          Example: {opt.example}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="mb-6 text-lg text-gray-100">Which model fits your brand best?</div>
                <select
                  className="w-full p-3 bg-gray-800 rounded-lg text-white text-lg shadow focus:ring-2 focus:ring-orange-400 border-none appearance-none mb-4"
                  value={placeQuiz}
                  onChange={e => setPlaceQuiz(e.target.value)}
                >
                  <option value="">Select one...</option>
                  <option value="Physical">Physical</option>
                  <option value="Digital">Digital</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <div className="flex gap-4">
                  <button
                    className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                    onClick={() => setPlaceFeedback(true)}
                    disabled={!placeQuiz}
                  >
                    Submit
                  </button>
                  <button
                    className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
                {placeFeedback && (
                  <motion.div className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    Good choice! Distribution is a key part of your brand's experience.
                  </motion.div>
                )}
              </motion.div>
            )}
            {activeSection === "promotion" && (
              <motion.div key="promotion" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Transition to Promotion</h2>
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promoQuestions.map((q, i) => (
                    <motion.div
                      key={q}
                      className="p-6 rounded-xl shadow-lg bg-gray-800/80"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="text-lg font-semibold text-orange-200 mb-2">{q}</div>
                      <textarea
                        className="w-full p-3 bg-gray-700 rounded-lg text-white h-20"
                        placeholder="Your thoughts..."
                        value={promoAnswers[i]}
                        onChange={e => {
                          const updated = [...promoAnswers];
                          updated[i] = e.target.value;
                          setPromoAnswers(updated);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={() => setShowPromoFeedback(true)}
                >
                  Submit Reflection
                </button>
                {showPromoFeedback && (
                  <motion.div className="mt-6 p-4 bg-green-800/80 rounded-lg text-green-200 text-lg font-semibold shadow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    Excellent! You're ready to think about how your brand's story will be told.
                  </motion.div>
                )}
                <motion.div className="mt-10 text-center text-orange-300 text-lg font-bold animate-pulse">
                  Next week: Turning your brand into a movement!
                </motion.div>
                <button className="mt-8 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={handleNext}>Next</button>
              </motion.div>
            )}
            {activeSection === "takeaway" && (
              <motion.div key="takeaway" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Takeaway Theme</h2>
                <motion.p
                  className="mb-8 text-xl text-orange-200 font-semibold"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  "Marketing is not just about showing up — it's about showing up in the right place, at the right time, with a message that speaks straight to the heart."
                </motion.p>
                <Link href="/courses/week-2/lesson-2" className="inline-block mt-4 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition">Back to Lessons</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <footer className="w-full flex justify-end items-center px-8 py-4 mt-8">
        <div className="bg-gray-800/80 rounded-full px-4 py-2 text-xs text-gray-300 flex items-center gap-2 shadow">
          Made with Manus
        </div>
      </footer>
    </main>
  );
} 