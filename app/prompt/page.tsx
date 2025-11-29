"use client";

import { useState, useEffect } from "react";
import ApiUnavailable from "../components/ApiUnavailable";
import { createModelMonitor } from "../utils/ai-utils";

export default function PromptPlayground() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<AITextSession | null>(null);
  const [modelAvailable, setModelAvailable] = useState<"available" | "unavailable">("unavailable");
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    async function init() {
      console.log("Checking for Language Model API...");
      const ai = window.ai?.languageModel ?? window.LanguageModel;
      // @ts-ignore
      if (ai) {
        // @ts-ignore
        const availability = await ai.availability();
        setModelAvailable((availability as any) === "available" || (availability as any) === "readily" ? "available" : "unavailable");

        // Only auto-initialize if readily available
        if ((availability as any) === "available") {
          try {
            // @ts-ignore
            const newSession = await window.ai.languageModel.create({
              monitor: createModelMonitor(setDownloadProgress),
            });
            setSession(newSession);
          } catch (error) {
            console.error("Error creating session:", error);
          }
        }
      }
    }
    init();
  }, []);

  const handleSubmit = async () => {
    if (!session) {
      alert("Model is initializing. Please wait.");
      return;
    }
    setLoading(true);
    setResponse("");
    try {
      const result = await session.prompt(prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error during AI call:", error);
      setResponse("An error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-4">
            AI Chat Playground
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Interact with a powerful on-device language model directly in your browser.
          </p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {modelAvailable === 'unavailable' && (
            <ApiUnavailable
              apiName="Language Model API"
              docsUrl="https://developer.chrome.com/docs/ai/built-in-apis"
            />
          )}

          {modelAvailable === 'available' && !session && (
            <div className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mb-6 animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Initializing AI Model</h2>
                <p className="text-gray-400">Please wait while we prepare the language model...</p>
              </div>

              {downloadProgress > 0 && downloadProgress < 100 && (
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Downloading model...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {session && (
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Your Prompt
                  </label>
                  <textarea
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none text-base leading-relaxed"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask me anything..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {prompt.length} chars
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                  disabled={loading || !prompt}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Response</span>
                    </>
                  )}
                </button>

                {response && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-200 flex items-center gap-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          AI Response
                        </h2>
                        <button
                          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                          onClick={() => navigator.clipboard.writeText(response)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <div className="p-6 bg-black/20">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{response}</p>
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
