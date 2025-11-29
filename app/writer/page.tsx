"use client";

import { useState, useEffect } from "react";
import ApiUnavailable from "../components/ApiUnavailable";
import DownloadStatus from "../components/DownloadStatus";
import { createModelMonitor } from "../utils/ai-utils";

export default function WriterPlayground() {
    const [inputText, setInputText] = useState("");
    const [context, setContext] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiAvailable, setApiAvailable] = useState<string | null>(null);
    const [session, setSession] = useState<WriterSession | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        async function init() {
            const writerApi = window.ai?.writer || window.Writer;
            if (writerApi) {
                try {
                    const availability = await writerApi.availability();
                    setApiAvailable(availability);

                    // Only auto-initialize if readily available
                    // if (availability === 'readily') {
                        try {
                            const newSession = await writerApi.create({
                                sharedContext: context,
                                monitor: createModelMonitor(setDownloadProgress),
                            });
                            setSession(newSession);
                        } catch (error) {
                            console.error("Error creating session:", error);
                        }
                    // }
                } catch (e) {
                    console.error("Error checking availability:", e);
                    setApiAvailable("no");
                }
            } else {
                setApiAvailable("no");
            }
        }
        init();
    }, []);

    const handleCreateSession = async () => {
        const writerApi = window.ai?.writer || window.Writer;
        if (!writerApi) return;

        try {
            const newSession = await writerApi.create({
                sharedContext: context,
                monitor: createModelMonitor(setDownloadProgress),
            });
            setSession(newSession);
        } catch (error) {
            console.error("Error creating session:", error);
            alert("Failed to create writer session.");
        }
    };

    const handleWrite = async () => {
        if (!session) {
            alert("Writer is initializing. Please wait.");
            return;
        }
        setLoading(true);
        setGeneratedText("");
        try {
            const result = await session.write(inputText);
            setGeneratedText(result);
        } catch (error) {
            console.error("Error writing:", error);
            setGeneratedText("Error occurred during writing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 mb-4">
                        AI Writer
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Generate creative content with the help of local AI.
                    </p>
                </header>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {apiAvailable === null && (
                        <div className="flex items-center justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    )}
                    {apiAvailable === "no" && (
                        <ApiUnavailable
                            apiName="Writer API"
                            docsUrl="https://developer.chrome.com/docs/ai/built-in"
                        />
                    )}
                    {(apiAvailable === 'after-download' || apiAvailable === 'readily') && !session && (
                        <DownloadStatus
                            status={apiAvailable}
                            progress={downloadProgress}
                            onInitialize={handleCreateSession}
                            modelName="Writer"
                            color="emerald"
                        />
                    )}
                    {session && (
                        <div className="p-6 md:p-8">
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Shared Context (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="e.g. Writing a blog post about technology"
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <textarea
                                        className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-5 text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="What would you like to write about?"
                                    />
                                </div>

                                <button
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    onClick={handleWrite}
                                    disabled={loading || !inputText}
                                >
                                    {loading ? "Writing..." : "Generate Content"}
                                </button>

                                {generatedText && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="p-6 bg-black/20">
                                            <div className="prose prose-invert max-w-none">
                                                <p>{generatedText}</p>
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
