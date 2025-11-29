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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="https://github.com/yogeshpaliyal/browser-ai" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-400 ring-1 ring-inset ring-blue-500/20">What's new</span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                  <span>Just shipped v1.0</span>
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.16 8 7.23 4.29a.75.75 0 011.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Browser AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Playground</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Unlock the power of on-device AI. Run advanced machine learning models directly in your browser with privacy, speed, and no server costs.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a href="#apis" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                Explore APIs
              </a>
              <a href="https://github.com/yogeshpaliyal/browser-ai" target="_blank" className="text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-blue-400 transition-colors">
                View on GitHub <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="rounded-md shadow-2xl ring-1 ring-gray-900/10 bg-white/5 backdrop-blur-sm border border-white/10 p-6 w-[24rem] sm:w-[30rem] md:w-[35rem]">
                   <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Text to Summarize
                        </label>
                        <div className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-gray-200 text-sm leading-relaxed h-32 overflow-hidden relative">
                          <p>Artificial Intelligence (AI) is rapidly transforming the way we interact with technology. By running AI models directly in the browser, developers can create privacy-preserving applications that don't rely on sending sensitive user data to the cloud. This approach, known as on-device AI, also reduces latency and enables offline functionality, making web apps more robust and responsive.</p>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                      </div>

                      <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 opacity-90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span className="text-sm">Generate Summary</span>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                          <h2 className="font-semibold text-gray-200 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Summary Result
                          </h2>
                        </div>
                        <div className="p-4 bg-black/20">
                          <div className="text-gray-300 text-sm leading-relaxed">
                            On-device AI enables privacy-preserving, low-latency, and offline-capable web applications by running models directly in the browser instead of the cloud.
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>

      <div id="apis" className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Available APIs
          </h2>
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
