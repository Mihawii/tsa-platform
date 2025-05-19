"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "mindmap", label: "Mind Mapping Workshop" },
  { id: "marketstructure", label: "Market Structure Explorer" },
  { id: "ideavalidation", label: "Idea Validation Challenge" },
  { id: "competitiveanalysis", label: "Competitive Analysis Tool" },
  { id: "reflection", label: "Mini-Reflection" },
  { id: "quiz", label: "Quiz" },
];

export default function Lesson2Page() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [sectionProgress, setSectionProgress] = useState<string[]>([]);
  const [mcAnswers, setMcAnswers] = useState<(number|null)[]>([null, null, null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');

  // Correct answers for MCQs (index: 0=a, 1=b, 2=c, 3=d)
  const correct = [1, 2, 1, 2, 2];
  // 1=b, 2=c, etc. (see below for mapping)

  // Load section progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = "week1_lesson2_sections";
      const stored = localStorage.getItem(key);
      if (stored) setSectionProgress(JSON.parse(stored));
    }
  }, []);

  // Save section progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = "week1_lesson2_sections";
      localStorage.setItem(key, JSON.stringify(sectionProgress));
      // If all sections (except quiz) are completed, mark lesson as completed
      if (sectionProgress.length === sections.length - 1) {
        localStorage.setItem("week1_lesson2_progress", JSON.stringify({ status: "Completed", score: 100 }));
      } else if (sectionProgress.length > 0) {
        localStorage.setItem("week1_lesson2_progress", JSON.stringify({ status: "In Progress", score: 0 }));
      }
    }
  }, [sectionProgress]);

  // Progress bar calculation
  useEffect(() => {
    const progress = sectionProgress.length / (sections.length - 1);
    setProgressPercent(Math.round(progress * 100));
  }, [sectionProgress]);

  // Handle Next button
  const currentSectionIdx = sections.findIndex(s => s.id === activeSection);
  const hasNextSection = currentSectionIdx < sections.length - 1;
  const nextSectionId = hasNextSection ? sections[currentSectionIdx + 1].id : null;

  // Helper for answer selection
  const handleSelect = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setMcAnswers((prev) => prev.map((v, i) => (i === qIdx ? aIdx : v)));
  };

  // On submit, calculate score
  const handleSubmit = () => {
    let correctCount = 0;
    for (let i = 0; i < correct.length; i++) {
      if (mcAnswers[i] === correct[i]) correctCount++;
    }
    setScore((correctCount / correct.length) * 100);
    setSubmitted(true);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 3500);
  };

  // Reset quiz
  const handleRetry = () => {
    setMcAnswers([null, null, null, null, null]);
    setSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  // Next lesson path (update as needed for your course structure)
  const nextLessonPath = "/courses/week-1/lesson-3";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">TS</span><span className="text-orange-400">a</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-300 text-sm">aerthea.branch@gmail.com</span>
          <button className="text-orange-400 hover:underline font-semibold">Logout</button>
        </div>
      </header>
      <div className="flex flex-1 w-full max-w-6xl mx-auto mt-8 gap-8 px-4">
        {/* Progress Bar */}
        <div className="absolute left-0 right-0 top-0 h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner max-w-6xl mx-auto mt-2">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
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
          <div className="mb-6 flex items-center gap-6 text-gray-400 text-sm">
            <Link href="/courses" className="hover:underline text-orange-400">&larr; Back to Week 1</Link>
            <span>45 minutes</span>
            <span>7 sections</span>
            <span>Includes quiz</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Week 1 Lesson 2: How to Come Up with a Business Idea
          </h1>
          <AnimatePresence mode="wait">
            {activeSection === "introduction" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">How to Come Up with a Business Idea</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Every great business starts with a single idea. But where do ideas come from? The best entrepreneurs don't wait for inspiration—they train themselves to spot problems, connect dots, and imagine new possibilities. In this lesson, you'll learn how to generate, shape, and validate business ideas that matter.
                </motion.p>
                <motion.ul className="mb-4 text-lg text-orange-200 list-disc list-inside" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Spot everyday problems and frustrations</motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>Observe trends and changes in the world</motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>Ask "what if?" and challenge assumptions</motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>Combine ideas from different fields</motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Listen deeply to what people need</motion.li>
                </motion.ul>
                <motion.blockquote className="border-l-4 border-orange-400 pl-4 italic text-orange-200 mb-4" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                  "Ideas are easy. Implementation is hard."<br />
                  <span className="text-xs">- Guy Kawasaki, Entrepreneur & Author</span>
                </motion.blockquote>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("mindmap")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "mindmap" && (
              <motion.div key="mindmap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Mind Mapping Workshop</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Mind maps are a powerful, visual way to organize your thoughts and discover new connections. Instead of writing a boring business plan, start with a mind map—it's faster, more creative, and helps you see the big picture.
                </motion.p>
                <motion.div className="mb-4 p-4 bg-gray-800/80 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="mb-2 text-orange-200 font-semibold">How to use this mind map:</div>
                  <ul className="list-disc list-inside text-gray-200 text-base mb-2">
                    <li>Start with a central idea (your business or problem).</li>
                    <li>Add branches for customer needs, solutions, features, competitors, etc.</li>
                    <li>Drag nodes to rearrange. Double-click a node to delete it.</li>
                    <li>Be creative—there are no wrong answers!</li>
                  </ul>
                </motion.div>
                <MindMap />
                <div className="flex gap-4 mt-8">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("marketstructure")}>
                    Next
                  </button>
                </div>
              </motion.div>
            )}
            {activeSection === "marketstructure" && (
              <motion.div key="marketstructure" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Market Structure Explorer</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Not all markets are the same! Some have just one big player, others have a few giants, and some are open to many competitors. Let's explore the three main types:
                </motion.p>
                <MarketStructureActivity />
                <div className="flex gap-4 mt-8">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("ideavalidation")}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "ideavalidation" && (
              <motion.div key="ideavalidation" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Idea Validation Challenge</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Great ideas need validation! Work through this checklist to see if your business idea is ready for the real world. Check off each step and reflect as you go.
                </motion.p>
                <IdeaValidationChecklist />
                <div className="flex gap-4 mt-8">
                  <button className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("competitiveanalysis")}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "competitiveanalysis" && (
              <motion.div key="competitiveanalysis" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Competitive Analysis Tool</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Use this interactive SWOT grid to analyze your business idea. Drag each card into the quadrant where it fits best. When you finish, you'll get instant feedback!
                </motion.p>
                <SWOTGrid onNext={() => setActiveSection("reflection")} />
              </motion.div>
            )}
            {activeSection === "reflection" && (
              <motion.div key="reflection" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Mini-Reflection</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Reflect on what you've learned and commit to your next steps...</motion.p>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("quiz")} disabled={!hasNextSection}>Next</button>
                </div>
              </motion.div>
            )}
            {activeSection === "quiz" && (
              <motion.div key="quiz" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Quiz</h2>
                <motion.p className="mb-4 text-lg text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Test your knowledge with this engaging quiz...</motion.p>
                <div className="flex gap-4">
                  <button className="mt-6 px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow hover:bg-orange-500 transition" onClick={() => setActiveSection("introduction")} disabled={!hasNextSection}>Restart</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Next button for lesson navigation */}
          <div className="flex justify-end mt-12">
            <button
              onClick={() => hasNextSection && setActiveSection(nextSectionId!)}
              disabled={!hasNextSection}
              className={`px-8 py-3 rounded-lg font-bold text-lg shadow transition-all
                ${hasNextSection
                  ? "bg-gradient-to-r from-orange-400 to-orange-600 text-black hover:from-orange-500 hover:to-orange-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
            >
              Next
            </button>
          </div>
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

// MindMap component implementation
import { useRef, MouseEvent } from "react";

type MindMapNode = {
  id: number;
  text: string;
  x: number;
  y: number;
  parent: number | null;
};

function MindMap() {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    { id: 1, text: "My Business Idea", x: 300, y: 120, parent: null },
  ]);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedNode, setSelectedNode] = useState<number>(1);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Add a new node
  const addNode = (parentId: number) => {
    if (!newNodeText.trim()) return;
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;
    const angle = Math.random() * 2 * Math.PI;
    const radius = 120 + Math.random() * 40;
    const x = parent.x + Math.cos(angle) * radius;
    const y = parent.y + Math.sin(angle) * radius;
    setNodes([
      ...nodes,
      {
        id: Date.now(),
        text: newNodeText,
        x,
        y,
        parent: parentId,
      },
    ]);
    setNewNodeText("");
  };

  // Drag logic
  const handleMouseDown = (e: MouseEvent<SVGGElement>, node: MindMapNode) => {
    setDraggedNode(node.id);
    setDragOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
  };
  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (draggedNode) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNode
            ? { ...n, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : n
        )
      );
    }
  };
  const handleMouseUp = () => setDraggedNode(null);

  // Delete node on double click (except root)
  const handleDoubleClick = (node: MindMapNode) => {
    if (node.parent === null) return;
    setNodes(nodes.filter((n) => n.id !== node.id && n.parent !== node.id));
    if (selectedNode === node.id) setSelectedNode(1);
  };

  // Attach mouse events to SVG
  useEffect(() => {
    if (draggedNode) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove as any);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  });

  // Helper to fit text in node
  function fitText(text: string, maxLen: number, maxFont: number, minFont: number) {
    if (text.length <= maxLen) return { fontSize: maxFont, lines: [text] };
    // Try to split into multiple lines
    const words = text.split(' ');
    let lines: string[] = [];
    let current = '';
    for (let word of words) {
      if ((current + ' ' + word).trim().length > maxLen) {
        lines.push(current.trim());
        current = word;
      } else {
        current += ' ' + word;
      }
    }
    if (current) lines.push(current.trim());
    // Reduce font size if too many lines
    let fontSize = maxFont;
    if (lines.length > 2) fontSize = minFont;
    else if (lines.length === 2) fontSize = Math.max(minFont, maxFont - 3);
    return { fontSize, lines };
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 flex gap-2">
        <input
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
          placeholder="Add a new node..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-orange-400 text-black font-bold rounded shadow hover:bg-orange-500 transition"
          onClick={() => addNode(selectedNode)}
        >
          Add Branch
        </button>
      </div>
      <svg
        ref={svgRef}
        width={600}
        height={400}
        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700"
        style={{ touchAction: "none" }}
      >
        {/* Draw lines */}
        {nodes.map((node) =>
          node.parent !== null ? (
            (() => {
              const parent = nodes.find((n) => n.id === node.parent);
              if (!parent) return null;
              return (
                <line
                  key={"line-" + node.id}
                  x1={parent.x}
                  y1={parent.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="#fb923c"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                />
              );
            })()
          ) : null
        )}
        {/* Draw nodes */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNode;
          const { fontSize, lines } = fitText(node.text, node.parent === null ? 16 : 13, node.parent === null ? 18 : 15, 11);
          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              style={{ cursor: node.parent === null ? "default" : "grab" }}
              onMouseDown={(e) => handleMouseDown(e, node)}
              onDoubleClick={() => handleDoubleClick(node)}
              onClick={() => setSelectedNode(node.id)}
            >
              <circle
                r={node.parent === null ? 38 : 28}
                fill={isSelected ? "#fdba74" : node.parent === null ? "#fb923c" : "#fff"}
                stroke="#fb923c"
                strokeWidth={isSelected ? 5 : 3}
                filter="drop-shadow(0 2px 8px #fb923c88)"
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={0}
                  y={-((lines.length - 1) * fontSize) / 2 + i * fontSize}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={fontSize}
                  fill={node.parent === null ? "#222" : "#fb923c"}
                  fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none", fontFamily: 'inherit' }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-4 text-sm text-gray-400">
        Tip: Click any node to select it, then add branches from it. Double-click a node to delete it. Drag nodes to rearrange your map.
      </div>
    </div>
  );
}

// MarketStructureActivity component implementation
function MarketStructureActivity() {
  const structures = [
    {
      id: "monopoly",
      label: "Monopoly",
      desc: "A single company dominates the entire market.",
      color: "from-orange-400 to-orange-600",
      example: "Google (Search)",
    },
    {
      id: "oligopoly",
      label: "Oligopoly",
      desc: "A few large companies control most of the market.",
      color: "from-blue-400 to-blue-600",
      example: "Airbus & Boeing (Airplanes)",
    },
    {
      id: "competitive",
      label: "Competitive",
      desc: "Many companies compete freely.",
      color: "from-green-400 to-green-600",
      example: "Coffee Shops",
    },
  ];
  const companies = [
    { name: "Google (Search)", correct: "monopoly" },
    { name: "Airbus & Boeing", correct: "oligopoly" },
    { name: "Local Cafés", correct: "competitive" },
    { name: "Coca-Cola & Pepsi", correct: "oligopoly" },
    { name: "Amazon (E-commerce)", correct: "competitive" },
    { name: "Microsoft Windows", correct: "monopoly" },
  ];
  const [dragged, setDragged] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string[] }>({ monopoly: [], oligopoly: [], competitive: [] });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  // Drag handlers
  const handleDragStart = (name: string) => setDragged(name);
  const handleDrop = (structureId: string) => {
    if (!dragged) return;
    setMatches((prev) => {
      // Remove from all
      const newMatches = { ...prev };
      Object.keys(newMatches).forEach((k) => {
        newMatches[k] = newMatches[k].filter((n) => n !== dragged);
      });
      newMatches[structureId].push(dragged);
      return newMatches;
    });
    setDragged(null);
    setFeedback(null);
  };
  const handleCheck = () => {
    let correctCount = 0;
    companies.forEach((c) => {
      if (matches[c.correct]?.includes(c.name)) correctCount++;
    });
    if (correctCount === companies.length) {
      setFeedback("Awesome! All matches are correct. You really get market structures!");
    } else {
      setFeedback(`You got ${correctCount} out of ${companies.length} correct. Try again or show answers!`);
    }
  };
  const handleShowAnswers = () => {
    const newMatches: { [key: string]: string[] } = { monopoly: [], oligopoly: [], competitive: [] };
    companies.forEach((c) => newMatches[c.correct].push(c.name));
    setMatches(newMatches);
    setShowAnswers(true);
    setFeedback("Here's the correct classification!");
  };

  // Unmatched companies
  const unmatched = companies.filter((c) => !Object.values(matches).flat().includes(c.name));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center mb-6">
        {structures.map((s) => (
          <motion.div
            key={s.id}
            className={`flex-1 min-w-[220px] bg-gradient-to-br ${s.color} rounded-xl p-5 shadow-lg flex flex-col items-center transition-all relative overflow-visible`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(s.id)}
            whileHover={{ scale: 1.03, boxShadow: "0 0 0 4px #fb923c33" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-xl font-bold mb-2 text-white drop-shadow">{s.label}</div>
            <div className="mb-2 text-white/80 text-sm text-center">{s.desc}</div>
            <div className="mb-2 text-orange-100 text-xs italic">e.g. {s.example}</div>
            <div className="min-h-[60px] w-full flex flex-col gap-2 mt-2">
              {matches[s.id].map((name) => (
                <motion.div
                  key={name}
                  className="p-2 rounded bg-white/90 text-gray-900 font-semibold shadow border border-orange-200 text-center relative"
                  initial={{ scale: 0.85, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
                  layout
                >
                  <motion.span
                    whileHover={{ scale: 1.06, color: "#fb923c" }}
                    className="inline-block"
                  >
                    {name}
                  </motion.span>
                  <motion.button
                    className="absolute top-1 right-1 text-xs text-orange-400 hover:text-orange-600 bg-white/70 rounded-full px-2 py-1 shadow"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      setMatches((prev) => {
                        const newMatches = { ...prev };
                        newMatches[s.id] = newMatches[s.id].filter((n) => n !== name);
                        return newMatches;
                      });
                      setFeedback(null);
                    }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {unmatched.map((c) => (
          <motion.div
            key={c.name}
            className="p-3 bg-gray-700 text-orange-200 rounded-lg shadow cursor-move font-bold text-center min-w-[120px] hover:bg-orange-400/80 hover:text-black transition relative"
            draggable
            onDragStart={() => handleDragStart(c.name)}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
            whileHover={{ scale: 1.06, backgroundColor: "#fb923c", color: "#222" }}
            layout
          >
            {c.name}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button className="px-4 py-2 bg-orange-400 text-black font-bold rounded shadow hover:bg-orange-500 transition" onClick={handleCheck}>Check Answers</button>
        <button className="px-4 py-2 bg-gray-700 text-orange-200 font-bold rounded shadow hover:bg-gray-800 transition" onClick={handleShowAnswers}>Show Answers</button>
      </div>
      {feedback && <motion.div className="mt-4 p-4 rounded-lg bg-gray-900/80 text-orange-200 font-semibold shadow text-center max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>{feedback}</motion.div>}
    </div>
  );
}

// IdeaValidationChecklist component implementation
function IdeaValidationChecklist() {
  const steps = [
    {
      label: "Is there a real problem?",
      prompt: "Describe the problem your idea solves.",
    },
    {
      label: "Have you talked to potential customers?",
      prompt: "What did you learn from them?",
    },
    {
      label: "Is your solution unique or better?",
      prompt: "How is your idea different or better than what's out there?",
    },
    {
      label: "Can you reach your customers?",
      prompt: "How will you find and reach your first users?",
    },
    {
      label: "Will people pay (or use) it?",
      prompt: "Why would someone pay for or use your solution?",
    },
  ];
  const [checked, setChecked] = useState<boolean[]>(Array(steps.length).fill(false));
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));
  const [showSummary, setShowSummary] = useState(false);

  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };
  const handleAnswer = (idx: number, val: string) => {
    setAnswers((prev) => prev.map((v, i) => (i === idx ? val : v)));
  };
  const handleFinish = () => {
    setShowSummary(true);
  };
  const progress = Math.round((checked.filter(Boolean).length / steps.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-base font-semibold text-silver-400">Validation Progress</span>
        <span className="text-silver-400 font-bold">{progress}%</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <div className="space-y-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.label}
            className={`rounded-xl p-5 shadow-lg bg-gray-900/80 flex flex-col gap-2 border transition-all ${checked[idx] ? "border-orange-400" : "border-gray-800"}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.7, ease: "easeOut" }}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked[idx]}
                onChange={() => handleCheck(idx)}
                className="accent-orange-400 w-5 h-5"
              />
              <span className={`font-bold text-lg ${checked[idx] ? "text-orange-300" : "text-gray-200"}`}>{step.label}</span>
            </label>
            <textarea
              className="w-full mt-2 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none transition"
              placeholder={step.prompt}
              value={answers[idx]}
              onChange={e => handleAnswer(idx, e.target.value)}
              rows={2}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className={`px-6 py-3 rounded-lg font-bold text-lg shadow transition-all ${checked.every(Boolean) ? "bg-gradient-to-r from-orange-400 to-orange-600 text-black hover:from-orange-500 hover:to-orange-700" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
          onClick={handleFinish}
          disabled={!checked.every(Boolean)}
        >
          Finish Validation
        </button>
      </div>
      {showSummary && (
        <motion.div className="mt-8 p-6 rounded-xl bg-green-900/80 text-green-200 font-semibold shadow text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <div className="text-2xl mb-2">🎉 Great job validating your idea!</div>
          <div className="mb-2">You've thought through the essentials. Remember, validation is an ongoing process—keep talking to customers and refining your idea.</div>
        </motion.div>
      )}
    </div>
  );
}

// SWOTGrid component implementation
function SWOTGrid({ onNext }: { onNext: () => void }) {
  const quadrants = [
    { id: "strengths", label: "Strengths", color: "from-green-400 to-green-600" },
    { id: "weaknesses", label: "Weaknesses", color: "from-red-400 to-red-600" },
    { id: "opportunities", label: "Opportunities", color: "from-blue-400 to-blue-600" },
    { id: "threats", label: "Threats", color: "from-orange-400 to-orange-600" },
  ];
  const cards = [
    { text: "Strong brand", correct: "strengths" },
    { text: "High costs", correct: "weaknesses" },
    { text: "New market", correct: "opportunities" },
    { text: "Aggressive competitors", correct: "threats" },
    { text: "Loyal customers", correct: "strengths" },
    { text: "Limited resources", correct: "weaknesses" },
    { text: "Tech innovation", correct: "opportunities" },
    { text: "Changing regulations", correct: "threats" },
  ];
  const [dragged, setDragged] = useState<string | null>(null);
  const [placements, setPlacements] = useState<{ [key: string]: string[] }>({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Drag handlers
  const handleDragStart = (text: string) => setDragged(text);
  const handleDrop = (quadId: string) => {
    if (!dragged) return;
    setPlacements((prev) => {
      // Remove from all
      const newPlacements = { ...prev };
      Object.keys(newPlacements).forEach((k) => {
        newPlacements[k] = newPlacements[k].filter((n) => n !== dragged);
      });
      newPlacements[quadId].push(dragged);
      return newPlacements;
    });
    setDragged(null);
    setFeedback(null);
  };
  const handleCheck = () => {
    let correctCount = 0;
    cards.forEach((c) => {
      if (placements[c.correct]?.includes(c.text)) correctCount++;
    });
    if (correctCount === cards.length) {
      setFeedback("Excellent! All cards are in the right place. You understand SWOT analysis!");
      setShowSummary(true);
    } else {
      setFeedback(`You got ${correctCount} out of ${cards.length} correct. Try again or review your placements!`);
    }
  };
  const handleReset = () => {
    setPlacements({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
    setFeedback(null);
    setShowSummary(false);
  };

  // Unplaced cards
  const unplaced = cards.filter((c) => !Object.values(placements).flat().includes(c.text));

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full mb-8">
        {quadrants.map((q) => (
          <motion.div
            key={q.id}
            className={`rounded-xl p-5 min-h-[140px] bg-gradient-to-br ${q.color} shadow-lg flex flex-col items-center relative transition-all`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(q.id)}
            whileHover={{ scale: 1.03, boxShadow: "0 0 0 4px #fb923c33" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-lg font-bold mb-2 text-white drop-shadow">{q.label}</div>
            <div className="flex flex-col gap-2 w-full">
              {placements[q.id].map((text) => (
                <motion.div
                  key={text}
                  className="p-2 rounded bg-white/90 text-gray-900 font-semibold shadow border border-orange-200 text-center relative"
                  initial={{ scale: 0.85, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
                  layout
                >
                  <motion.span
                    whileHover={{ scale: 1.06, color: "#fb923c" }}
                    className="inline-block"
                  >
                    {text}
                  </motion.span>
                  <motion.button
                    className="absolute top-1 right-1 text-xs text-orange-400 hover:text-orange-600 bg-white/70 rounded-full px-2 py-1 shadow"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      setPlacements((prev) => {
                        const newPlacements = { ...prev };
                        newPlacements[q.id] = newPlacements[q.id].filter((n) => n !== text);
                        return newPlacements;
                      });
                      setFeedback(null);
                    }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {unplaced.map((c) => (
          <motion.div
            key={c.text}
            className="p-3 bg-gray-700 text-orange-200 rounded-lg shadow cursor-move font-bold text-center min-w-[120px] hover:bg-orange-400/80 hover:text-black transition relative"
            draggable
            onDragStart={() => handleDragStart(c.text)}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
            whileHover={{ scale: 1.06, backgroundColor: "#fb923c", color: "#222" }}
            layout
          >
            {c.text}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button className="px-4 py-2 bg-orange-400 text-black font-bold rounded shadow hover:bg-orange-500 transition" onClick={handleCheck}>Check Answers</button>
        <button className="px-4 py-2 bg-gray-700 text-orange-200 font-bold rounded shadow hover:bg-gray-800 transition" onClick={handleReset}>Reset</button>
        {showSummary && feedback?.startsWith("Excellent") && (
          <button className="px-4 py-2 bg-green-500 text-white font-bold rounded shadow hover:bg-green-600 transition" onClick={onNext}>Next</button>
        )}
      </div>
      {feedback && <motion.div className="mt-4 p-4 rounded-lg bg-gray-900/80 text-orange-200 font-semibold shadow text-center max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>{feedback}</motion.div>}
      {showSummary && feedback?.startsWith("Excellent") && (
        <motion.div className="mt-8 p-6 rounded-xl bg-green-900/80 text-green-200 font-semibold shadow text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <div className="text-2xl mb-2">🎯 You completed the SWOT analysis!</div>
          <div className="mb-2">Use this tool whenever you want to analyze a new idea or competitor. Great job!</div>
        </motion.div>
      )}
    </div>
  );
} 