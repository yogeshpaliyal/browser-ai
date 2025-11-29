"use client";

import { useState, useEffect } from "react";
import ApiUnavailable from "../components/ApiUnavailable";
import DownloadStatus from "../components/DownloadStatus";
import { createModelMonitor } from "../utils/ai-utils";

export default function RewriterPlayground() {
    const [inputText, setInputText] = useState("");
    const [rewrittenText, setRewrittenText] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiAvailable, setApiAvailable] = useState<"readily" | "after-download" | "no">("no");
    const [session, setSession] = useState<RewriterSession | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // Options
    const [tone, setTone] = useState<"formal" | "casual" | "neutral">("neutral");
    const [length, setLength] = useState<"short" | "medium" | "long">("medium");
    const [format, setFormat] = useState<"markdown" | "plain-text">("plain-text");
    const [context, setContext] = useState("");

    useEffect(() => {
        async function init() {
            const rewriterApi = window.ai?.rewriter || window.Rewriter;
            if (rewriterApi) {
                try {
                    const availability = await rewriterApi.availability();
                    setApiAvailable(availability);

                    // Only auto-initialize if readily available (no download needed)
                    // if (availability === 'readily') {
                        try {
                            const newSession = await rewriterApi.create({
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
            }
        }
        init();
    }, []);

    const handleCreateSession = async () => {
        const rewriterApi = window.ai?.rewriter || window.Rewriter;
        if (!rewriterApi) return;

        try {
            const newSession = await rewriterApi.create({
                sharedContext: context,
                monitor: createModelMonitor(setDownloadProgress),
            });
            setSession(newSession);
        } catch (error) {
            console.error("Error creating session:", error);
            alert("Failed to create rewriter session.");
        }
    };

    const handleRewrite = async () => {
        if (!session) {
            alert("Rewriter is initializing. Please wait.");
            return;
        }
        setLoading(true);
        setRewrittenText("");
        try {
            const result = await session.rewrite(inputText);
            setRewrittenText(result);
        } catch (error) {
            console.error("Error rewriting:", error);
            setRewrittenText("Error occurred during rewriting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 mb-4">
                        AI Rewriter
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Refine and polish your text with local AI assistance.
                    </p>
                </header>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {apiAvailable === "no" && (
                        <ApiUnavailable
                            apiName="Rewriter API"
                            docsUrl="https://developer.chrome.com/docs/ai/built-in"
                        />
                    )}
                    {(apiAvailable === 'after-download' || apiAvailable === 'readily') && !session && (
                        <DownloadStatus
                            status={apiAvailable}
                            progress={downloadProgress}
                            onInitialize={handleCreateSession}
                            modelName="Rewriter"
                            color="orange"
                        />
                    )}

                    {session && (
                        <div className="p-6 md:p-8">
                            <div className="space-y-6">
                                <div className="relative">
                                    <textarea
                                        className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-5 text-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste text to rewrite..."
                                    />
                                </div>

                                <button
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    onClick={handleRewrite}
                                    disabled={loading || !inputText}
                                >
                                    {loading ? "Rewriting..." : "Rewrite Text"}
                                </button>

                                {rewrittenText && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
                                            <h2 className="font-semibold text-gray-200">Result</h2>
                                            <button
                                                className="text-xs text-gray-400 hover:text-white transition-colors"
                                                onClick={() => navigator.clipboard.writeText(rewrittenText)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <div className="p-6 bg-black/20">
                                            <div className="prose prose-invert max-w-none">
                                                <p>{rewrittenText}</p>
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
