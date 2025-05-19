"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation'; // Assuming Navigation is needed here too

// Only import browser-only libraries on the client
let PDFDocument: any = null;
let mammoth: any = null;
let pdfjs: any = null;
// PDF parsing is only available in the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  PDFDocument = require('pdf-lib').PDFDocument;
  // @ts-ignore
  mammoth = require('mammoth');
  // @ts-ignore
  pdfjs = require('pdfjs-dist');
  if (pdfjs && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
}

interface ScoreBreakdown {
  content: number;
  formatting: number;
  keywords: number;
  achievements: number;
  grammar: number;
}

interface DetailedFeedback {
  content: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
  };
  formatting: {
    layout: string;
    consistency: string;
    spacing: string;
  };
  achievements: {
    metrics: string;
    impact: string;
    relevance: string;
  };
  keywords: {
    industryTerms: string;
    actionVerbs: string;
    technicalSkills: string;
  };
}

interface IndustryBenchmarks {
  averageScore: number;
  topPercentile: number;
  keywordMatchRate: string;
  achievementMetrics: string;
  formattingScore: string;
}

interface IndustryStandards {
  tech: {
    requiredSkills: string[];
    keywords: string[];
    metrics: string[];
    certifications: string[];
  };
  entertainment: {
    requiredSkills: string[];
    keywords: string[];
    metrics: string[];
    certifications: string[];
  };
  business: {
    requiredSkills: string[];
    keywords: string[];
    metrics: string[];
    certifications: string[];
  };
}

const INDUSTRY_STANDARDS: IndustryStandards = {
  tech: {
    requiredSkills: ['Python', 'JavaScript', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agile', 'REST APIs'],
    keywords: ['software development', 'cloud computing', 'machine learning', 'data analysis', 'system architecture', 'devops'],
    metrics: ['code coverage', 'performance improvement', 'system uptime', 'response time', 'user adoption'],
    certifications: ['AWS', 'Azure', 'Google Cloud', 'CISSP', 'CompTIA']
  },
  entertainment: {
    requiredSkills: ['Adobe Creative Suite', 'Final Cut Pro', 'After Effects', 'Premiere Pro', 'Motion Graphics', '3D Modeling'],
    keywords: ['content creation', 'digital media', 'visual effects', 'animation', 'storytelling', 'post-production'],
    metrics: ['viewership', 'engagement rates', 'production efficiency', 'audience growth', 'content performance'],
    certifications: ['Adobe Certified', 'Avid Certified', 'Final Cut Pro Certified']
  },
  business: {
    requiredSkills: ['Project Management', 'Data Analysis', 'Strategic Planning', 'Financial Modeling', 'Market Research'],
    keywords: ['business strategy', 'market analysis', 'stakeholder management', 'process improvement', 'risk management'],
    metrics: ['revenue growth', 'cost reduction', 'market share', 'ROI', 'customer acquisition'],
    certifications: ['PMP', 'Six Sigma', 'MBA', 'CFA', 'CPA']
  }
};

interface ResumeAnalysis {
  filename: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  sectionsAnalyzed: string[];
  stats: {
    keywordsMatched: number;
    actionVerbsUsed: number;
    bulletPointsPerJob: string;
    resumeLengthPages: number;
    achievementMetrics: number;
    industryKeywords: number;
    educationRelevance: string;
    skillAlignment: string;
  };
  detailedFeedback: DetailedFeedback;
  improvementSuggestions: string[];
  industryBenchmarks: IndustryBenchmarks;
}

function parseGeminiFeedback(feedback: string) {
  // More robust parsing for Gemini's markdown-like output
  const getSection = (label: string) => {
    const regex = new RegExp(`\*\*${label}[:\/]?\*\*[\s\n]*([\s\S]*?)(?=\*\*|$)`, 'i');
    const match = feedback.match(regex);
    return match ? match[1].trim() : '';
  };
  const summary = getSection('Summary of Strengths');
  const improvements = getSection('Areas for Improvement');
  const actions = getSection('Actionable Feedback');
  // Try both possible section headers for red flags
  let redFlags = getSection('Missing Sections / Red Flags');
  if (!redFlags) redFlags = getSection('Missing Sections');
  if (!redFlags) redFlags = getSection('Red Flags');
  const scoreMatch = feedback.match(/\*\*Score.*?(\d{1,3})\/100/);
  return {
    summary,
    improvements,
    actions,
    score: scoreMatch ? parseInt(scoreMatch[1]) : null,
    redFlags,
  };
}

export default function ResumeCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');

  const parsedFeedback = useMemo(() => feedback ? parseGeminiFeedback(feedback) : null, [feedback]);

  // Animate progress bar while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + Math.random() * 5 : prev));
      }, 120);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Only define extractTextFromFile on the client
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    if (typeof window === 'undefined' || !pdfjs || !mammoth) {
      throw new Error('This feature is only available in the browser.');
    }
    const fileType = file.type;
    const fileContent = await file.arrayBuffer();

    if (fileType === 'application/pdf') {
      const pdf = await pdfjs.getDocument({ data: fileContent }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        fullText += pageText + '\n';
      }
      return fullText;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               fileType === 'application/msword') {
      const result = await mammoth.extractRawText({ arrayBuffer: fileContent });
      return result.value;
    }
    throw new Error('Unsupported file type');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFeedback(null);
      setError(null);
    }
  };

  const handleCheckResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }
    setLoading(true);
    setFeedback(null);
    setError(null);
    try {
      if (typeof window === 'undefined') {
        setError('This feature is only available in the browser.');
        setLoading(false);
        return;
      }
      const text = await extractTextFromFile(file);
      setExtractedText(text);
      if (!text || text.length < 200) {
        setError('Could not extract enough text from your resume. Please upload a higher quality PDF or DOCX.');
        setLoading(false);
        return;
      }
      // Send to Gemini API route
      const res = await fetch('/api/gemini-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });
      const data = await res.json();
      if (
        data.feedback &&
        data.feedback.trim().length > 0 &&
        !data.feedback.toLowerCase().includes('absolutely no information') &&
        !data.feedback.toLowerCase().includes('completely empty') &&
        !data.feedback.toLowerCase().includes('impossible')
      ) {
        setFeedback(data.feedback);
      } else {
        setError('Could not extract enough text from your resume, or the AI could not analyze it. Please upload a higher quality, text-based PDF or DOCX.');
      }
    } catch (err) {
      setError('An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navigation />

      {/* Main content area below the header, with calculated height and scrolling */}
      {/* Adjust the top value if your Navigation component's height + padding is different */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pt-32 pb-8 px-4 overflow-y-auto" style={{ top: '128px' }}> {/* Absolute position below header, pt for header height, overflow for scrolling */}
        {/* Inner container for max width and centering content */}
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Page Title and subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 w-full"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              AI Resume Checker
            </h1>
            <p className="text-xl text-gray-300">
              Upload your resume and get AI-powered feedback.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Icon Placeholders - Replace with actual icons */}
          <div className="flex justify-center space-x-12 mb-12 w-full">
            {['📄', '🧠', '📈'].map((icon, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl metallic-glow"
              >{icon}</motion.div>
            ))}
          </div>

          {/* Main content area with form and results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-effect p-8 rounded-xl w-full bg-gray-900/80 backdrop-blur-sm">
            <form onSubmit={handleCheckResume} className="space-y-6">
              {/* File Upload Section */}
              <div>
                <label htmlFor="resumeFile" className="block text-lg font-medium text-gray-200 mb-4">
                  Upload your resume (PDF or DOCX)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-lg file:font-medium file:bg-silver-400 file:text-black file:cursor-pointer file:transition file:hover:bg-silver-500 bg-gray-800/80 text-gray-200 rounded-full w-full"
                  />
                  {file && <span className="text-sm text-gray-300">{file.name}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full py-4 px-8 rounded-lg font-medium text-lg transition-all shadow-lg
                  ${!file || loading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-silver-400 to-silver-600 hover:from-silver-500 hover:to-silver-700 hover:shadow-silver-400/30'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-silver-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    Checking...
                  </span>
                ) : 'Check Resume'}
              </button>
            </form>

            {/* Progress Bar */}
            {loading && (
              <div className="w-full mt-8 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-silver-400 text-sm font-semibold">Analyzing...</span>
                  <span className="text-silver-400 text-sm font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-silver-400 to-silver-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            {extractedText && (
              <div className="mt-4 p-4 bg-gray-900/80 rounded text-xs text-gray-400 max-h-40 overflow-auto">
                <div className="mb-2 font-bold text-silver-400">Extracted Resume Text (debug):</div>
                <pre>{extractedText.slice(0, 2000) || '[No text extracted]'}</pre>
              </div>
            )}

            {/* Gemini Feedback Section */}
            {parsedFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 p-6 bg-gray-800/90 rounded-xl space-y-10 shadow-xl text-left"
              >
                <h3 className="text-2xl font-semibold mb-6 gradient-text">Gemini AI Feedback</h3>
                {/* Responsive layout for score and summary */}
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                  {parsedFeedback.score !== null && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="#444" strokeWidth="10" fill="none" />
                        <circle
                          cx="50" cy="50" r="45"
                          stroke="#c0c0c0"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 45}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - parsedFeedback.score / 100)}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.8s' }}
                        />
                        <text x="50" y="56" textAnchor="middle" fontSize="2.2em" fill="#fff" fontWeight="bold">{parsedFeedback.score}</text>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-silver-400 font-bold">Score</div>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="mb-2 text-xl font-bold text-silver-400">Summary of Strengths</div>
                    <div className="text-gray-100 whitespace-pre-line leading-relaxed text-base bg-gray-900/80 rounded-lg px-4 py-3 shadow">
                      {parsedFeedback.summary || 'None'}
                    </div>
                  </div>
                </div>
                {/* Improvements */}
                <div className="mb-8">
                  <div className="mb-3 text-xl font-bold text-yellow-300">Areas for Improvement</div>
                  <div className="space-y-4">
                    {parsedFeedback.improvements
                      ? parsedFeedback.improvements.split(/\n|\*/).filter(Boolean).map((item, idx) => (
                          <div key={idx} className="bg-gray-900/80 rounded-lg px-4 py-3 text-gray-200 text-base leading-relaxed shadow">
                            {item.trim()}
                          </div>
                        ))
                      : <div className="bg-gray-900/80 rounded-lg px-4 py-3 text-gray-400 text-base leading-relaxed shadow">None</div>}
                  </div>
                </div>
                {/* Actionable Feedback */}
                <div className="mb-8">
                  <div className="mb-3 text-xl font-bold text-silver-400">Actionable Feedback</div>
                  <div className="space-y-4">
                    {parsedFeedback.actions
                      ? parsedFeedback.actions.split(/\n|\*/).filter(Boolean).map((item, idx) => (
                          <div key={idx} className="bg-gray-900/80 rounded-lg px-4 py-3 text-gray-200 text-base leading-relaxed shadow">
                            {item.trim()}
                          </div>
                        ))
                      : <div className="bg-gray-900/80 rounded-lg px-4 py-3 text-gray-400 text-base leading-relaxed shadow">None</div>}
                  </div>
                </div>
                {/* Red Flags */}
                <div className="mb-8">
                  <div className="mb-3 text-xl font-bold text-red-400">Missing Sections / Red Flags</div>
                  <div className="bg-gray-900/80 rounded-lg px-4 py-3 text-red-200 text-base leading-relaxed shadow whitespace-pre-line">
                    {parsedFeedback.redFlags && parsedFeedback.redFlags.trim() ? parsedFeedback.redFlags : 'None'}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div> {/* End of inner container for max width */}
      </div> {/* End of main content area */}
    </main>
  );
} 