"use client";

import { useState, useEffect } from "react";
import ApiUnavailable from "../components/ApiUnavailable";
import DownloadStatus from "../components/DownloadStatus";
import { createModelMonitor } from "../utils/ai-utils";

export default function SummarizerPlayground() {
  const [inputText, setInputText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizerAvailable, setSummarizerAvailable] = useState<string>("unavailable");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [summarizerSession, setSummarizerSession] =
    useState<SummarizerSession | null>(null);

  // Summarizer options
  const [sharedContext, setSharedContext] = useState("This is a scientific article");
  const [summaryType, setSummaryType] = useState<"key-points" | "summary">(
    "key-points"
  );
  const [summaryFormat, setSummaryFormat] = useState<"markdown" | "plaintext">(
    "markdown"
  );
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">(
    "medium"
  );

  useEffect(() => {
    async function init() {
      const summarizerApi = window.ai?.summarizer || window.Summarizer;
      
      if (summarizerApi) {
        try {
          const availability = await summarizerApi.availability();
          setSummarizerAvailable(availability);

            try {
              const session = await summarizerApi.create({
                monitor: createModelMonitor(setDownloadProgress),
              });
              setSummarizerSession(session);
            } catch (error) {
              console.error("Error creating summarizer:", error);
            }
        } catch (e) {
          console.error("Error checking availability:", e);
          setSummarizerAvailable("unavailable");
        }
      }
    }
    init();
  }, []);

  const handleCreateSummarizer = async () => {
    const summarizerApi = window.ai?.summarizer || window.Summarizer;
    if (!summarizerApi) {
      alert("Summarizer API not available.");
      return;
    }

    try {
      const session = await summarizerApi.create({
        monitor: createModelMonitor(setDownloadProgress),
      });
      setSummarizerSession(session);
    } catch (error) {
      console.error("Error creating summarizer:", error);
      alert("Failed to create summarizer. Check console for details.");
    }
  };

  const handleSummarize = async () => {
    if (!summarizerSession) {
      alert("Summarizer is initializing. Please wait.");
      return;
    }
    setLoading(true);
    setSummarizedText("");
    try {
      const result = await summarizerSession.summarize(inputText, {
        sharedContext,
        type: summaryType,
        format: summaryFormat,
        length: summaryLength,
      });
      setSummarizedText(result);
    } catch (error) {
      console.error("Error during summarization:", error);
      setSummarizedText(
        `An error occurred. ${error instanceof Error ? error.message : "Please check the console for details."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
            AI Summarizer
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform long text into concise summaries instantly using the power of local browser AI.
          </p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {summarizerAvailable === 'no' || summarizerAvailable === 'unavailable' ? (
            <ApiUnavailable
              apiName="Summarizer API"
              docsUrl="https://developer.chrome.com/docs/ai/summarizer-api"
            />
          ) : null}

          {(summarizerAvailable === 'after-download' || summarizerAvailable === 'downloading' || summarizerAvailable === 'downloadable') && !summarizerSession && (
            <DownloadStatus
              status={summarizerAvailable}
              progress={downloadProgress}
              onInitialize={handleCreateSummarizer}
              modelName="Summarizer"
              color="blue"
            />
          )}

          {(summarizerAvailable === 'available' || summarizerAvailable === 'readily') && !summarizerSession && (
             <div className="p-12 text-center">
               <div className="mb-8">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-6 animate-pulse">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                   </svg>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Initializing Summarizer</h2>
                 <p className="text-gray-400">Please wait while we prepare the summarizer model...</p>
               </div>
             </div>
          )}

          {summarizerSession && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Context</label>
                  <input
                    type="text"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                    value={sharedContext}
                    onChange={(e) => setSharedContext(e.target.value)}
                    placeholder="e.g. Scientific article"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                  <div className="relative">
                    <select
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      value={summaryType}
                      onChange={(e) =>
                        setSummaryType(e.target.value as "key-points" | "summary")
                      }
                    >
                      <option value="key-points" className="bg-gray-900">Key Points</option>
                      <option value="summary" className="bg-gray-900">Summary</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Format</label>
                  <div className="relative">
                    <select
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      value={summaryFormat}
                      onChange={(e) =>
                        setSummaryFormat(e.target.value as "markdown" | "plaintext")
                      }
                    >
                      <option value="markdown" className="bg-gray-900">Markdown</option>
                      <option value="plaintext" className="bg-gray-900">Plain Text</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Length</label>
                  <div className="relative">
                    <select
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      value={summaryLength}
                      onChange={(e) =>
                        setSummaryLength(
                          e.target.value as "short" | "medium" | "long"
                        )
                      }
                    >
                      <option value="short" className="bg-gray-900">Short</option>
                      <option value="medium" className="bg-gray-900">Medium</option>
                      <option value="long" className="bg-gray-900">Long</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-base leading-relaxed"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your text here to summarize..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {inputText.length} chars
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  onClick={handleSummarize}
                  disabled={loading || !inputText}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Summary</span>
                    </>
                  )}
                </button>

                {summarizedText && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-200 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Result
                        </h2>
                        <button
                          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                          onClick={() => navigator.clipboard.writeText(summarizedText)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <div className="p-6 bg-black/20">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{summarizedText}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
