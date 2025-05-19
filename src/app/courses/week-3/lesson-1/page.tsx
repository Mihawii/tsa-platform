"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const sections = [
  { id: "agile", label: "What Is Agile Project Management?" },
  { id: "gantt", label: "Gantt Charts: Visualizing the Big Picture" },
  { id: "risk", label: "Risk Management Essentials" },
  { id: "register", label: "Risk Register Activity" },
  { id: "quiz", label: "Ultimate Agile Quiz" },
];

// Agile Manifesto Principles
const manifestoPrinciples = [
  {
    title: "Individuals and Interactions",
    description: "Over processes and tools",
    explanation: "While tools and processes are important, the focus should be on people and how they work together."
  },
  {
    title: "Working Software",
    description: "Over comprehensive documentation",
    explanation: "Delivering functional software that meets user needs is more valuable than extensive documentation."
  },
  {
    title: "Customer Collaboration",
    description: "Over contract negotiation",
    explanation: "Building relationships with customers and adapting to their needs is more important than rigid contracts."
  },
  {
    title: "Responding to Change",
    description: "Over following a plan",
    explanation: "Being able to adapt to changing requirements is more valuable than strictly following a fixed plan."
  }
];

// Gantt Chart Task Interface
interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies: string[];
  description: string;
  color: string;
}

// Risk Matrix Interface
interface Risk {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  category: string;
  mitigation: string;
  status: "Open" | "Mitigated" | "Accepted";
}

const riskCategories = [
  "Technical",
  "Schedule",
  "Budget",
  "Resource",
  "Scope",
  "Quality"
];

const initialRisks: Risk[] = [
  {
    id: "1",
    name: "Technical Debt",
    description: "Accumulation of technical debt due to rushed development",
    probability: 0.7,
    impact: 0.8,
    category: "Technical",
    mitigation: "Regular code reviews and refactoring sessions",
    status: "Open"
  },
  {
    id: "2",
    name: "Resource Unavailability",
    description: "Key team members becoming unavailable",
    probability: 0.4,
    impact: 0.9,
    category: "Resource",
    mitigation: "Cross-training and documentation",
    status: "Open"
  }
];

const initialTasks: Task[] = [
  {
    id: "1",
    name: "Project Planning",
    description: "Define project scope, objectives, and timeline",
    startDate: new Date(2024, 3, 1),
    endDate: new Date(2024, 3, 7),
    progress: 0,
    dependencies: [],
    color: "#F97316" // orange-500
  },
  {
    id: "2",
    name: "Requirements Gathering",
    description: "Collect and document project requirements",
    startDate: new Date(2024, 3, 8),
    endDate: new Date(2024, 3, 14),
    progress: 0,
    dependencies: ["1"],
    color: "#22C55E" // green-500
  }
];

// Quiz questions
const quizQuestions = [
  {
    question: "Which of the following is NOT a core value of the Agile Manifesto?",
    options: [
      "Individuals and interactions over processes and tools",
      "Comprehensive documentation over working software",
      "Customer collaboration over contract negotiation",
      "Responding to change over following a plan"
    ],
    answer: 1
  },
  {
    question: "What is the primary purpose of a Gantt chart?",
    options: [
      "To visualize project timelines and dependencies",
      "To track project risks",
      "To manage team communication",
      "To estimate project costs"
    ],
    answer: 0
  },
  {
    question: "In risk management, which risks should be prioritized first?",
    options: [
      "Low probability, low impact",
      "High probability, high impact",
      "Low probability, high impact",
      "High probability, low impact"
    ],
    answer: 1
  },
  {
    question: "Which Agile role is responsible for maximizing the value of the product?",
    options: [
      "Scrum Master",
      "Product Owner",
      "Development Team",
      "Stakeholder"
    ],
    answer: 1
  },
  {
    question: "What is a sprint in Agile methodology?",
    options: [
      "A short, time-boxed period to complete a set of work",
      "A meeting to review project risks",
      "A tool for visualizing project timelines",
      "A document outlining project requirements"
    ],
    answer: 0
  }
];

export default function Lesson1Page() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activePrinciple, setActivePrinciple] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [newRisk, setNewRisk] = useState<Risk>({
    id: "",
    name: "",
    description: "",
    probability: 0.5,
    impact: 0.5,
    category: riskCategories[0],
    mitigation: "",
    status: "Open"
  });
  const [showGanttGuide, setShowGanttGuide] = useState(true);
  const [showRiskGuide, setShowRiskGuide] = useState(true);
  const [showRegisterGuide, setShowRegisterGuide] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number|null)[]>(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState("");

  const progress = Math.round((sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100);

  // Calculate timeline dimensions
  const timelineStart = new Date(2024, 3, 1);
  const timelineEnd = new Date(2024, 4, 1);
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate Gantt chart visible range
  const minStart = tasks.length ? new Date(Math.min(...tasks.map(t => t.startDate.getTime()))) : timelineStart;
  const maxEnd = tasks.length ? new Date(Math.max(...tasks.map(t => t.endDate.getTime()))) : timelineEnd;
  // Add a buffer of 2 days before and after
  minStart.setDate(minStart.getDate() - 2);
  maxEnd.setDate(maxEnd.getDate() + 2);
  const ganttDays = Math.ceil((maxEnd.getTime() - minStart.getTime()) / (1000 * 60 * 60 * 24));

  // Update timeline width on mount and resize
  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };

    updateTimelineWidth();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateTimelineWidth);
      return () => window.removeEventListener('resize', updateTimelineWidth);
    }
  }, []);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = (taskId: string, newStartDate: Date) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const duration = task.endDate.getTime() - task.startDate.getTime();
          const newEndDate = new Date(newStartDate.getTime() + duration);
          return { ...task, startDate: newStartDate, endDate: newEndDate };
        }
        return task;
      });

      // Update dependent tasks
      return updatedTasks.map(task => {
        if (task.dependencies.includes(taskId)) {
          const dependency = updatedTasks.find(t => t.id === taskId);
          if (dependency) {
            const newStartDate = new Date(dependency.endDate);
            const duration = task.endDate.getTime() - task.startDate.getTime();
            const newEndDate = new Date(newStartDate.getTime() + duration);
            return { ...task, startDate: newStartDate, endDate: newEndDate };
          }
        }
        return task;
      });
    });
    setDraggedTask(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRiskLevel = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    if (riskScore > 0.6) return "High";
    if (riskScore > 0.3) return "Medium";
    return "Low";
  };

  const getRiskColor = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    if (riskScore > 0.6) return "bg-red-500/20";
    if (riskScore > 0.3) return "bg-yellow-500/20";
    return "bg-green-500/20";
  };

  const handleQuizSubmit = (correct: number) => {
    if (typeof window !== 'undefined') {
      if (correct >= Math.ceil(quizQuestions.length * 0.8)) {
        localStorage.setItem("week3_lesson1_progress", JSON.stringify({ status: "Completed", score: Math.round((correct / quizQuestions.length) * 100) }));
      } else {
        localStorage.setItem("week3_lesson1_progress", JSON.stringify({ status: "In Progress", score: Math.round((correct / quizQuestions.length) * 100) }));
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
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
          {/* Back Button */}
          <div className="mb-6 flex items-center gap-6 text-gray-400 text-sm">
            <Link href="/courses" className="hover:underline text-orange-400">&larr; Back to Courses</Link>
            <span>Week 3, Lesson 1</span>
            <span>4 sections</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            The Foundations of Agile, Gantt Charts, and Risk
          </h1>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold text-silver-400">Lesson Progress</span>
              <span className="text-silver-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            {activeSection === "agile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">What Is Agile Project Management?</h2>
                
                <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-orange-200">The Agile Manifesto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manifestoPrinciples.map((principle, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          activePrinciple === index 
                            ? "bg-orange-500/20 border-2 border-orange-400" 
                            : "bg-gray-700/50 hover:bg-gray-700"
                        }`}
                        onClick={() => setActivePrinciple(activePrinciple === index ? null : index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h4 className="font-bold text-lg mb-2">{principle.title}</h4>
                        <p className="text-gray-300 italic">{principle.description}</p>
                        {activePrinciple === index && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 text-gray-200"
                          >
                            {principle.explanation}
                          </motion.p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-orange-200">Key Benefits of Agile</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 text-xl">•</span>
                      <div>
                        <span className="font-semibold">Faster Time to Market</span>
                        <p className="text-gray-300">Deliver working software in shorter cycles, getting feedback early and often.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 text-xl">•</span>
                      <div>
                        <span className="font-semibold">Better Quality</span>
                        <p className="text-gray-300">Continuous testing and integration lead to higher quality products.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 text-xl">•</span>
                      <div>
                        <span className="font-semibold">Increased Customer Satisfaction</span>
                        <p className="text-gray-300">Regular feedback and adaptation ensure the product meets customer needs.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeSection === "gantt" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Gantt Charts: Visualizing the Big Picture</h2>
                
                {showGanttGuide && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-orange-200">Quick Guide to Gantt Charts</h3>
                      <button
                        onClick={() => setShowGanttGuide(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>Gantt charts help you visualize project timelines and dependencies. Here's how to use this tool:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Drag tasks left or right to adjust their start dates</li>
                        <li>Click "Add New Task" to create a new project activity</li>
                        <li>Click on any task to view or edit its details</li>
                        <li>Tasks with dependencies will automatically adjust when you move their prerequisites</li>
                      </ol>
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold text-orange-200 mb-2">Pro Tip:</h4>
                        <p>Start with high-level tasks and break them down into smaller activities. This helps create a more manageable project timeline.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-orange-200">Interactive Gantt Chart Builder</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowGanttGuide(true)}
                        className="px-4 py-2 text-gray-300 hover:text-white"
                      >
                        Show Guide
                      </button>
                      <button
                        onClick={() => setSelectedTask({
                          id: String(tasks.length + 1),
                          name: "",
                          description: "",
                          startDate: new Date(),
                          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          progress: 0,
                          dependencies: [],
                          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
                        })}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Add New Task
                      </button>
                    </div>
                  </div>

                  {/* Timeline Header - only show visible range */}
                  <div className="flex mb-4 overflow-x-auto" ref={timelineRef} style={{ maxWidth: '100%' }}>
                    <div className="w-48 flex-shrink-0"></div>
                    <div className="flex-1 flex min-w-[600px] max-w-full">
                      {Array.from({ length: ganttDays }, (_, i) => {
                        const date = new Date(minStart);
                        date.setDate(date.getDate() + i);
                        return (
                          <div
                            key={i}
                            className="flex-1 text-center text-xs text-gray-400 border-r border-gray-700 min-w-[40px]"
                            style={{ maxWidth: 60 }}
                          >
                            {formatDate(date)}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks - only show within visible range */}
                  <div className="space-y-4 overflow-x-auto" style={{ maxWidth: '100%' }}>
                    {tasks.map((task) => {
                      const startOffset = Math.floor((task.startDate.getTime() - minStart.getTime()) / (1000 * 60 * 60 * 24));
                      const duration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={task.id} className="flex items-center group">
                          <div className="w-48 flex-shrink-0">
                            <span
                              className="font-medium group-hover:text-orange-400 transition-colors cursor-pointer"
                              onClick={() => setSelectedTask(task)}
                            >
                              {task.name}
                            </span>
                            <div className="text-sm text-gray-400">
                              {formatDate(task.startDate)} - {formatDate(task.endDate)}
                            </div>
                          </div>
                          <div className="flex-1 relative h-8 min-w-[600px] max-w-full">
                            <motion.div
                              className="absolute h-full rounded-lg cursor-move group-hover:opacity-80 transition-opacity"
                              style={{
                                left: `${(startOffset / ganttDays) * 100}%`,
                                width: `${(duration / ganttDays) * 100}%`,
                                backgroundColor: task.color,
                                minWidth: 40,
                                maxWidth: 60
                              }}
                              drag="x"
                              dragConstraints={{ left: 0, right: timelineWidth }}
                              dragElastic={0}
                              onDragStart={() => handleDragStart(task)}
                              onDragEnd={(_, info) => {
                                const daysToMove = Math.round((info.point.x / timelineWidth) * ganttDays);
                                const newStartDate = new Date(minStart);
                                newStartDate.setDate(newStartDate.getDate() + daysToMove);
                                handleDragEnd(task.id, newStartDate);
                              }}
                            >
                              <div className="h-full flex items-center justify-center text-white text-sm">
                                {task.progress}%
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedTask && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                  >
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
                      <h3 className="text-xl font-semibold mb-4 text-orange-200">
                        {selectedTask.id === String(tasks.length + 1) ? "Add New Task" : "Edit Task"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
                          <input
                            type="text"
                            value={selectedTask.name}
                            onChange={(e) => setSelectedTask(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                          <textarea
                            value={selectedTask.description}
                            onChange={(e) => setSelectedTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={selectedTask.startDate.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const newStartDate = new Date(e.target.value);
                                const duration = selectedTask.endDate.getTime() - selectedTask.startDate.getTime();
                                setSelectedTask(prev => prev ? {
                                  ...prev,
                                  startDate: newStartDate,
                                  endDate: new Date(newStartDate.getTime() + duration)
                                } : null);
                              }}
                              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                            <input
                              type="date"
                              value={selectedTask.endDate.toISOString().split('T')[0]}
                              onChange={(e) => setSelectedTask(prev => prev ? {
                                ...prev,
                                endDate: new Date(e.target.value)
                              } : null)}
                              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Progress (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={selectedTask.progress}
                            onChange={(e) => setSelectedTask(prev => prev ? {
                              ...prev,
                              progress: parseInt(e.target.value)
                            } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Task Color</label>
                          <input
                            type="color"
                            value={selectedTask.color}
                            onChange={(e) => setSelectedTask(prev => prev ? {
                              ...prev,
                              color: e.target.value
                            } : null)}
                            className="w-full h-10 bg-gray-700 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Dependencies</label>
                          <select
                            multiple
                            value={selectedTask.dependencies}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              setSelectedTask(prev => prev ? {
                                ...prev,
                                dependencies: selectedOptions
                              } : null);
                            }}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          >
                            {tasks
                              .filter(task => task.id !== selectedTask.id)
                              .map(task => (
                                <option key={task.id} value={task.id}>
                                  {task.name}
                                </option>
                              ))}
                          </select>
                          <p className="mt-1 text-sm text-gray-400">Hold Ctrl/Cmd to select multiple dependencies</p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setSelectedTask(null)}
                            className="px-4 py-2 text-gray-300 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (selectedTask.name && selectedTask.description) {
                                if (selectedTask.id === String(tasks.length + 1)) {
                                  setTasks(prev => [...prev, selectedTask]);
                                } else {
                                  setTasks(prev => prev.map(task =>
                                    task.id === selectedTask.id ? selectedTask : task
                                  ));
                                }
                                setSelectedTask(null);
                              }
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            {selectedTask.id === String(tasks.length + 1) ? "Add Task" : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeSection === "risk" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Risk Management Essentials</h2>
                
                {showRiskGuide && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-orange-200">Understanding Risk Assessment</h3>
                      <button
                        onClick={() => setShowRiskGuide(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>The risk matrix helps you assess and prioritize project risks. Here's how to use it:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Click on a cell in the matrix to set the probability and impact levels</li>
                        <li>Green cells indicate low-risk items</li>
                        <li>Yellow cells represent medium-risk items</li>
                        <li>Red cells show high-risk items that need immediate attention</li>
                      </ol>
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold text-orange-200 mb-2">Pro Tip:</h4>
                        <p>Focus on high-probability, high-impact risks first. These are your top priorities for risk management.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-orange-200">Risk Matrix</h3>
                    <button
                      onClick={() => setShowRiskGuide(true)}
                      className="px-4 py-2 text-gray-300 hover:text-white"
                    >
                      Show Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="text-center text-sm text-gray-400">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 25 }, (_, i) => {
                      const row = Math.floor(i / 5);
                      const col = i % 5;
                      const probability = (col + 1) / 5;
                      const impact = (5 - row) / 5;
                      const riskLevel = probability * impact;
                      
                      return (
                        <motion.div
                          key={i}
                          className={`aspect-square rounded-lg cursor-pointer ${getRiskColor(probability, impact)}`}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            setNewRisk(prev => ({
                              ...prev,
                              probability,
                              impact
                            }));
                          }}
                        >
                          <div className="h-full flex items-center justify-center text-white text-sm">
                            {getRiskLevel(probability, impact)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-400">
                    <span>Low Probability</span>
                    <span>High Probability</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>High Impact</span>
                    <span>Low Impact</span>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-orange-200">Add New Risk</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Risk Name</label>
                      <input
                        type="text"
                        value={newRisk.name}
                        onChange={(e) => setNewRisk(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Technical Debt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        value={newRisk.description}
                        onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        placeholder="Describe the risk and its potential impact..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select
                        value={newRisk.category}
                        onChange={(e) => setNewRisk(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                      >
                        {riskCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Risk Level</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-400 mb-1">Probability</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={newRisk.probability}
                            onChange={(e) => setNewRisk(prev => ({ ...prev, probability: parseFloat(e.target.value) }))}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-400 text-center">
                            {Math.round(newRisk.probability * 100)}%
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-gray-400 mb-1">Impact</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={newRisk.impact}
                            onChange={(e) => setNewRisk(prev => ({ ...prev, impact: parseFloat(e.target.value) }))}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-400 text-center">
                            {Math.round(newRisk.impact * 100)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 p-2 rounded-lg text-center text-sm font-medium"
                           style={{ backgroundColor: getRiskColor(newRisk.probability ?? 0, newRisk.impact ?? 0) }}>
                        {getRiskLevel(newRisk.probability ?? 0, newRisk.impact ?? 0)} Risk
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        value={newRisk.status}
                        onChange={(e) => setNewRisk(prev => ({
                          ...prev,
                          status: e.target.value as Risk["status"]
                        }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Open">Open</option>
                        <option value="Mitigated">Mitigated</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Mitigation Strategy</label>
                      <textarea
                        value={newRisk.mitigation}
                        onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newRisk.name && newRisk.description && newRisk.mitigation) {
                          setRisks(prev => [...prev, {
                            ...newRisk as Risk,
                            id: String(prev.length + 1)
                          }]);
                          setNewRisk({
                            id: "",
                            name: "",
                            description: "",
                            probability: 0.5,
                            impact: 0.5,
                            category: riskCategories[0],
                            mitigation: "",
                            status: "Open"
                          });
                        }
                      }}
                      className="w-full bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600 transition-colors"
                    >
                      Add Risk
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "register" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Risk Register Activity</h2>
                
                {showRegisterGuide && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-orange-200">Using the Risk Register</h3>
                      <button
                        onClick={() => setShowRegisterGuide(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>The risk register helps you track and manage all project risks in one place. Here's how to use it:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>View all identified risks in the table below</li>
                        <li>Click "Edit" to modify any risk's details</li>
                        <li>Monitor probability and impact levels using the progress bars</li>
                        <li>Keep mitigation strategies up to date as the project progresses</li>
                      </ol>
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold text-orange-200 mb-2">Pro Tip:</h4>
                        <p>Regularly review and update your risk register. New risks may emerge, and existing ones may change in probability or impact.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-orange-200">Risk Register</h3>
                    <button
                      onClick={() => setShowRegisterGuide(true)}
                      className="px-4 py-2 text-gray-300 hover:text-white"
                    >
                      Show Guide
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-3 text-gray-300">Risk</th>
                          <th className="pb-3 text-gray-300">Category</th>
                          <th className="pb-3 text-gray-300">Probability</th>
                          <th className="pb-3 text-gray-300">Impact</th>
                          <th className="pb-3 text-gray-300">Risk Level</th>
                          <th className="pb-3 text-gray-300">Status</th>
                          <th className="pb-3 text-gray-300">Mitigation</th>
                          <th className="pb-3 text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risks.map(risk => (
                          <tr key={risk.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                            <td className="py-3">
                              <div>
                                <div className="font-medium">{risk.name}</div>
                                <div className="text-sm text-gray-400">{risk.description}</div>
                              </div>
                            </td>
                            <td className="py-3 text-gray-300">{risk.category}</td>
                            <td className="py-3">
                              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-500"
                                  style={{ width: `${risk.probability * 100}%` }}
                                />
                              </div>
                              <div className="text-sm text-gray-400 text-center mt-1">
                                {Math.round(risk.probability * 100)}%
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-500"
                                  style={{ width: `${risk.impact * 100}%` }}
                                />
                              </div>
                              <div className="text-sm text-gray-400 text-center mt-1">
                                {Math.round(risk.impact * 100)}%
                              </div>
                            </td>
                            <td className="py-3">
                              <div className={`px-2 py-1 rounded-full text-sm text-center ${
                                getRiskLevel(risk.probability, risk.impact) === "High" ? "bg-red-500/20 text-red-400" :
                                getRiskLevel(risk.probability, risk.impact) === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-green-500/20 text-green-400"
                              }`}>
                                {getRiskLevel(risk.probability, risk.impact)}
                              </div>
                            </td>
                            <td className="py-3">
                              <select
                                value={risk.status}
                                onChange={(e) => {
                                  setRisks(prev => prev.map(r =>
                                    r.id === risk.id ? { ...r, status: e.target.value as Risk["status"] } : r
                                  ));
                                }}
                                className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm"
                              >
                                <option value="Open">Open</option>
                                <option value="Mitigated">Mitigated</option>
                                <option value="Accepted">Accepted</option>
                              </select>
                            </td>
                            <td className="py-3 text-gray-300">{risk.mitigation}</td>
                            <td className="py-3">
                              <button
                                onClick={() => setSelectedRisk(risk)}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedRisk && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                  >
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
                      <h3 className="text-xl font-semibold mb-4 text-orange-200">Edit Risk</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Risk Name</label>
                          <input
                            type="text"
                            value={selectedRisk.name}
                            onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                          <textarea
                            value={selectedRisk.description}
                            onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                          <select
                            value={selectedRisk.category}
                            onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, category: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          >
                            {riskCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Risk Level</label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-sm text-gray-400 mb-1">Probability</label>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={selectedRisk.probability}
                                onChange={(e) => setSelectedRisk(prev => prev ? {
                                  ...prev,
                                  probability: parseFloat(e.target.value)
                                } : null)}
                                className="w-full"
                              />
                              <div className="text-sm text-gray-400 text-center">
                                {Math.round(selectedRisk.probability * 100)}%
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm text-gray-400 mb-1">Impact</label>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={selectedRisk.impact}
                                onChange={(e) => setSelectedRisk(prev => prev ? {
                                  ...prev,
                                  impact: parseFloat(e.target.value)
                                } : null)}
                                className="w-full"
                              />
                              <div className="text-sm text-gray-400 text-center">
                                {Math.round(selectedRisk.impact * 100)}%
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 p-2 rounded-lg text-center text-sm font-medium"
                               style={{ backgroundColor: getRiskColor(selectedRisk.probability, selectedRisk.impact) }}>
                            {getRiskLevel(selectedRisk.probability, selectedRisk.impact)} Risk
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                          <select
                            value={selectedRisk.status}
                            onChange={(e) => setSelectedRisk(prev => prev ? {
                              ...prev,
                              status: e.target.value as Risk["status"]
                            } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="Open">Open</option>
                            <option value="Mitigated">Mitigated</option>
                            <option value="Accepted">Accepted</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Mitigation Strategy</label>
                          <textarea
                            value={selectedRisk.mitigation}
                            onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, mitigation: e.target.value } : null)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setSelectedRisk(null)}
                            className="px-4 py-2 text-gray-300 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (selectedRisk) {
                                setRisks(prev => prev.map(risk => 
                                  risk.id === selectedRisk.id ? selectedRisk : risk
                                ));
                                setSelectedRisk(null);
                              }
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeSection === "quiz" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Ultimate Agile Quiz</h2>
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      let correct = 0;
                      quizQuestions.forEach((q, i) => {
                        if (quizAnswers[i] === q.answer) correct++;
                      });
                      setQuizScore(Math.round((correct / quizQuestions.length) * 100));
                      setQuizSubmitted(true);
                      setQuizFeedback(
                        correct === quizQuestions.length
                          ? "Outstanding! You mastered Agile Project Management."
                          : correct >= Math.ceil(quizQuestions.length * 0.8)
                            ? "Great job! You have a strong grasp of Agile."
                            : "Keep practicing! Review the material and try again."
                      );
                      handleQuizSubmit(correct);
                    }}
                    className="space-y-6"
                  >
                    {quizQuestions.map((q, i) => (
                      <div key={i} className="mb-4">
                        <div className="font-semibold mb-2 text-white">{i + 1}. {q.question}</div>
                        <div className="space-y-2">
                          {q.options.map((opt, j) => (
                            <label key={j} className={`block px-4 py-2 rounded-lg cursor-pointer transition-all ${quizAnswers[i] === j ? "bg-orange-400 text-black font-bold" : "bg-gray-700 text-white hover:bg-gray-600"}`}>
                              <input
                                type="radio"
                                name={`q${i}`}
                                value={j}
                                checked={quizAnswers[i] === j}
                                onChange={() => {
                                  if (!quizSubmitted) {
                                    setQuizAnswers(prev => prev.map((a, idx) => idx === i ? j : a));
                                  }
                                }}
                                className="mr-2"
                                disabled={quizSubmitted}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!quizSubmitted ? (
                      <button
                        type="submit"
                        className="w-full mt-6 py-3 rounded-lg font-semibold text-lg bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg"
                        disabled={quizAnswers.some(a => a === null)}
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <div className="mt-6 space-y-4 text-center">
                        <div className="text-2xl font-bold text-orange-300">Your Score: {quizScore}%</div>
                        <div className="text-lg text-white">{quizFeedback}</div>
                        <button
                          type="button"
                          className="mt-4 px-6 py-3 bg-gray-700 text-orange-300 font-bold rounded-lg shadow hover:bg-orange-500 hover:text-black transition"
                          onClick={() => {
                            setQuizAnswers(Array(quizQuestions.length).fill(null));
                            setQuizSubmitted(false);
                            setQuizScore(0);
                            setQuizFeedback("");
                          }}
                        >
                          Retry Quiz
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
} 