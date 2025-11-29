"use client";

import { useState, useEffect } from "react";
import ApiUnavailable from "../components/ApiUnavailable";
import DownloadStatus from "../components/DownloadStatus";
import { createModelMonitor } from "../utils/ai-utils";

export default function LanguageDetectionPlayground() {
    const [inputText, setInputText] = useState("");
    const [results, setResults] = useState<DetectedLanguage[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiAvailable, setApiAvailable] = useState<"readily" | "after-download" | "no">("no");
    const [detector, setDetector] = useState<LanguageDetector | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        async function init() {
            const detectorApi = window.ai?.languageDetector || window.LanguageDetector;
            if (detectorApi) {
                try {
                    const availability = await detectorApi.availability();
                    setApiAvailable(availability);

                    if (availability !== 'no') {
                        try {
                            const newDetector = await detectorApi.create({
                                monitor: createModelMonitor(setDownloadProgress),
                            });
                            setDetector(newDetector);
                        } catch (error) {
                            console.error("Error creating detector:", error);
                        }
                    }
                } catch (e) {
                    console.error("Error checking availability:", e);
                    setApiAvailable("no");
                }
            }
        }
        init();
    }, []);

    const handleDetect = async () => {
        if (!detector) {
            alert("Detector is initializing. Please wait.");
            return;
        }
        setLoading(true);
        setResults([]);
        try {
            const result = await detector.detect(inputText);
            setResults(result);
        } catch (error) {
            console.error("Error detecting language:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-500 to-purple-500 mb-4">
                        Language Detection
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Identify the language of any text with high accuracy.
                    </p>
                </header>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {apiAvailable === "no" && (
                        <ApiUnavailable
                            apiName="Language Detection API"
                            docsUrl="https://developer.chrome.com/docs/ai/built-in"
                        />
                    )}
                    {apiAvailable !== "no" && !detector && (
                        <DownloadStatus
                            status={apiAvailable}
                            progress={downloadProgress}
                            modelName="Language Detector"
                            color="indigo"
                        />
                    )}

                    {detector && (
                        <div className="p-6 md:p-8">
                            <div className="space-y-6">
                                <div className="relative">
                                    <textarea
                                        className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-5 text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Enter text to detect language..."
                                    />
                                </div>

                                <button
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    onClick={handleDetect}
                                    disabled={loading || !inputText}
                                >
                                    {loading ? "Detecting..." : "Detect Language"}
                                </button>

                                {results.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-white/5 px-6 py-3 border-b border-white/10">
                                            <h2 className="font-semibold text-gray-200">Results</h2>
                                        </div>
                                        <div className="p-0">
                                            <table className="w-full text-left">
                                                <thead className="bg-black/20 text-gray-400 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-6 py-3">Language Code</th>
                                                        <th className="px-6 py-3">Confidence</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/10">
                                                    {results.map((res, idx) => (
                                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-6 py-4 font-mono text-indigo-300">{res.detectedLanguage}</td>
                                                            <td className="px-6 py-4 text-gray-300">{(res.confidence * 100).toFixed(1)}%</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
