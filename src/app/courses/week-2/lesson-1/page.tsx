"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    id: "introduction",
    label: "Introduction to Branding",
  },
  {
    id: "brand-match",
    label: "Brand Match Quiz",
  },
  {
    id: "promise-checker",
    label: "Brand Promise Analysis",
  },
  {
    id: "logo-challenge",
    label: "Logo Design Challenge",
  },
  {
    id: "archetype-wheel",
    label: "Brand Archetype Wheel",
  },
  {
    id: "quiz",
    label: "Final Quiz",
  },
];

// Add for drag-and-drop
const brandOptions = [
  { name: "Nike", value: "Aspiration" },
  { name: "Apple", value: "Innovation" },
  { name: "Red Bull", value: "Excitement" },
  { name: "IKEA", value: "Simplicity" },
];
const emotionOptions = ["Aspiration", "Innovation", "Excitement", "Simplicity"];

export default function Lesson1Page() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sectionProgress, setSectionProgress] = useState<string[]>([]);
  const [brandMatchScore, setBrandMatchScore] = useState(0);
  const [promiseAnalysis, setPromiseAnalysis] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState("");
  const [brandMatchAnswers, setBrandMatchAnswers] = useState<{ [key: string]: string }>({});
  const [brandMatchFeedback, setBrandMatchFeedback] = useState<string | null>(null);
  const [logoReflection, setLogoReflection] = useState("");

  // Load section progress from localStorage
  useEffect(() => {
    const key = "week2_lesson1_sections";
    const stored = localStorage.getItem(key);
    if (stored) {
      setSectionProgress(JSON.parse(stored));
    }
  }, []);

  // Save section progress to localStorage
  useEffect(() => {
    const key = "week2_lesson1_sections";
    localStorage.setItem(key, JSON.stringify(sectionProgress));
    // If all sections (except quiz) are completed, mark lesson as completed
    if (sectionProgress.length === sections.length - 1) {
      localStorage.setItem("week2_lesson1_progress", JSON.stringify({ status: "Completed", score: 100 }));
    } else if (sectionProgress.length > 0) {
      localStorage.setItem("week2_lesson1_progress", JSON.stringify({ status: "In Progress", score: 0 }));
    }
  }, [sectionProgress]);

  // Progress bar calculation
  const progressPercent = Math.round((sectionProgress.length / (sections.length - 1)) * 100);

  // Handle Next button
  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
      setActiveSection(nextSection.id);
      if (!sectionProgress.includes(activeSection) && activeSection !== "quiz") {
        setSectionProgress([...sectionProgress, activeSection]);
      }
    }
  };

  // Brand Match handlers
  const handleBrandDrop = (emotion: string, brand: string) => {
    setBrandMatchAnswers((prev) => ({ ...prev, [brand]: emotion }));
  };
  const handleBrandMatchSubmit = () => {
    let correct = 0;
    brandOptions.forEach((b) => {
      if (brandMatchAnswers[b.name] === b.value) correct++;
    });
    setBrandMatchFeedback(`You matched ${correct} out of 4 correctly!`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">TS</span><span className="text-orange-400">a</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-orange-400 hover:underline font-semibold">Logout</button>
        </div>
      </header>
      {/* Content */}
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
            onClick={() => setActiveSection("quiz")}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg ${
              activeSection === "quiz"
                ? "bg-orange-400 text-black"
                : "bg-gray-800 text-orange-300 hover:bg-orange-400 hover:text-black"
            }`}
          >
            Final Quiz
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
            <span>6 sections</span>
            <span>Includes activities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Week 2 Lesson 1: What Is a Brand?
          </h1>
          {/* Section Content */}
          {activeSection === "introduction" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Introduction to Branding</h2>
              <p className="mb-6 text-lg text-gray-100">
                A brand is more than just a logo or a name—it's the complete experience that customers have with your company. It's the emotional and psychological relationship you build with your audience. Let's explore how some of the world's most successful brands have built their identities.
              </p>
              
              {/* Nike Section */}
              <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
                <h3 className="text-xl font-bold text-orange-200 mb-4">Nike</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/images/nike-athlete.jpg"
                      alt="Nike Athlete"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Elements</h4>
                      <ul className="space-y-2 text-gray-200">
                        <li>• Bold black and white contrast</li>
                        <li>• Dynamic "Swoosh" logo</li>
                        <li>• "Just Do It" tagline</li>
                        <li>• Celebrity athlete endorsements</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Promise</h4>
                      <p className="text-gray-200">Inspiration and innovation for every athlete in the world.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apple Section */}
              <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
                <h3 className="text-xl font-bold text-orange-200 mb-4">Apple</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/images/apple-store.jpg"
                      alt="Apple Store"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Elements</h4>
                      <ul className="space-y-2 text-gray-200">
                        <li>• Minimalist design aesthetic</li>
                        <li>• Clean white spaces</li>
                        <li>• Premium product positioning</li>
                        <li>• Innovative technology focus</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Promise</h4>
                      <p className="text-gray-200">Think Different. Innovation that's beautiful and intuitive.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Bull Section */}
              <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
                <h3 className="text-xl font-bold text-orange-200 mb-4">Red Bull</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/images/redbull-event.jpg"
                      alt="Red Bull Event"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Elements</h4>
                      <ul className="space-y-2 text-gray-200">
                        <li>• Extreme sports sponsorship</li>
                        <li>• Content-driven marketing</li>
                        <li>• Red Bull Media House</li>
                        <li>• "Gives You Wings" tagline</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-orange-200 mb-2">Brand Promise</h4>
                      <p className="text-gray-200">Energy and excitement for an active lifestyle.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeSection === "brand-match" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Brand Match Quiz</h2>
              <p className="mb-6 text-lg text-gray-100">
                Match each brand with its core emotion or value. Drag and drop the brands to their corresponding emotions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 rounded-xl">
                  <h3 className="text-xl font-bold text-orange-200 mb-4">Brands</h3>
                  <div className="space-y-4">
                    {brandOptions.map((brand) => (
                      <div
                        key={brand.name}
                        className="p-4 bg-gray-700/50 rounded-lg cursor-move"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("brand", brand.name)}
                      >
                        {brand.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl">
                  <h3 className="text-xl font-bold text-orange-200 mb-4">Emotions/Values</h3>
                  <div className="space-y-4">
                    {emotionOptions.map((emotion) => (
                      <div
                        key={emotion}
                        className="p-4 bg-gray-700/50 rounded-lg min-h-[48px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const brand = e.dataTransfer.getData("brand");
                          handleBrandDrop(emotion, brand);
                        }}
                      >
                        <span className="font-semibold">{emotion}</span>
                        <div className="mt-2 text-orange-300">
                          {Object.entries(brandMatchAnswers)
                            .filter(([_, v]) => v === emotion)
                            .map(([brand]) => (
                              <span key={brand}>{brand}</span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleBrandMatchSubmit}
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
              {brandMatchFeedback && (
                <div className="mt-4 text-lg font-semibold text-orange-300">{brandMatchFeedback}</div>
              )}
            </div>
          )}

          {activeSection === "promise-checker" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Brand Promise Analysis</h2>
              <p className="mb-6 text-lg text-gray-100">
                Enter a company name and analyze its brand promise. Compare your understanding with real-world examples.
              </p>
              <div className="p-6 bg-gray-800/50 rounded-xl">
                <div className="mb-6">
                  <label className="block text-orange-200 font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    placeholder="Enter a company name..."
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-orange-200 font-semibold mb-2">Brand Promise</label>
                  <textarea
                    className="w-full p-3 bg-gray-700 rounded-lg text-white h-32"
                    placeholder="What do you think this company promises to its customers?"
                    value={promiseAnalysis}
                    onChange={(e) => setPromiseAnalysis(e.target.value)}
                  />
                </div>
                <button className="px-6 py-3 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 transition-colors">
                  Analyze Promise
                </button>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeSection === "logo-challenge" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Logo Design Reflection</h2>
              <p className="mb-6 text-lg text-gray-100">
                Choose a famous logo and describe how you would change it to target a different audience or convey a new brand emotion. (For example, how would you change the Apple logo to appeal to children?)
              </p>
              <textarea
                className="w-full p-4 bg-gray-700 rounded-lg text-white h-32 mb-4"
                placeholder="Describe your logo change..."
                value={logoReflection}
                onChange={(e) => setLogoReflection(e.target.value)}
              />
              <div className="flex gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeSection === "archetype-wheel" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Brand Archetype Wheel</h2>
              <p className="mb-6 text-lg text-gray-100">
                Select a brand archetype and explain how it fits a company you admire.
              </p>
              <div className="p-6 bg-gray-800/50 rounded-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-orange-200 mb-4">Select an Archetype</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["The Hero", "The Outlaw", "The Creator", "The Sage", "The Innocent", "The Explorer"].map((archetype) => (
                      <button
                        key={archetype}
                        onClick={() => setSelectedArchetype(archetype)}
                        className={`p-4 rounded-lg transition-colors ${
                          selectedArchetype === archetype
                            ? "bg-orange-400 text-black"
                            : "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                        }`}
                      >
                        {archetype}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedArchetype && (
                  <div className="mb-6">
                    <label className="block text-orange-200 font-semibold mb-2">Explain Your Choice</label>
                    <textarea
                      className="w-full p-3 bg-gray-700 rounded-lg text-white h-32"
                      placeholder={`How does ${selectedArchetype} archetype fit your chosen company?`}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeSection === "quiz" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Final Quiz</h2>
              <p className="mb-6 text-lg text-gray-100">
                Test your understanding of branding concepts with this comprehensive quiz.
              </p>
              {/* Quiz implementation will be added here */}
            </div>
          )}
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