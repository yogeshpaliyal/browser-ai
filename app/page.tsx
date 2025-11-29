"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ApiStatus {
  name: string;
  key: string;
  status: "checking" | "available" | "after-download" | "unavailable";
  path: string;
  description: string;
  icon: React.ReactNode;
}

export default function StatusPage() {
  const [statuses, setStatuses] = useState<ApiStatus[]>([
    {
      name: "Prompt API",
      key: "languageModel",
      status: "checking",
      path: "/prompt",
      description: "General purpose language model for chat and text generation.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: "Summarizer API",
      key: "summarizer",
      status: "checking",
      path: "/summarizer",
      description: "Summarize long texts into concise key points or summaries.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
    {
      name: "Writer API",
      key: "writer",
      status: "checking",
      path: "/writer",
      description: "Generate new content based on context and prompts.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: "Rewriter API",
      key: "rewriter",
      status: "checking",
      path: "/rewriter",
      description: "Rewrite and polish existing text with different tones.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      name: "Language Detection",
      key: "languageDetector",
      status: "checking",
      path: "/language-detection",
      description: "Detect the language of a given text.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
  ]);

  useEffect(() => {
    async function checkStatuses() {
      const newStatuses = await Promise.all(
        statuses.map(async (api) => {
          let status: "available" | "after-download" | "unavailable" = "unavailable";
          try {
            // Check specific APIs based on their keys and known locations
            if (api.key === "languageModel") {
              // @ts-ignore
              if (window.ai?.languageModel) {
                // @ts-ignore
                const availability = await window.ai.languageModel.availability();
                status = (availability as any) === "available" ? "available" : (availability as any) === "after-download" ? "after-download" : "unavailable";
              } else if (window.LanguageModel) {
                const availability = await window.LanguageModel.availability();
                status = availability === "available" ? "available" : "unavailable";
              }
            } else if (api.key === "summarizer") {
              if (window.ai?.summarizer) {
                const availability = await window.ai.summarizer.availability();
                status = availability === "available" ? "available" : "unavailable";
              } else if (window.Summarizer) {
                const availability = await window.Summarizer.availability();
                status = availability === "available" ? "available" : "unavailable";
              }
            } else if (api.key === "writer") {
              const writerApi = window.ai?.writer || window.Writer;
              if (writerApi) {
                status = await writerApi.availability() as any;
                if (status as any === "no") status = "unavailable";
                if (status as any === "readily") status = "available";
              }
            } else if (api.key === "rewriter") {
              const rewriterApi = window.ai?.rewriter || window.Rewriter;
              if (rewriterApi) {
                status = await rewriterApi.availability() as any;
                if (status as any === "no") status = "unavailable";
                if (status as any === "readily") status = "available";
              }
            } else if (api.key === "languageDetector") {
              const detectorApi = window.ai?.languageDetector || window.LanguageDetector;
              if (detectorApi) {
                status = await detectorApi.availability() as any;
                if (status as any === "no") status = "unavailable";
                if (status as any === "readily") status = "available";
              }
            }
          } catch (e) {
            console.error(`Error checking ${api.name}:`, e);
            status = "unavailable";
          }
          return { ...api, status };
        })
      );
      setStatuses(newStatuses);
    }

    checkStatuses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
            Browser AI Status
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Overview of available on-device AI capabilities in your browser.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((api) => (
            <Link
              href={api.path}
              key={api.key}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${api.status === 'available' ? 'from-green-500/20 to-emerald-500/20 text-green-400' :
                  api.status === 'after-download' ? 'from-yellow-500/20 to-orange-500/20 text-yellow-400' :
                    'from-red-500/20 to-pink-500/20 text-red-400'
                  }`}>
                  {api.icon}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${api.status === 'available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  api.status === 'after-download' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    api.status === 'checking' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {api.status === 'checking' ? 'Checking...' : api.status.replace('-', ' ')}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {api.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {api.description}
              </p>

              <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                <span>Open Playground</span>
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
