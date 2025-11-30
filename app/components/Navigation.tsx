"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface ApiStatus {
    [key: string]: "available" | "unavailable" | "checking";
}

export default function Navigation() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [apiStatuses, setApiStatuses] = useState<ApiStatus>({
        prompt: "checking",
        summarizer: "checking",
        writer: "checking",
        rewriter: "checking",
        language: "checking",
    });

    useEffect(() => {
        async function checkAllApis() {
            const statuses: ApiStatus = {};

            // Check Prompt API (LanguageModel)
            try {
                const promptApi = window.ai?.languageModel ?? window.LanguageModel;
                // @ts-ignore
                if (promptApi) {
                    // @ts-ignore
                    const availability = await promptApi.availability();
                    statuses.prompt = availability;
                } else {
                    statuses.prompt = "unavailable";
                }
            } catch (e) {
                statuses.prompt = "unavailable";
            }

            // Check Summarizer API
            try {
                const summarizerApi = window.ai?.summarizer ?? window.Summarizer;
                if (summarizerApi) {
                    const availability = await summarizerApi.availability();
                    statuses.summarizer = availability;
                } else {
                    statuses.summarizer = "unavailable";
                }
            } catch (e) {
                statuses.summarizer = "unavailable";
            }
            

            // Check Writer API
            try {
                const writerApi = window.ai?.writer || window.Writer;
                if (writerApi) {
                    const availability = await writerApi.availability();
                    //@ts-ignore
                    statuses.writer = availability === "readily" || availability === "after-download" || availability === "available" ? "available" : "unavailable";
                } else {
                    statuses.writer = "unavailable";
                }
            } catch (e) {
                statuses.writer = "unavailable";
            }

            // Check Rewriter API
            try {
                const rewriterApi = window.ai?.rewriter || window.Rewriter;
                if (rewriterApi) {
                    const availability = await rewriterApi.availability();
                    //@ts-ignore
                    statuses.rewriter = availability === "readily" || availability === "after-download" || availability === "available" ? "available" : "unavailable";
                } else {
                    statuses.rewriter = "unavailable";
                }
            } catch (e) {
                statuses.rewriter = "unavailable";
            }

            // Check Language Detection API
            try {
                const detectorApi = window.ai?.languageDetector || window.LanguageDetector;
                if (detectorApi) {
                    const availability = await detectorApi.availability();
                    statuses.language = (availability as any) !== "no" ? "available" : "unavailable";
                } else {
                    statuses.language = "unavailable";
                }
            } catch (e) {
                statuses.language = "unavailable";
            }

            setApiStatuses(statuses);
        }

        checkAllApis();
    }, []);

    const navItems = [
        {
            name: "Prompt",
            href: "/prompt",
            apiKey: "prompt",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
        },
        {
            name: "Summarizer",
            href: "/summarizer",
            apiKey: "summarizer",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            ),
        },
        {
            name: "Writer",
            href: "/writer",
            apiKey: "writer",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
        {
            name: "Rewriter",
            href: "/rewriter",
            apiKey: "rewriter",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            name: "Language",
            href: "/language-detection",
            apiKey: "language",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
            ),
        },
    ];

    const getStatusIndicator = (apiKey: string | null) => {
        if (!apiKey) return null;
        const status = apiStatuses[apiKey];

        if (status === "checking") {
            return (
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" title="Checking..."></span>
            );
        }

        if (status === "available") {
            return (
                <span className="w-2 h-2 rounded-full bg-green-500" title="Available"></span>
            );
        }

        return (
            <span className="w-2 h-2 rounded-full bg-red-500" title="Unavailable"></span>
        );
    };

    return (
        <header className="bg-black border-b border-white/10 sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hidden sm:block">
                            Browser AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <ul className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? "bg-white/10 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                            {getStatusIndicator(item.apiKey)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="w-px h-6 bg-white/10 mx-2"></div>
                        <a
                            href="https://github.com/yogeshpaliyal/browser-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? "bg-white/10 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {item.icon}
                                            <span className="flex-1">{item.name}</span>
                                            {getStatusIndicator(item.apiKey)}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <a
                                    href="https://github.com/yogeshpaliyal/browser-ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <span className="flex-1">GitHub</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}
