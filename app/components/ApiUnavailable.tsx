interface ApiUnavailableProps {
    apiName: string;
    docsUrl?: string;
}

export default function ApiUnavailable({ apiName, docsUrl }: ApiUnavailableProps) {
    const generalDocsUrl = docsUrl || "https://developer.chrome.com/docs/ai/built-in";

    return (
        <div className="p-8 bg-yellow-500/10 border-b border-yellow-500/20">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-yellow-400 mb-3 text-center">
                    {apiName} Not Available
                </h3>
                <p className="text-yellow-200/80 mb-6 text-center">
                    The {apiName} is not available on this device or browser.
                </p>

                <div className="bg-black/20 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        How to Enable
                    </h4>
                    <ol className="space-y-3 text-sm text-gray-300">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs font-bold">
                                1
                            </span>
                            <div>
                                <strong className="text-white">Use Chrome Canary or Dev:</strong>
                                <p className="text-gray-400 mt-1">
                                    Download{" "}
                                    <a
                                        href="https://www.google.com/chrome/canary/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-400 hover:text-yellow-300 underline"
                                    >
                                        Chrome Canary
                                    </a>{" "}
                                    or Chrome Dev (version 127+)
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs font-bold">
                                2
                            </span>
                            <div>
                                <strong className="text-white">Enable Experimental Flags:</strong>
                                <p className="text-gray-400 mt-1">
                                    Go to <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-300">chrome://flags</code> and enable:
                                </p>
                                <ul className="mt-2 space-y-1 text-gray-400 ml-4 list-disc">
                                    <li><code className="text-yellow-300 text-xs">Prompt API for Gemini Nano</code></li>
                                    <li><code className="text-yellow-300 text-xs">Summarization API for Gemini Nano</code></li>
                                    <li><code className="text-yellow-300 text-xs">Writer API for Gemini Nano</code></li>
                                    <li><code className="text-yellow-300 text-xs">Rewriter API for Gemini Nano</code></li>
                                    <li><code className="text-yellow-300 text-xs">Language Detection API</code></li>
                                </ul>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs font-bold">
                                3
                            </span>
                            <div>
                                <strong className="text-white">Restart Browser:</strong>
                                <p className="text-gray-400 mt-1">
                                    Relaunch Chrome for the changes to take effect.
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                        href={generalDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Read Documentation
                    </a>
                    <a
                        href="https://www.google.com/chrome/canary/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Chrome Canary
                    </a>
                </div>
            </div>
        </div>
    );
}
