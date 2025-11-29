export { };

declare global {
    interface Window {
        // Legacy / Polyfill / Explainer namespaces
        Summarizer?: {
            availability(): Promise<"available" | "unavailable">;
            create(options: SummarizerOptions): Promise<SummarizerSession>;
        };
        LanguageModel?: {
            availability(): Promise<"available" | "unavailable">;
            create(options?: any): Promise<AITextSession>;
        };
        Writer?: {
            create(options?: WriterOptions): Promise<WriterSession>;
            availability(): Promise<"readily" | "after-download" | "no">;
        };
        Rewriter?: {
            create(options?: RewriterOptions): Promise<RewriterSession>;
            availability(): Promise<"readily" | "after-download" | "no">;
        };
        LanguageDetector?: {
            create(options?: any): Promise<LanguageDetector>;
            availability(): Promise<"readily" | "after-download" | "no">;
        };

        // Standard 'ai' namespace
        ai?: {
            writer?: {
                create(options?: WriterOptions): Promise<WriterSession>;
                availability(): Promise<"readily" | "after-download" | "no">;
            };
            rewriter?: {
                create(options?: RewriterOptions): Promise<RewriterSession>;
                availability(): Promise<"readily" | "after-download" | "no">;
            };
            languageDetector?: {
                create(options?: any): Promise<LanguageDetector>;
                availability(): Promise<"readily" | "after-download" | "no">;
            };
            summarizer?: {
                availability(): Promise<"available" | "unavailable">;
                create(options: SummarizerOptions): Promise<SummarizerSession>;
            };
            languageModel?: {
                availability(): Promise<"available" | "unavailable">;
                create(options?: any): Promise<AITextSession>;
            };
        };
    }

    // Summarizer Types
    interface SummarizerOptions {
        monitor?: (monitor: {
            addEventListener: (
                event: "downloadprogress",
                listener: (e: { loaded: number }) => void
            ) => void;
        }) => void;
        sharedContext?: string;
        type?: "key-points" | "summary";
        format?: "markdown" | "plaintext";
        length?: "short" | "medium" | "long";
    }

    interface SummarizerSession {
        summarize(
            text: string,
            options?: {
                sharedContext?: string;
                type?: "key-points" | "summary";
                format?: "markdown" | "plaintext";
                length?: "short" | "medium" | "long";
            }
        ): Promise<string>;
    }

    // Language Model Types
    interface AITextSession {
        prompt(text: string): Promise<string>;
        destroy(): void;
    }

    // Writer Types
    interface WriterOptions {
        sharedContext?: string;
        monitor?: (m: any) => void;
    }

    interface WriterSession {
        write(input: string, options?: { context?: string }): Promise<string>;
        destroy(): void;
    }

    // Rewriter Types
    interface RewriterOptions {
        sharedContext?: string;
        tone?: "formal" | "casual" | "neutral";
        length?: "short" | "medium" | "long";
        format?: "markdown" | "plain-text";
        monitor?: (m: any) => void;
    }

    interface RewriterSession {
        rewrite(input: string, options?: { context?: string }): Promise<string>;
        destroy(): void;
    }

    // Language Detector Types
    interface LanguageDetector {
        detect(input: string): Promise<DetectedLanguage[]>;
    }

    interface DetectedLanguage {
        detectedLanguage: string;
        confidence: number;
    }
}
